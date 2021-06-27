import {Component, Input, OnInit} from '@angular/core';
import {Member} from '../../_models/member';
import {FileUploader} from 'ng2-file-upload';
import {environment} from '../../../environments/environment';
import {AccountService} from '../../_services/account.service';
import {take} from 'rxjs/operators';
import {User} from '../../_models/user';
import {MembersService} from '../../_services/members.service';
import {Photo} from '../../_models/photo';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() member: Member;
  uploader: FileUploader;
  hasBaseDropzoneOver = false;
  baseUrl = environment.apiUrl;
  user: User;

  constructor(private accountService: AccountService, private memberService: MembersService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropzoneOver = e;
  }

  setMainPhoto(photo: Photo): void {
    this.memberService.setMainPhoto(photo.id).subscribe(() => {
      this.user.photoUrl = photo.url;
      this.accountService.setCurrentUser(this.user);
      this.member.photoUrl = photo.url;
      this.member.photos.forEach(p => {
        if (p.isMain) {
          p.isMain = false;
        }
        if (p.id === photo.id) {
          photo.isMain = true;
        }
      });
    });
  }

  deletePhoto(photoId: number): void {
    this.memberService.deletePhoto(photoId).subscribe(() => {
      this.member.photos = this.member.photos.filter(x => x.id !== photoId);
    });
  }

  initializeUploader(): void {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.user.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onWhenAddingFileFailed = (item, filter, options) => {
      let message = '';
      switch (filter.name) {
        case 'queueLimit':
          message = 'QueueLimit reached';
          break;
        case 'fileSize':
          message = 'Exceeded file size';
          break;
        default:
          message = 'Error uploading file';
          break;
      }
      alert(message);
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      console.log('Upload status: ' + response);
      if (response) {
        const photo: Photo = JSON.parse(response);
        this.member.photos.push(photo);
        if(photo.isMain){
          this.user.photoUrl = photo.url;
          this.member.photoUrl = photo.url;
          this.accountService.setCurrentUser(this.user);
        }
      }
    };
  }
}

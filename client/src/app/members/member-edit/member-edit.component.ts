import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {Member} from '../../_models/member';
import {User} from '../../_models/user';
import {AccountService} from '../../_services/account.service';
import {MembersService} from '../../_services/members.service';
import {take} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm;

  member: Member | undefined;
  user: User | undefined;

  constructor(private accountService: AccountService, private memberService: MembersService, private toastr: ToastrService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    });
  }

  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any): void {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(): void {
    const username = this.user?.username;
    if (username) {
      this.memberService.getMember(username).subscribe(member => this.member = member);
    }
  }

  updateMember(): void {
    console.log('updating : ' + this.member);
    if (this.member) {
      this.memberService.updateMember(this.member).subscribe((f) => f);
      this.toastr.success('Profile updated successfully');
      this.editForm.reset(this.member);
    }
  }
}

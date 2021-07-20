import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Member} from '../../_models/member';
import {MembersService} from '../../_services/members.service';
import {ActivatedRoute} from '@angular/router';
import {NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions} from '@kolkov/ngx-gallery';
import {TabDirective, TabsetComponent} from 'ngx-bootstrap/tabs';
import {Message} from '../../_models/message';
import {MessageService} from '../../_services/message.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  member: Member | undefined;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  activeTab: TabDirective;
  messages: Message[] = [];
  @ViewChild('memberTabs', {static: false}) memberTabs: TabsetComponent;

  constructor(private memberService: MembersService,
              private route: ActivatedRoute,
              private messageService: MessageService,
              private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ];

    this.route.data.subscribe(data => {
      this.member = data.member;
      this.changeDetectorRef.detectChanges();
      this.galleryImages = this.getImages();
    });

    this.route.queryParams.subscribe(params => {
      if (this.member) {
        this.changeDetectorRef.detectChanges();
        params.tab ? this.selectTab(params.tab) : this.selectTab(0);
      }
    });
  }

  getImages(): NgxGalleryImage[] {
    const imageUrls = [];
    const photos = this.member?.photos;
    if (photos) {
      for (const photo of photos) {
        imageUrls.push({
          small: photo?.url,
          medium: photo?.url,
          big: photo?.url
        });
      }
    }
    return imageUrls;
  }

  loadMessages(): void {
    this.messageService.getMessageThread(this.member.userName).subscribe(messages => {
      this.messages = messages;
    });
  }

  selectTab(tabId: number): void {
    console.log(`Selecting tab ${tabId}`);
    if (this.memberTabs) {
      this.memberTabs.tabs[tabId].active = true;
    }
  }

  onTabActivated(data: TabDirective): void {
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages' && this.messages.length === 0) {
      this.loadMessages();
    }
  }
}

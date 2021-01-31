import {Component, OnInit} from '@angular/core';
import {AccountService} from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

export class NavComponent implements OnInit {
  model: any = {};

  constructor(public accountService: AccountService) {

  }

  ngOnInit(): void {
  }

  login(): void {
    console.log(this.model);
    this.accountService.login(this.model).subscribe((response: any) => {
      console.log(response);
    }, (error: any) => {
      console.log(error);
    });
  }

  logout(): void {
    this.accountService.logout();
  }
}
import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AutoLogoutService } from '../shared/services/auto-logout.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(private userService: UserService, private autoLogoutService: AutoLogoutService) { }

  ngOnInit(): void {
    localStorage.setItem('lastAction', Date.now().toString());
    this.autoLogoutService.initListener();
  }



}

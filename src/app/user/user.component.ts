import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
 
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    
  }

  

}

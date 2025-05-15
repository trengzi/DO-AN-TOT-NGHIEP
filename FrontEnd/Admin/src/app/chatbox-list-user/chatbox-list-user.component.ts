import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-chatbox-list-user',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule,
    FormsModule,
    InputTextModule,
    ProgressBarModule,
    HttpClientModule
  ],
  providers:[
    UserService
  ],
  templateUrl: './chatbox-list-user.component.html',
  styleUrl: './chatbox-list-user.component.css'
})
export class ChatboxListUserComponent {

  listUser: any;

  constructor(
    public _userService: UserService,
  ){
    this._userService.getListUserForAdminSupport().subscribe(data => {
      this.listUser = data;
    })
  }
}

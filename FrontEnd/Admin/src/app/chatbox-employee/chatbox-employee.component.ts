import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Pusher from 'pusher-js';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-chatbox-employee',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule,
    FormsModule,
    InputTextModule,
    HttpClientModule
  ],
  providers:[
    UserService
  ],
  templateUrl: './chatbox-employee.component.html',
  styleUrl: './chatbox-employee.component.css'
})
export class ChatboxEmployeeComponent {
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  listMessage: any[] = [];
    userId = '';
    employeeId = AuthService.employeeId;
    userName='';
    currentChat: any;
    userNeedSP = '';

    constructor(
      private http: HttpClient,
      public router: Router,
      private route: ActivatedRoute,
      private _userService: UserService
    ) {
    }

    ngOnInit(): void {
      this.route.params.subscribe(params => {
        this.userId = params['userId'];
        this._userService.getUserById(this.userId).subscribe(data => {
          this.userNeedSP = data.fullName;
        })
        this.http.get<any>(`https://localhost:7111/api/employees/${this.employeeId}`).subscribe((data) => {
          this.userName = data.fullName;
          this.http.get<any[]>(`https://localhost:7111/api/chat/messages/${this.userId}`)
          .subscribe((messages) => {
            this.listMessage = messages || [];
            setTimeout(() => {
              this.scrollToBottom();
  }, 10);
          });
        });
        Pusher.logToConsole = true;



        const pusher = new Pusher('fec2b4e92fd5692e3fd5', {
          cluster: 'ap1'
        });

        var channel = pusher.subscribe(`chat-${this.userId}`);
        channel.bind('message', (data: any) => {
          this.listMessage.push(data);
          setTimeout(() => {
            this.scrollToBottom();
}, 10);
        });
      })

    }

    scrollToBottom() {
      const messageContainer = this.messageContainer.nativeElement;
      if (messageContainer) {
        messageContainer.scrollTop = messageContainer.scrollHeight;
      }
    }


    submit(event: KeyboardEvent){
      if (event.key === "Enter") {
        if(!this.currentChat)
          return;
        this.http.post('https://localhost:7111/api/chat/messages', {

          userId: this.userId,
          userName: this.userName,
          employeeId: this.employeeId,
          message: this.currentChat
        }).subscribe((data: any) =>{
          this.currentChat = '';
        })
      }
    }
}

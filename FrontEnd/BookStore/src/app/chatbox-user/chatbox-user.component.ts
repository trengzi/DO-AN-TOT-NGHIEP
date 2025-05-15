import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import Pusher from 'pusher-js';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-chatbox-user',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule,
    FormsModule,
    InputTextModule,
    HttpClientModule
  ],
  templateUrl: './chatbox-user.component.html',
  styleUrl: './chatbox-user.component.css'
})
export class ChatboxUserComponent {
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  listMessage: any[] = [];
  userId = AuthService.userId;
  userName = AuthService.userFullName;
  currentChat: any;

  constructor(
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    Pusher.logToConsole = true;

    this.http.get<any[]>(`https://localhost:7111/api/chat/messages/${this.userId}`)
    .subscribe((messages) => {
      this.listMessage = messages || [];
      setTimeout(() => {
        this.scrollToBottom();
}, 10);
    });

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
        message: this.currentChat
      }).subscribe(data =>{
        this.currentChat = '';
      })
    }
  }

}

import { ToastModule } from 'primeng/toast';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ContactService } from '../../service/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule,
    ToastModule
  ],
  providers: [
    MessageService,
    ContactService
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

  fullName: any;
  email: any;
  title: any;
  message: any;

  constructor(
    private messageService: MessageService,
    private _contactService: ContactService
  ){

  }

  sendMessage(){
    if(!this.fullName || !this.email || !this.title || !this.message)
    {
      this.messageService.add({severity:'warn', summary: 'Thông báo', detail: 'vui lòng nhập đầy đủ thông tin', life: 3000});
    }
    else
    {
      const body = {
        fullName: this.fullName,
        email: this.email,
        subject: this.title,
        content: this.message,
      }
      this._contactService.postMessage(body).subscribe(data => {
        if(data.status == 'success')
        {
          this.messageService.add({severity:'success', summary: 'Thông báo', detail: 'Gửi lời nhắn thành công', life: 3000});
        }
      })
    }
  }
}

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ContactService } from '../../services/contact.service';
import { AuthService } from '../../services/auth.service';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    ButtonModule,
    TableModule,
    FormsModule,
    HttpClientModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    InputTextModule,
    InputNumberModule,
    InputTextareaModule,
    CommonModule,
    CalendarModule,
    PaginatorModule
  ],
  providers:[
    MessageService,
    ContactService,
    ConfirmationService
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  listMessage: any;

  role: any;
  body = {
    fullName: '',
    email: '',
    subject: '',
    content: ''
  }

  constructor(
    private _contactService: ContactService,
    private _messageService: MessageService,
    private confirmationService: ConfirmationService,
  ){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.role = AuthService.role;
    this.getAll();
  }

  getAll(){
    this._contactService.getAllMessage().subscribe(data => {
      this.listMessage = data;
    })
  }

  resetBody(){
    this.body = {
      fullName: '',
      email: '',
      subject: '',
      content: ''
    };
  }

  deleteBook(messageId: any){
    this.confirmationService.confirm({
      message: 'Xác nhận xóa bản ghi này?',
      accept: async () => {
        this._contactService.deleteMessage(messageId).subscribe(data => {
          if(data.status == 'success')
          {
              this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'Xóa lời nhắn thành công', life: 3000});
              this.getAll();
          }
        })
      }
    });

  }
}

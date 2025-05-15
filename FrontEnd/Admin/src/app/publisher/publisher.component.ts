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
import { PublisherService } from '../../services/publisher.service';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-publisher',
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
    PublisherService,
    MessageService,
    ConfirmationService
  ],
  templateUrl: './publisher.component.html',
  styleUrl: './publisher.component.css'
})
export class PublisherComponent {
  showForm = false;
  showUpdate = false;
  listPublisher: any;

  body = {
    fullName: '',
    address: '',
    email: '',
    phone: ''
  }
  curPublisherId: any;

  constructor(
    private _publisherService: PublisherService,
    private _messageService: MessageService,
    private confirmationService: ConfirmationService,
  ){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getAll();
  }

  getAll(){
    this._publisherService.getAllPublisher().subscribe(data => {
      this.listPublisher = data;
    })
  }

  resetBody(){
    this.body = {
      fullName: '',
      address: '',
      email: '',
      phone: ''
    };
  }

  showThemMoi(){
    this.resetBody();
    this.showForm = true;
    this.showUpdate = false;
  }

  showSua(publisherId: any){
    this.showForm = true;
    this.showUpdate = true;
    this.curPublisherId = publisherId;
    this._publisherService.getPublisherById(publisherId).subscribe(data => {
      this.body = data;
    })
  }


  addBook(){
    for (const key in this.body) {
      const typedKey = key as keyof typeof this.body;
      // alert(typedKey + "      /        " + this.body[typedKey])
      if (this.body[typedKey] === null || this.body[typedKey] === '') {
        this._messageService.add({severity:'error', summary: 'Thông báo', detail: 'vui lòng điền đầy đủ thông tin', life: 3000});
        return;
      }
    }

    this._publisherService.postPublisher(this.body).subscribe(data => {
      if(data.status == 'success')
      {
        this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'Thêm nhà phát hành thành công', life: 3000});
        this.showForm = false;
        this.getAll();
      }
    })

  }

  deleteBook(publisherId: any){
    this.confirmationService.confirm({
      message: 'Xác nhận xóa bản ghi này?',
      accept: async () => {
        this._publisherService.deletePublisher(publisherId).subscribe(data => {
          if(data.status == 'success')
          {
              this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'Xóa nhà phát hành thành công', life: 3000});
              this.getAll();
          }
          if(data.status == 'exist')
          {
              this._messageService.add({severity:'info', summary: 'Thông báo', detail: 'Hiện đang có sách của nhà phát hành này, vui lòng kiểm tra lại', life: 3000});
          }
        })
      }
    });

  }

  updateBook(){
    for (const key in this.body) {
      const typedKey = key as keyof typeof this.body;
      // alert(typedKey + "      /        " + this.body[typedKey])
      if (this.body[typedKey] === null || this.body[typedKey] === '') {
        this._messageService.add({severity:'error', summary: 'Thông báo', detail: 'vui lòng điền đầy đủ thông tin', life: 3000});
        return;
      }
    }
    this._publisherService.putPublisher(this.curPublisherId, this.body).subscribe(data => {
      if(data.status == 'success')
      {
          this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'Sửa thông tin nhà phát hành thành công', life: 3000});
          this.showForm = false;
          this.getAll();
      }

    })
  }
}

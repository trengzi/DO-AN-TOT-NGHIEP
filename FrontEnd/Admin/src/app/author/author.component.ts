import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { AuthorService } from '../../services/author.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-author',
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
    AuthorService,
    MessageService,
    ConfirmationService
  ],
  templateUrl: './author.component.html',
  styleUrl: './author.component.css'
})
export class AuthorComponent {
  showForm = false;
  showUpdate = false;
  listAuthor: any;
  page: number = 0; 

  body = {
    fullName: '',
    biography: '',
    dateOfBirth: new Date(),
  }
  curAuthorId: any;

  constructor(
    private _authorService: AuthorService,
    private _messageService: MessageService,
    private confirmationService: ConfirmationService,
  ){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getAll();
  }

  getAll(){
    this._authorService.getAllAuthor().subscribe(data => {
      this.listAuthor = data;
    })
  }
  onPageChange(event: any) {
    this.page = event.page;
  }

  resetBody(){
    this.body = {
      fullName: '',
      biography: '',
      dateOfBirth: new Date()
    };
  }

  showThemMoi(){
    this.resetBody();
    this.showForm = true;
    this.showUpdate = false;
  }

  showSua(authorId: any){
    this.showForm = true;
    this.showUpdate = true;
    this.curAuthorId = authorId;
    this._authorService.getAuthorById(authorId).subscribe(data => {
      this.body = data;
      this.body.dateOfBirth = new Date(data.dateOfBirth);
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
    this.body.dateOfBirth.setHours(this.body.dateOfBirth.getHours() + 7);

    this._authorService.postAuthor(this.body).subscribe(data => {
      if(data.status == 'success')
      {
        this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'Thêm tác giả thành công', life: 3000});
        this.showForm = false;
        this.getAll();
      }
    })

  }

  deleteBook(authorId: any){
    this.confirmationService.confirm({
      message: 'Xác nhận xóa bản ghi này?',
      accept: async () => {
        this._authorService.deleteAuthor(authorId).subscribe(data => {
          if(data.status == 'success')
          {
              this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'Xóa tác giả thành công', life: 3000});
              this.getAll();
          }
          if(data.status == 'exist')
          {
              this._messageService.add({severity:'info', summary: 'Thông báo', detail: 'Hiện đang có sách của tác giả này, vui lòng kiểm tra lại', life: 3000});
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
    this.body.dateOfBirth.setHours(this.body.dateOfBirth.getHours() + 7);
    this._authorService.putAuthor(this.curAuthorId, this.body).subscribe(data => {
      if(data.status == 'success')
      {
          this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'Sửa thông tin tác giả thành công', life: 3000});
          this.showForm = false;
          this.getAll();
      }

    })
  }
}

import { HttpClientModule } from '@angular/common/http';
import { Component,ViewChild  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { CategoryService } from '../../services/category.service';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { Paginator } from 'primeng/paginator';

@Component({
  selector: 'app-category',
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
    PaginatorModule
  ],
  providers:[
    MessageService,
    CategoryService,
    ConfirmationService
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {

  showForm = false;
  showUpdate = false;
  listCategory: any[] = [];
  first: number = 0; // Vị trí bắt đầu trang
  rows: number = 20; // Số bản ghi mỗi trang
  body = {
    name: '',
    description: '',
    bookNumber: 0,
  }

  body2 = {
    name: '',
    description: ''
  }
  curCategoryId: any;
  @ViewChild(Paginator) paginator!: Paginator;  // Tham chiếu đến paginator

  constructor(
    private _categoryService: CategoryService,
    private _messageService: MessageService,
    private confirmationService: ConfirmationService,
  ){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getAll();
  }
  onPageChange(event: any) {
    this.first = event.first; // Cập nhật lại vị trí bắt đầu của danh sách
  }
  getAll(){
    this._categoryService.getAllCategory().subscribe(data => {
      this.listCategory = data;
    })
  }

  resetBody(){
    this.body2 = {
      name: '',
      description: '',
    };
  }

  showThemMoi(){
    this.resetBody();
    this.showForm = true;
    this.showUpdate = false;
  }

  showSua(categoryId: any){
    this.showForm = true;
    this.showUpdate = true;
    this.curCategoryId = categoryId;
    this._categoryService.getCategoryById(categoryId).subscribe(data => {
      this.body2 = data;
    })
  }


  addBook(){
    for (const key in this.body2) {
      const typedKey = key as keyof typeof this.body2;
      // alert(typedKey + "      /        " + this.body[typedKey])
      if (this.body2[typedKey] === null || this.body2[typedKey] === '') {
        this._messageService.add({severity:'error', summary: 'Thông báo', detail: 'vui lòng điền đầy đủ thông tin', life: 3000});
        return;
      }
    }


    this._categoryService.postCategory(this.body2).subscribe(data => {
      if(data.status == 'success')
      {
        this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'Thêm danh mục sách thành công', life: 3000});
        this.showForm = false;
        this.getAll();
      }
    })

  }

  deleteBook(categoryId: any){
    this.confirmationService.confirm({
      message: 'Xác nhận xóa bản ghi này?',
      accept: async () => {
        this._categoryService.deleteCategory(categoryId).subscribe(data => {
          if(data.status == 'success')
          {
              this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'Xóa danh mục thành công', life: 3000});
              this.getAll();
          }
          if(data.status == 'exist')
          {
              this._messageService.add({severity:'info', summary: 'Thông báo', detail: 'Danh mục đang có sách, vui lòng kiểm tra lại', life: 3000});
          }
        })
      }
    });

  }

  updateBook(){
    for (const key in this.body2) {
      const typedKey = key as keyof typeof this.body2;
      // alert(typedKey + "      /        " + this.body[typedKey])
      if (this.body2[typedKey] === null || this.body2[typedKey] === '') {
        this._messageService.add({severity:'error', summary: 'Thông báo', detail: 'vui lòng điền đầy đủ thông tin', life: 3000});
        return;
      }
    }

    this._categoryService.putCategory(this.curCategoryId, this.body2).subscribe(data => {
      if(data.status == 'success')
      {
          this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'Sửa thông tin danh mục thành công', life: 3000});
          this.showForm = false;
          this.getAll();
      }

    })
  }
}

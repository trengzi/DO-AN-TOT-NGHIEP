import { HttpClientModule } from '@angular/common/http';
import { Component, Pipe, PipeTransform } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ManagerService } from '../../services/manager.service';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { AuthService } from '../../services/auth.service';
import { PaginatorModule } from 'primeng/paginator';

@Pipe({ standalone: true, name: 'formatVnd' })
export class FormatVndPipe implements PipeTransform {
  transform(value: any): string {
    const soTien: number = parseFloat(value);

    // Kiểm tra nếu giá trị là NaN hoặc không phải số
    if (isNaN(soTien)) {
      // Trả về giá trị không thay đổi nếu không phải số
      return value;
    }

    // Định dạng số tiền trong đơn vị VND
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(soTien);
  }
}

@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [
    ButtonModule,
    TableModule,
    FormsModule,
    HttpClientModule,
    FormatVndPipe,
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
    ManagerService,
    ConfirmationService
  ],
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.css'
})
export class ManagerComponent {
  showForm = false;
  showUpdate = false;
  listManager: any;

  body2 = {
    fullName: '',
    address: '',
    phone: '',
    email: '',
    salary: 0,
    branch: ''
  }
  curManagerId: any;

  constructor(
    private _managerService: ManagerService,
    private _messageService: MessageService,
    private confirmationService: ConfirmationService,
  ){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getAll();
  }

  getAll(){
    this._managerService.getAllManager().subscribe(data => {
      this.listManager = data;
    })
  }

  resetBody(){
    this.body2 = {
      fullName: '',
      address: '',
      phone: '',
      email: '',
      branch: '',
      salary: 0,
    };
  }

  showThemMoi(){
    this.resetBody();
    this.showForm = true;
    this.showUpdate = false;
  }

  showSua(managerId: any){
    this.showForm = true;
    this.showUpdate = true;
    this.curManagerId = managerId;
    this._managerService.getManagerById(managerId).subscribe(data => {
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


    this._managerService.postManager(this.body2).subscribe(data => {
      if(data.status == 'success')
      {
        this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'Thêm quản lý thành công', life: 3000});
        this.showForm = false;
        this.getAll();
      }
    })

  }

  deleteBook(managerId: any){
    this.confirmationService.confirm({
      message: 'Xác nhận xóa bản ghi này?',
      accept: async () => {
        this._managerService.deleteManager(managerId).subscribe(data => {
          if(data.status == 'success')
          {
              this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'Xóa quản lý thành công', life: 3000});
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
       //alert(typedKey + "      /        " + this.body2[typedKey])
      if (this.body2[typedKey] === null || this.body2[typedKey] === '') {
        this._messageService.add({severity:'error', summary: 'Thông báo', detail: 'vui lòng điền đầy đủ thông tin', life: 3000});
        return;
      }
    }

    this._managerService.putManager(this.curManagerId, this.body2).subscribe(data => {
      if(data.status == 'success')
      {
          this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'Sửa thông tin quản lý thành công', life: 3000});
          this.showForm = false;
          this.getAll();
      }

    })
  }
}

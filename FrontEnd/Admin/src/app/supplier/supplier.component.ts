import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { SupplierService } from '../../services/supplier.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-supplier',
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
    SupplierService,
    MessageService,
    ConfirmationService
  ],
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.css'
})
export class SupplierComponent {
  showForm = false;
  showUpdate = false;
  listSupplier: any;

  body = {
    fullName: '',
    address: '',
    email: '',
    phone: ''
  }
  curSupplierId: any;

  constructor(
    private _supplierService: SupplierService,
    private _messageService: MessageService,
    private confirmationService: ConfirmationService,
  ){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getAll();
  }

  getAll(){
    this._supplierService.getAllSupplier().subscribe(data => {
      this.listSupplier = data;
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

  showSua(supplierId: any){
    this.showForm = true;
    this.showUpdate = true;
    this.curSupplierId = supplierId;
    this._supplierService.getSupplierById(supplierId).subscribe(data => {
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

    this._supplierService.postSupplier(this.body).subscribe(data => {
      if(data.status == 'success')
      {
        this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'Thêm nhà cung cấp thành công', life: 3000});
        this.showForm = false;
        this.getAll();
      }
    })

  }

  deleteBook(supplierId: any){
    this.confirmationService.confirm({
      message: 'Xác nhận xóa bản ghi này?',
      accept: async () => {
        this._supplierService.deleteSupplier(supplierId).subscribe(data => {
          if(data.status == 'success')
          {
              this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'Xóa nhà cung cấp thành công', life: 3000});
              this.getAll();
          }
          if(data.status == 'exist')
          {
              this._messageService.add({severity:'info', summary: 'Thông báo', detail: 'Hiện đang có sách của nhà cung cấp này, vui lòng kiểm tra lại', life: 3000});
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
    this._supplierService.putSupplier(this.curSupplierId, this.body).subscribe(data => {
      if(data.status == 'success')
      {
          this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'Sửa thông tin nhà cung cấp thành công', life: 3000});
          this.showForm = false;
          this.getAll();
      }

    })
  }
}

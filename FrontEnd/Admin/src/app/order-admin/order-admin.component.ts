import { PhuongThucVanChuyen } from './../Enums/Enums';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormatVndPipe } from '../book/book.component';
import { OrderService } from '../../services/order.service';
import { MessageService } from 'primeng/api';
import { TrangThaiDonHang } from '../Enums/Enums';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { EmployeeService } from '../../services/employee.service';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-order-admin',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    CommonModule,
    FormsModule,
    RouterModule,
    FormatVndPipe,
    HttpClientModule,
    TableModule,
    DialogModule,
    CalendarModule,
    ToastModule,
    InputTextareaModule,
    DropdownModule,
    PaginatorModule
  ],
  providers: [
    OrderService,
    MessageService,
    EmployeeService
  ],
  templateUrl: './order-admin.component.html',
  styleUrl: './order-admin.component.css'
})
export class OrderAdminComponent {

  TrangThaiDonHang = TrangThaiDonHang;
  PhuongThucVanChuyen = PhuongThucVanChuyen;
  userId: any;
  listDonHang: any;
  listEmployee: any;
  totalRecords: any;
  page = 0;
  showForm = false;
  curOrder = {
    code: '',
    created: new Date(),
    shippingMethod: '',
    status: '',
    couponCode: '',
    couponPercent: 0,
    phoneNumber: '',
    fullName: '',
    address: '',
    paymentMethod: '',
    note: '',
    totalPrice: 0,
    luongGiam: 0,
    couponId: '',
    userId: '',
    email:''
  };

  listOrderProduct: any;

  constructor(
    public _orderService: OrderService,
    public _messageService: MessageService,
    public _employeeService: EmployeeService
  ) {


  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getAll();
  }

  onPageChange(event: any)
  {
    this.page = event.page;
    this.getAll();
  }

  getAll(): void{
    this._orderService.getAllOrderAdmin(this.page).subscribe(data =>
      {
        this.listDonHang = data.order;
        this.totalRecords = data.totalRecords;
      }
    )
    this._employeeService.getAllEmployee().subscribe(data => {
      this.listEmployee = data;
    })
  }

  showOrder(orderId: any){
    this.showForm = true;
    this._orderService.getOrderById(orderId).subscribe(data => {
      this.curOrder = data;
      if(!this.curOrder.couponId)
        this.curOrder.luongGiam = 0;
      this._orderService.getListSanPhamByIDDonHang(orderId).subscribe(data => {
        this.listOrderProduct = data;
        for(let i = 0; i < this.listOrderProduct.length; i++)
          {
              this.listOrderProduct[i].imageUrls = this.listOrderProduct[i].imageUrls.split(',')[0];
          }
    })
    });
  }

  changeStatusUp(orderId: any){
    this._orderService.changeStatusUp(orderId).subscribe(data => {
      if(data.status == 'success')
      {
        this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'Đổi trạng thái đơn hàng thành công', life: 3000});
        this.getAll();
      }
    })
  }

  changeStatusDown(orderId: any){
    this._orderService.changeStatusDown(orderId).subscribe(data => {
      if(data.status == 'success')
      {
        this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'Đổi trạng thái đơn hàng thành công', life: 3000});
        this.getAll();
      }
    })
  }

  setEmployeeForOrder(productId: any, productEmployeeId: any){
    this._orderService.setEmployeeForOrder(productId, productEmployeeId).subscribe(data => {
      // if(data.status == 'success')
      //     this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'phân đơn hàng cho nhân viên thành cô', life: 3000});
    })
  }
}

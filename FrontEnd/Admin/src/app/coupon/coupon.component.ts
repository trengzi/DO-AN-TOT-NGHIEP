import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { CouponService } from '../../services/coupon.service';
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
import { TrangThaiMaGiamGia } from '../Enums/Enums';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-coupon',
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
    DropdownModule,
    PaginatorModule
  ],
  providers:[
    CouponService,
    MessageService,
    ConfirmationService
  ],
  templateUrl: './coupon.component.html',
  styleUrl: './coupon.component.css'
})
export class CouponComponent {
  showForm = false;
  showUpdate = false;
  listCoupon: any;
  statusMa = [
    TrangThaiMaGiamGia.KhaDung,
    TrangThaiMaGiamGia.KhongKhaDung
  ];

  body = {
    code: '',
    discountPercent: 0,
    validFrom: new Date(),
    validUntil: new Date(),
    quantity: 0,
    minOrder: 0,
    status: TrangThaiMaGiamGia.KhaDung,
    description: '',
    used: 0,
  }
  curCouponId: any;

  constructor(
    private _couponService: CouponService,
    private _messageService: MessageService,
    private confirmationService: ConfirmationService,
  ){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getAll();
  }

  getAll(){
    this._couponService.getAllCoupon().subscribe(data => {
      this.listCoupon = data;
    })
  }

  resetBody(){
    this.body = {
      code: '',
      discountPercent: 0,
      validFrom: new Date(),
      validUntil: new Date(),
      quantity: 0,
      minOrder: 0,
      status: TrangThaiMaGiamGia.KhaDung,
      description: '',
      used: 0,
    }
  }

  showThemMoi(){
    this.resetBody();
    this.showForm = true;
    this.showUpdate = false;
  }

  showSua(couponId: any){
    this.showForm = true;
    this.showUpdate = true;
    this.curCouponId = couponId;
    this._couponService.getCouponById(couponId).subscribe(data => {
      this.body = data;
      this.body.validFrom = new Date(data.validFrom);
      this.body.validUntil = new Date(data.validUntil);
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
    this.body.validFrom.setHours(this.body.validFrom.getHours() + 7);
    this.body.validUntil.setHours(this.body.validUntil.getHours() + 7);
    this._couponService.postCoupon(this.body).subscribe(data => {
      if(data.status == 'success')
      {
        this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'Thêm mã giảm giá thành công', life: 3000});
        this.showForm = false;
        this.getAll();
      }
    })

  }

  deleteBook(couponId: any){
    this.confirmationService.confirm({
      message: 'Xác nhận xóa bản ghi này?',
      accept: async () => {
        this._couponService.deleteCoupon(couponId).subscribe(data => {
          if(data.status == 'success')
          {
              this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'Xóa mã giảm giá thành công', life: 3000});
              this.getAll();
          }
          if(data.status == 'exist')
          {
              this._messageService.add({severity:'info', summary: 'Thông báo', detail: 'Hiện đang có đơn sử dụng mã giảm giá này, vui lòng kiểm tra lại', life: 3000});
          }
        })
      }
    });

  }

  updateItem(){
    for (const key in this.body) {
      const typedKey = key as keyof typeof this.body;
      // alert(typedKey + "      /        " + this.body[typedKey])
      if (this.body[typedKey] === null || this.body[typedKey] === '') {
        this._messageService.add({severity:'error', summary: 'Thông báo', detail: 'vui lòng điền đầy đủ thông tin', life: 3000});
        return;
      }
    }

    this.body.validFrom.setHours(this.body.validFrom.getHours() + 7);
    this.body.validUntil.setHours(this.body.validUntil.getHours() + 7);
    this._couponService.putCoupon(this.curCouponId, this.body).subscribe(data => {
      if(data.status == 'success')
      {
          this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'Sửa thông tin mã giảm giá thành công', life: 3000});
          this.showForm = false;
          this.getAll();
      }

    })
  }
}

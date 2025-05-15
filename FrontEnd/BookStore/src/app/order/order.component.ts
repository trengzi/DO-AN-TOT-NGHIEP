import { TrangThaiDonHang } from './../Enums/Enums';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, Pipe, PipeTransform } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { OrderService } from '../../service/order.service';
import { AuthService } from '../../service/auth.service';

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
  selector: 'app-order',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    CommonModule,
    FormsModule,
    RouterModule,
    FormatVndPipe,
    HttpClientModule
  ],
  providers: [
    OrderService,
    MessageService
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {

  TrangThaiDonHang = TrangThaiDonHang;
  userId: any;
  listDonHang: any;

  constructor(
    public _orderService: OrderService,
    public messageService: MessageService,
  ) {
    const storedValueAccount = AuthService.userId;
        this.userId = storedValueAccount;
        if(this.userId)
          this.callAPI();

  }

  callAPI(): void{
    this._orderService.getListDonHang(this.userId).subscribe(data =>
      {
        this.listDonHang = data;
        console.log(this.listDonHang);
      }
    )
  }
}

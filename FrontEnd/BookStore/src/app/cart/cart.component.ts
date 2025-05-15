import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormatVndPipe } from '../product-list/product-list.component';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { CartService } from '../../service/cart.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    InputNumberModule,
    ButtonModule,
    InputTextareaModule,
    RouterOutlet,
    RouterModule,
    FormatVndPipe,
    FormsModule,
    ToastModule,
    HttpClientModule,
    CommonModule
  ],
  providers: [
    MessageService,
    CartService
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  listSanPham: any;
  userId: any;
  ghiChu: any;
  tongTien = 0;
  constructor(
    private route: ActivatedRoute,
    private _messageService: MessageService,
    private _cartService: CartService
  ){
    const storedValueAccount = AuthService.userId;
    this.userId = storedValueAccount;
    this.callApi();
  }


  callApi(): void{
    this._cartService.getSanPhamInGioHang(this.userId).subscribe(lstSP =>
      {
        this.listSanPham  = lstSP;
        console.log(this.listSanPham);
        this.tinhTongTien();
      })
  }

  setGhiChu(): void{
    //DonhangGiohangService.ghiChu = this.ghiChu;
  }

  xoaMotSanPhamTrongGio(idSanPham: any, kichCo: any, mau: any): void{
    // this._apiService.xoaMotSanPhamTrongGio(this.account.id,idSanPham, kichCo, mau).subscribe(data => {
    //   this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'Xóa sản phẩm khỏi giỏ hàng thành công', life: 3000});
    //   this.callApi();
    // });
  }

  tinhTongTien(){
    this.tongTien = 0;
    this.listSanPham.forEach((el: any) => {
      this.tongTien += (el.book.priceDiscount == null ? el.book.price : el.book.priceDiscount) * el.soLuong;
    });
  }

  updateCart(){
    const resultArray = this.listSanPham.map((item: any) => ({
      bookId: item.book.id,
      soLuong: item.soLuong
    }));
    const body = {
      userId: this.userId,
      idsItem: JSON.stringify(resultArray)
    }
    this._cartService.updateCart(this.userId ,body).subscribe(data => {
      this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'Cập nhật giỏ hàng thành công', life: 3000});
      this.callApi();
    })
  }

  removeBook(book: any){
    const index = this.listSanPham.indexOf(book);

  // Nếu tìm thấy phần tử, xóa nó
    if (index !== -1) {
      this.listSanPham.splice(index, 1);
    }
  }

}

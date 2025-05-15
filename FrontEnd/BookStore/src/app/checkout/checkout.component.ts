import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormatVndPipe } from '../product-list/product-list.component';
import { DialogModule } from 'primeng/dialog';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ProgressBarModule } from 'primeng/progressbar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CartService } from '../../service/cart.service';
import { LoginService } from '../../service/login.service';
import { CouponService } from '../../service/coupon.service';
import { PhuongThucThanhToan, PhuongThucVanChuyen, TrangThaiDonHang } from '../Enums/Enums';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { OrderService } from '../../service/order.service';
import { BookService } from '../../service/book.service';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    InputTextModule,
    ButtonModule,
    TableModule,
    RadioButtonModule,
    CommonModule,
    FormsModule,
    CommonModule,
    ConfirmDialogModule,
    FormatVndPipe,
    DialogModule,
    RouterOutlet,
    RouterModule,
    InputSwitchModule,
    InputTextareaModule,
    ProgressBarModule,
    HttpClientModule,
    ToastModule
  ],
  providers: [
    MessageService,
    ConfirmationService,
    CartService,
    LoginService,
    CouponService,
    OrderService,
    BookService
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {

  listSanPham: any;
  tongTien = 0;
  userId: any;
  account: any;
  phuongThucVanChuyen = "Vận chuyển thường";
  diaChi: any;
  tongCong = 0;


  showQR = false;
  imgQR: any;
  minutes: number = 10;
  seconds: number = 0;
  intervalId: any;
  display = false;
  phuongThucThanhToan = "Thanh toán khi giao hàng (COD)";
  maGiamGia: any;
  maGiam: any;
  luongGiam: any;
  maGiamGiaID: any;
  note: any;
  idDonHang: any;
  chuoiCK: any;

  constructor(
    public messageService: MessageService,
    public router: Router,
    private confirmationService: ConfirmationService,
    private _cartService: CartService,
    private _loginService: LoginService,
    private _couponService: CouponService,
    private _orderService: OrderService,
    private _bookService: BookService
  ) {
    const storedValueAccount = AuthService.userId;
    this.userId = storedValueAccount;
    this.getUser();
    this.getUserCoupon();
    this.callApi();
  }

  getUser(): void {
    this._loginService.getUserById(this.userId).subscribe(data => {
      this.account = data;
    })
  }

  callApi(): void {
    this._cartService.getSanPhamInGioHang(this.userId).subscribe(lstSP => {
      this.listSanPham = lstSP;
      console.log(this.listSanPham)
      this.tinhTongTien();
    })
  }

  getUserCoupon() {
    this._couponService.getAllCouponAvailable().subscribe(data => {
      this.maGiamGia = data;
    })
  }

  tinhTongTien() {
    this.tongTien = 0;
    this.tongCong = 0;
    this.listSanPham.forEach((el: any) => {
      this.tongTien += (el.book.priceDiscount == null ? el.book.price : el.book.priceDiscount) * el.soLuong;
    });
    this.tongCong = this.tongTien;
    if (this.luongGiam) {
      this.tongCong = this.tongTien - this.tongTien * this.luongGiam / 100;
    }
    if (this.phuongThucVanChuyen == PhuongThucVanChuyen.VanChuyenThuong) {
      this.tongCong += 25000;
    }
    else if (this.phuongThucVanChuyen == PhuongThucVanChuyen.VanChuyenSieuToc) {
      this.tongCong += 40000;
    }
  }


  dungMaGiam(id: any, maGiam: any, luongGiam: any): void {
    this.luongGiam = luongGiam;
    this.maGiam = maGiam;
    this.maGiamGiaID = id;
    this.tinhTongTien();
  }

  getUniqueCode() {
    const now = new Date();
    const timestamp = now.getTime(); // Thời gian Unix tính bằng mili giây
    const uniquePart = timestamp.toString().slice(-6); // Lấy 6 chữ số cuối cùng
    return `ORD${uniquePart}`;
  };

  hoanTatDonHang() {

    const rst = this.listSanPham.map((item: any) => ({
      id: item.book.id,
      soLuong: item.soLuong
    }));
    this._bookService.checkSoLuongMany(rst).subscribe(data => {
      if (data.status == 'error') {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: `Số lượng cho sản phẩm trong đơn không có sẵn`, life: 3000 });
        return;
      }
      else {
        if (this.phuongThucThanhToan == PhuongThucThanhToan.ThanhToanKhiNhanHang) {
          const body = {
            totalPrice: this.tongCong,
            code: this.getUniqueCode(),
            status: TrangThaiDonHang.ChoXacNhan,
            userId: this.account.id,
            address: this.account.address,
            ShippingMethod: this.phuongThucVanChuyen,
            PaymentMethod: this.phuongThucThanhToan,
            note: this.note,
            couponId: this.maGiamGiaID,
            phoneNumber: this.account.phoneNumber,
            
          }
          this.confirmationService.confirm({
            message: 'Xác nhận đặt đơn hàng này?',
            accept: async () => {
              this.acceptDonHang(body);
            }
          });
        }
        else {
          this.showQR = true;
          const currentDate = new Date();
          var randomNum = this.generateUniqueSevenDigitNumber();
          this.chuoiCK = `ORDER${randomNum}`;
          this.imgQR = `https://img.vietqr.io/image/970422-0848353123-compact2.png?amount=${this.tongCong}&addInfo=Thanh toan don hang ${this.chuoiCK}`;


          // https://script.google.com/macros/s/AKfycbyYfd6q71PcSBsaoQTQfMEOD858Y-xzu64QK0UxDeRC-u-EViLLI-McNpwlIfb92D3w/exec
          this.minutes = 10;
          this.seconds = 0;
          clearInterval(this.intervalId);
          this.startCountdown();
          setTimeout(() => {
            var newInterval = setInterval(() => {
              if (this.showQR == false) {
                clearInterval(newInterval);
                return;
              }
              this._orderService.getThanhToan().subscribe(data => {
                if (data.data[data.data.length - 1]["Giá trị"] >= this.tongCong && data.data[data.data.length - 1]["Mô tả"].includes(this.chuoiCK)) {
                  clearInterval(newInterval);
                  this.display = true;
                  const body = {
                    totalPrice: this.tongCong,
                    code: this.getUniqueCode(),
                    status: TrangThaiDonHang.ChoXacNhan,
                    userId: this.account.id,
                    address: this.account.address,
                    ShippingMethod: this.phuongThucVanChuyen,
                    PaymentMethod: this.phuongThucThanhToan,
                    note: this.note,
                    couponId: this.maGiamGiaID,
                    phoneNumber: this.account.phoneNumber
                  }
                  this.acceptDonHang(body);
                }
              });
            }, 5000)
          }, 10000);
          return;
        }
      }
    })

  }

  generateUniqueSevenDigitNumber() {
    const digits = Array.from({ length: 10 }, (_, i) => i); // Mảng 0 đến 9
    let result = '';

    for (let i = 0; i < 9; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      result += digits[randomIndex];
      digits.splice(randomIndex, 1);
    }

    return result;
  }

  startCountdown(): void {

    let totalTime = this.minutes * 60 + this.seconds;
    this.updateCountdownDisplay(totalTime);

    this.intervalId = setInterval(() => {
      if (totalTime > 0) {
        totalTime--;
        this.updateCountdownDisplay(totalTime);
      } else {
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  updateCountdownDisplay(totalTime: number): void {
    this.minutes = Math.floor(totalTime / 60);
    this.seconds = totalTime % 60;
  }

  acceptDonHang(body: any) {
    this._orderService.postOrder(body).subscribe(data => {
      this.idDonHang = data.id;
      const body2 = []
      const bodyBuy = []

      for (let i = 0; i < this.listSanPham.length; i++) {
        var curBook = this.listSanPham[i];
        bodyBuy.push({
          productId: curBook.book.id,
          bought: curBook.soLuong,
        })
        body2.push({
          quantity: curBook.soLuong,
          unitPrice: curBook.book.priceDiscount ?? curBook.book.price,
          created: new Date(),
          bookId: curBook.book.id,
          orderId: this.idDonHang,
        });
      }
      this._bookService.updateProducts(bodyBuy).subscribe();
      this._orderService.postOrderDetail(body2).subscribe(ans => {
        this._cartService.deleteBookInCart(this.userId).subscribe();
        this.display = true;
        setTimeout(() => {
          this.router.navigate(['/order']);
        }, 3000);
      });
      if (this.maGiamGiaID) {
        const curCoupon = this.maGiamGia.find((cp: any) => cp.id == this.maGiamGiaID)
        curCoupon.used += 1;
        this._couponService.alterCoupon(this.maGiamGiaID, curCoupon).subscribe();
      }

    });


  }
}

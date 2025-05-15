import { TrangThaiDonHang, PhuongThucVanChuyen } from './../Enums/Enums';

import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, Pipe, PipeTransform } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RatingModule } from 'primeng/rating';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { OrderService } from '../../service/order.service';
import { BookService } from '../../service/book.service';
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

@Pipe({
  standalone: true,
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return ''; // Xử lý trường hợp không có giá trị đầu vào

    // Chuyển đổi chuỗi ngày tháng từ '2024-05-05T18:03:19.753' sang định dạng 'hh:mm dd/mm/yyyy'
    const dateObj = new Date(value);
    const time = dateObj.toLocaleTimeString(); // Lấy giờ phút
    const date = dateObj.toLocaleDateString(); // Lấy ngày tháng

    return `${time} ${date}`; // Kết hợp giờ phút và ngày tháng
  }
}

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    FormsModule,
    RouterModule,
    FormatVndPipe,
    DateFormatPipe,
    ConfirmDialogModule,
    DialogModule,
    RatingModule,
    FileUploadModule,
    HttpClientModule,
    ToastModule
  ],
  providers:[
    OrderService,
    MessageService,
    ConfirmationService,
    DatePipe,
    DialogService,
    BookService
  ],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export class OrderDetailComponent {

  TrangThaiDonHang = TrangThaiDonHang;
  PhuongThucVanChuyen = PhuongThucVanChuyen;
  userId: any;
  idDonHang: any;
  DonHang: any;
  listSanPham: any;
  display = false;
  tongTien = 0;
  thanhToan = 0;
  phiVanChuyen = 0;
  sanPhamDanhGia: any;
  sanPhamDanhGiaXem: any;


  displayDanhGia = false;
  displayXemDanhGia = false;
  userRating: any;
  nhanXet: any;
  anhtest: any;
  fileAnhUpload: any;

  constructor(
    private _orderService: OrderService,
    public _messageService: MessageService,
    public router: Router,
    private route: ActivatedRoute,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private datePipe: DatePipe,
    private _bookService: BookService
  ) {
    const storedValueAccount = AuthService.userId;
      this.userId = storedValueAccount;
      if(this.userId)
        this.callAPI();
  }

  callAPI(): void {
    this.route.params.subscribe(params => {
      this.idDonHang = params['id'];
      this._orderService.getDonHangById(this.idDonHang).subscribe(data => {
        this.DonHang = data;
        if (!this.DonHang.couponId) this.DonHang.luongGiam = 0;
  
        this._orderService.getListSanPhamByIDDonHang(this.idDonHang, this.userId).subscribe(async data => {
          this.listSanPham = data;
  
          // Nếu đơn giao thành công -> kiểm tra từng sản phẩm đã đánh giá chưa
          if (this.DonHang.status == TrangThaiDonHang.GiaoHangThanhCong) {
            for (let i = 0; i < this.listSanPham.length; i++) {
              let item = this.listSanPham[i];
              item.imageUrls = item.imageUrls.split(',')[0];
  
              // Gọi API kiểm tra đánh giá từng sản phẩm
              await this._orderService.getDanhGiaVeSanPhamByAccount(item.id, this.userId, this.idDonHang).toPromise()
                .then((res: any) => {
                  if (res && res.length > 0) {
                    item.isRated = true; // Đã đánh giá rồi
                  } else {
                    item.isRated = false; // Chưa đánh giá
                  }
                })
                .catch(err => {
                  item.isRated = false; // Nếu lỗi thì mặc định là chưa đánh giá
                });
            }
          } else {
            // Nếu đơn chưa giao thành công, disable hết
            for (let item of this.listSanPham) {
              item.imageUrls = item.imageUrls.split(',')[0];
              item.isRated = null; // trạng thái disable đánh giá
            }
          }
  
          // Tính tiền
          for (let item of this.listSanPham) {
            this.tongTien += item.unitPrice * item.quantity;
          }
          this.thanhToan = this.tongTien * (1 - this.DonHang.couponPercent / 100);
  
          this.phiVanChuyen = (this.DonHang.shippingMethod == PhuongThucVanChuyen.VanChuyenThuong) ? 25000 : 40000;
          this.thanhToan += this.phiVanChuyen;
        });
      });
    });
  }
  

  huyDonHang(): void{
    this.confirmationService.confirm({
      message: 'Bạn có chắc muốn hủy đơn hàng này?',
      accept: async () => {
          var don = this.DonHang;
          don.status = TrangThaiDonHang.DaHuy;
          await this._orderService.huyDonHangById(this.idDonHang, don);

          var bodyBuy = [];
          for(let i =  0; i < this.listSanPham.length; i++)
          {
              var curBook = this.listSanPham[i];
            bodyBuy.push({
              productId: curBook.id,
              bought: -curBook.quantity,
            })
          };
          this._bookService.updateProducts(bodyBuy).subscribe();
          this.display = true;
          setTimeout(() => {
            this.router.navigate(['/order']);
          }, 2000);
      }
    });
  }

  showDanhGia(item: any): void {
    if (this.DonHang.status != TrangThaiDonHang.GiaoHangThanhCong) {
      this._messageService.add({ severity: 'warn', summary: 'Thông báo', detail: 'Đơn hàng chưa giao thành công, không thể đánh giá!' });
      return;
    }
  
    if (item.isRated === true) {
      // Đã đánh giá -> chỉ xem đánh giá
      this.displayXemDanhGia = true;
      this.sanPhamDanhGiaXem = null;
      this._orderService.getDanhGiaVeSanPhamByAccount(item.id, this.userId, this.idDonHang).subscribe(data => {
        this.sanPhamDanhGiaXem = data;
        this.sanPhamDanhGiaXem.forEach((element: any) => {
          element.imageUrls = element.imageUrls.split(',')[0];
        });
      });
    }
    else if (item.isRated === false) {
      // Chưa đánh giá -> cho đánh giá
      this.displayDanhGia = true;
      this.sanPhamDanhGia = item;
    }
  }
  

  xemDanhGia(item: any): void{
    this.displayXemDanhGia = true;
    this._orderService.getDanhGiaVeSanPhamByAccount(item.id, this.userId, this.idDonHang).subscribe(data => {
        this.sanPhamDanhGiaXem = data;
        this.sanPhamDanhGiaXem.forEach((element: any) => {
          element.imageUrls = element.imageUrls.split(',')[0];
        });
      }
    );

  }

  daNhanHang(): void{
    var don = this.DonHang;
    don.status = TrangThaiDonHang.GiaoHangThanhCong;
    this._orderService.huyDonHangById(this.idDonHang, don);
    setTimeout(() => {
      this.router.navigate(['/order']);
    }, 2000);
  }


  generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  myUploader(event: any) {
    for(let i = 0; i < event.files.length; i++)
    {
      const reader = new FileReader();
      reader.readAsDataURL(event.files[i])
      reader.onload = (event) => {
        const randomKey = this.generateRandomString(10);
        if(typeof(reader.result) == 'string')
          localStorage.setItem(`${randomKey}`, reader.result);
      }
      //this._orderService.postAnh(event.files[0].objectURL.changingThisBreaksApplicationSecurity).subscribe();
    }
  }

  // ganFile(event: any): void{
  //   this.fileAnhUpload = event;
  // }
  // xoaGanFile(event: any): void{
  // }
  // clearGanFile(): void{
  //   this.fileAnhUpload = null;
  // }


  postDanhGia(sanPhamId: any){
    const body = {
      userId: this.userId,
      bookId: sanPhamId,
      orderId: this.idDonHang,
      comment: this.nhanXet,
      stars: this.userRating,
    }

    console.log(body);

    this._orderService.postDanhGia(body).subscribe(data => {
        this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'Đánh giá sản phẩm thành công', life: 3000});
        this.callAPI();
        this.displayDanhGia = false;
    })

  }
}

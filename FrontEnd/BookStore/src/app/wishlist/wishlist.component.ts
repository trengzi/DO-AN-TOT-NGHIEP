import { HttpClientModule } from '@angular/common/http';

import { Component, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RatingModule } from 'primeng/rating';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MessageService } from 'primeng/api';
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

@Component({
  selector: 'app-wishlist',
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
    CommonModule,
    RatingModule,
    SelectButtonModule,
    HttpClientModule
  ],
  providers: [
    MessageService,
    BookService
  ],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent {

  listSanPham: any;
  userId: any;

  constructor(
    private route: ActivatedRoute,
    private _messageService: MessageService,
    private _bookService: BookService
  ) {
    const storedValueAccount = AuthService.userId;
    this.userId = storedValueAccount;
    this.callApi();
  }

  callApi() {
    this._bookService.getAllSanPhamYeuThich(this.userId).subscribe(rs => {
      this.listSanPham = rs;
      this.listSanPham.forEach((element: any) => {
        element.imageUrls = element.imageUrls.split(',')[0];
      });
    });
  }

  xoaSanPhamYeuThich(idSanPham: any)
  {
    if(!this.userId)
      return;
    this._bookService.deleteYeuThich(idSanPham, this.userId).subscribe(rs => {
      this.callApi();
    });
  }
}

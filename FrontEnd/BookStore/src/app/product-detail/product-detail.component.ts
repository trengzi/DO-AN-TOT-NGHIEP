import { HttpClientModule } from '@angular/common/http';
import { Component, Pipe, PipeTransform } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { ProductDetailService } from '../../service/product-detail.service';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../service/cart.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
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

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CarouselModule,
    RouterOutlet,
    RouterModule,
    HttpClientModule,
    FormatVndPipe,
    RatingModule,
    CommonModule,
    FormsModule,
    ToastModule
  ],
  providers: [
    ProductDetailService,
    MessageService,
    CartService,
    BookService,
    OrderService
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {

  listBookImg: any;
  listCategoryBook: any;
  listReview: any;
  id: any;
  curBook: any;
  soLuong = 1;
  curImage: any;
  userId: any = null;

  isYeuThich: any;

  constructor(
    private _productDetailService: ProductDetailService,
    private _cartService: CartService,
    private _orderService: OrderService,
    private route: ActivatedRoute,
    private _messageService: MessageService,
    private _bookService: BookService,
    private router: Router
  ){
    const storedValueAccount = AuthService.userId;
    this.userId = storedValueAccount;
  }

  ngOnInit(): void {
    interface SanPham {
      imageUrls: string;
    }
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id !== null && id !== "") {
        this.id = id;
        this.checkYeuThich().then(ckyt => {
          if(ckyt)
            this.isYeuThich = true;
          else
            this.isYeuThich = false;
        })
        this._productDetailService.getDetailBook(id).subscribe(data => {
          this.curBook = data;
          this.listBookImg = this.curBook.imageUrls.split(',');
          this.curImage = this.listBookImg[0];
          this._productDetailService.getCategoryBook(this.curBook.categoryId).subscribe(data2 => {
            this.listCategoryBook = data2;
            this.listCategoryBook.forEach((sanPham: SanPham) => {
              if (sanPham.imageUrls) {
                sanPham.imageUrls = sanPham.imageUrls.split(',')[0];
              } else {
                sanPham.imageUrls = '';
              }
            });
          });
        })

        this._orderService.getReviewByBookId(id).subscribe(dataReview => {
          this.listReview = dataReview;
        })
      }
    });
  }

  changeCurImage(image: any){
    this.curImage = image;
  }

  addToCart(){
    this._bookService.checkSoLuong(this.curBook.id, this.soLuong).subscribe(data => {
      if(data.status == 'error')
      {
        this._messageService.add({severity:'error', summary: 'Thông báo', detail: `Số lượng ${this.soLuong} không có sẵn`, life: 3000});
        return;
      }
      else
      {
        const body = {
          userId: this.userId,
          idsItem: JSON.stringify({
            bookId: this.curBook.id,
            soLuong: this.soLuong
          })
        }
        this._cartService.addToCart(body).subscribe(data => {
          if(data.status == 'success')
          {
            this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'Thêm sản phẩm vào giỏ hàng thành công', life: 3000});
          }
        })
      }
    });
  }

  changeSL(mm: any)
  {
    if(mm == '-')
    {
      if(this.soLuong > 1)
      this.soLuong -= 1;
    }
    else
    {
      if(this.soLuong < this.curBook.quantity)
      this.soLuong += 1;
    }
  }

  changeBook(id: any){
    this.router.navigate([`product-detail/${id}`]);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  }



  themYeuThich() {
    if(this.userId == null || this.userId == 'null')
    {
      this._messageService.add({severity:'info', summary: 'Thông báo', detail: 'Vui lòng đăng nhập trước khi thực hiện thao tác', life: 3000});
      return;
    }
    const body = {
      bookId: this.id,
      userId: this.userId,
    }
    this._bookService.postYeuThich(body).subscribe(data => {
      this.isYeuThich = true;
    }

    );
  }
  boYeuThich(){
    if(this.userId == null || this.userId == 'null')
    {
      this._messageService.add({severity:'info', summary: 'Thông báo', detail: 'Vui lòng đăng nhập trước khi thực hiện thao tác', life: 3000});
      return;
    }
    this._bookService.deleteYeuThich(this.id, this.userId).subscribe(rs => {
      this.isYeuThich = false;
    });
  }

  checkYeuThich(): Promise<boolean> {
    if(!this.userId)
    {
      return Promise.resolve(false);
    }
    return this._bookService.checkYeuThich(this.id, this.userId).then(data => {
      if(data.status == true)
        return true;
      return false;
    });
  }
}

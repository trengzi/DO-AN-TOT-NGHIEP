import { Component, Pipe, PipeTransform } from '@angular/core';
import { HomeService } from '../../service/home.service';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CarouselModule } from 'primeng/carousel';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';

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
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule,
    HttpClientModule,
    CarouselModule,
    FormatVndPipe,
    RatingModule,
    FormsModule
  ],
  providers: [
    HomeService,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {

  selectedButton = 1;
  listSanPhamThang: any;
  listSanPhamTuan: any;
  listSanPhamDGC: any;
  listPublishedBook: any;

  constructor(
    private _homeService: HomeService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0); // Cuộn lên đầu trang
      }
    });

    interface SanPham {
      imageUrls: string;
    }
    this._homeService.getPublishedBook().subscribe(data =>
    {
      this.listPublishedBook = data;
      this.listPublishedBook.forEach((sanPham: SanPham) => {
        if (sanPham.imageUrls) {
          sanPham.imageUrls = sanPham.imageUrls.split(',')[0];
        } else {
          sanPham.imageUrls = '';
        }
      });
    }
    )
    if(this.selectedButton == 1)
      this.getListSanPhamTuan()
    else if(this.selectedButton == 2)
      this.getListSanPhamThang()
    else
      this.getListSanPhamDGC()
  }

  getListSanPhamDGC(){
    interface SanPham {
      imageUrls: string;
      // Các trường dữ liệu khác của sản phẩm
    }
    this.selectedButton = 3;
    if(!this.listSanPhamDGC)
    {
      this._homeService.get3SanPhamDanhGiaCao().subscribe(data => {
        this.listSanPhamDGC = data;
        this.listSanPhamDGC.forEach((sanPham: SanPham) => {
          if (sanPham.imageUrls) {
            sanPham.imageUrls = sanPham.imageUrls.split(',')[0]; // Giữ lại URL đầu tiên trong chuỗi
          } else {
            sanPham.imageUrls = ''; // Nếu không có giá trị imageUrls, gán là chuỗi rỗng
          }
        });
      })
    }

  }

  getListSanPhamTuan(){
    interface SanPham {
      imageUrls: string;
    }
    this.selectedButton = 1;
    if(!this.listSanPhamTuan)
    {
      this._homeService.get3SanPhamTuan().subscribe(data => {
        this.listSanPhamTuan = data;
        this.listSanPhamTuan.forEach((sanPham: SanPham) => {
          if (sanPham.imageUrls) {
            sanPham.imageUrls = sanPham.imageUrls.split(',')[0];
          } else {
            sanPham.imageUrls = '';
          }
        });
      })
    }

  }

  getListSanPhamThang(){
    interface SanPham {
      imageUrls: string;
      // Các trường dữ liệu khác của sản phẩm
    }
    this.selectedButton = 2;
    if(!this.listSanPhamThang)
    {
      this._homeService.get3SanPhamThang().subscribe(data => {
        this.listSanPhamThang = data;
        this.listSanPhamThang.forEach((sanPham: SanPham) => {
          if (sanPham.imageUrls) {
            sanPham.imageUrls = sanPham.imageUrls.split(',')[0]; // Giữ lại URL đầu tiên trong chuỗi
          } else {
            sanPham.imageUrls = ''; // Nếu không có giá trị imageUrls, gán là chuỗi rỗng
          }
        });
      })
    }

  }
}

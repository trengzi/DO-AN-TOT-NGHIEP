import { HttpClientModule } from '@angular/common/http';
import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, Pipe, PipeTransform } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { Subscription } from 'rxjs';
import { HomeService } from '../../service/home.service';
import { AuthorService } from '../../service/author.service';
import { CarouselModule } from 'primeng/carousel';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../service/login.service';

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
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    RouterOutlet,
    CommonModule,
    HttpClientModule,
    FormatVndPipe,
    CarouselModule,
    FormsModule,
  ],
  providers: [
    HomeService,
    AuthorService,
    LoginService
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  animations: [
    trigger('overlayAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 })),
      ]),
    ]),

    trigger('overlayAnimationUser', [
      transition(':enter', [
        style({ transform: 'translateY(-50%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 })),
      ]),
    ]),
  ],
})
export class HeaderComponent {

  searchBoxStatus = false;
  statusSideMenu = false;
  modelLogedin = AuthService.isDangNhap;
  displayModelUser = false;
  userFullName = AuthService.userFullName;
  userId = AuthService.userId;

  listSanPhamHot: any;
  listAuthor: any;
  keyword = '';


  private subscription: Subscription = new Subscription();
  private static subscription: Subscription;
  constructor(
    private _authService: AuthService,
    private _homeService: HomeService,
    private _authorService: AuthorService,
    private _loginService: LoginService,
    public router: Router,
  )
  {
    interface SanPham {
      imageUrls: string;
      // Các trường dữ liệu khác của sản phẩm
    }
    this._homeService.get3SanPhamTuan().subscribe(data => {
      this.listSanPhamHot = data;
      this.listSanPhamHot.forEach((sanPham: SanPham) => {
        if (sanPham.imageUrls) {
          sanPham.imageUrls = sanPham.imageUrls.split(',')[0]; // Giữ lại URL đầu tiên trong chuỗi
        } else {
          sanPham.imageUrls = ''; // Nếu không có giá trị imageUrls, gán là chuỗi rỗng
        }
      });
    })
    this._authorService.getAllAuthor().subscribe(data => {
      this.listAuthor = data;
      console.log(data);
    })
  }

  ngOnInit(): void {
    HeaderComponent.subscription = AuthService.dataSubject.subscribe((value: any) => {
      this.modelLogedin = value;
    });
    HeaderComponent.subscription = AuthService.dataSubjectAccount.subscribe((value: any) => {
      this.userFullName = value;
    });
    HeaderComponent.subscription = AuthService.dataSubjectId.subscribe((value: any) => {
      this.userId = value;
    });
    // this._authService.isLoggedIn$.subscribe((loggedIn: boolean) => {
    //   this.modelLogedin = loggedIn;
    //   if (loggedIn) {
    //     this.userFullName = this._authService.getUserFullName();
    //   }
    // });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  changeStatusSearchBox(){
    this.searchBoxStatus = !this.searchBoxStatus;
  }


  changeStatusSideMenu(){
    this.statusSideMenu = !this.statusSideMenu;
    if (this.statusSideMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  checkStatusDisplay(){
    this.displayModelUser = !this.displayModelUser;
  }

  solveDangXuat(){
    const body = {
      token: localStorage.getItem('jwtToken')
    }
    this._loginService.logout(body).subscribe(data => {
      this._authService.dangXuat();
      this._authService.updateData(false, null, null);
      this.checkStatusDisplay();
      this.router.navigate(['/login']);
    })
  }

  routerToLogin(){
    this.checkStatusDisplay();
    this.router.navigate(['/login']);
  }

  routerToAccount(){
    this.checkStatusDisplay();
    this.router.navigate(['/account']);
  }

  routerToWishlist(){
    this.checkStatusDisplay();
    this.router.navigate(['/wishlist']);
  }

  search(keyword: any){
    localStorage.setItem('keyword', keyword);
    this.router.navigate([`/search/${keyword}`]);
  }

}

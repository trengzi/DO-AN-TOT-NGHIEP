import { ProductListComponent } from './product-list/product-list.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ContactComponent } from './contact/contact.component';
import { PageComponent } from './page/page.component';
import { LoginComponent } from './login/login.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderComponent } from './order/order.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { AccountComponent } from './account/account.component';
import { RegisterComponent } from './register/register.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { SearchComponent } from './search/search.component';
import { AuthGuard } from './AuthGuard';
import { AuthGuard2 } from './AuthGuard2';
import { ChatboxUserComponent } from './chatbox-user/chatbox-user.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent, title:'Trang chủ' },
  { path: '', component: HomeComponent, title:'Trang chủ' },
  { path: 'cart', component: CartComponent, title:'Giỏ hàng', canActivate: [AuthGuard] },
  { path: 'chatbox-user', component: ChatboxUserComponent, title:'Hỗ trợ trực tuyến', canActivate: [AuthGuard] },
  { path: 'product-detail/:id', component: ProductDetailComponent, title:'Chi tiết' },
  { path: 'product-list', component: ProductListComponent, title:'Danh sách sản phẩm' },
  { path: 'contact', component: ContactComponent, title:'Danh sách sản phẩm' },
  { path: 'page/:id', component: PageComponent, title:'Bài viết' },
  { path: 'login', component: LoginComponent, title:'Đăng nhập',canActivate: [AuthGuard2] },
  { path: 'checkout', component: CheckoutComponent, title:'Thanh toán', canActivate: [AuthGuard] },
  { path: 'order', component: OrderComponent, title:'Danh sách đơn hàng', canActivate: [AuthGuard] },
  { path: 'order-detail/:id', component: OrderDetailComponent, title:'Chi tiết đơn hàng', canActivate: [AuthGuard] },
  { path: 'account', component: AccountComponent, title:'Thông tin cá nhân', canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent, title:'Đăng kí tài khoản',canActivate: [AuthGuard2] },
  { path: 'wishlist', component: WishlistComponent, title:'Danh sách yêu thích', canActivate: [AuthGuard] },
  { path: 'search/:keyword', component: SearchComponent, title:'Tìm kiếm' },
];

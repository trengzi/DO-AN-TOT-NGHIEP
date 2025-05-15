import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BookComponent } from './book/book.component';
import { OrderComponent } from './order/order.component';
import { MessageComponent } from './message/message.component';
import { CategoryComponent } from './category/category.component';
import { CouponComponent } from './coupon/coupon.component';
import { UserComponent } from './user/user.component';
import { PublisherComponent } from './publisher/publisher.component';
import { AuthorComponent } from './author/author.component';
import { SupplierComponent } from './supplier/supplier.component';
import { LoginComponent } from './login/login.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';
import { EmployeeLayoutComponent } from './employee-layout/employee-layout.component';
import { ManagerLayoutComponent } from './manager-layout/manager-layout.component';
import { AuthGuard } from './AuthGuard';
import { AuthGuardManager } from './AuthGuardManager';
import { AuthGuardEmployee } from './AuthGuardEmployeey';
import { AuthGuardLoginPage } from './AuthGuardLoginPage';
import { OrderAdminComponent } from './order-admin/order-admin.component';
import { EmployeeComponent } from './employee/employee.component';
import { EmployeeAdminComponent } from './employee-admin/employee-admin.component';
import { ManagerComponent } from './manager/manager.component';
import { ChatboxListUserComponent } from './chatbox-list-user/chatbox-list-user.component';
import { ChatboxEmployeeComponent } from './chatbox-employee/chatbox-employee.component';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, title:'Dashboard', canActivate: [AuthGuard] },
      { path: '', component: DashboardComponent, title:'Dashboard',canActivate: [AuthGuard] },
      { path: 'book', component: BookComponent, title:'Sách', canActivate: [AuthGuard] },
      { path: 'publisher', component: PublisherComponent, title:'Nhà phát hành', canActivate: [AuthGuard] },
      { path: 'author', component: AuthorComponent, title:'Tác giả',canActivate: [AuthGuard] },
      { path: 'supplier', component: SupplierComponent, title:'Nhà cung cấp',canActivate: [AuthGuard] },
      { path: 'order-admin', component: OrderAdminComponent, title:'Đơn hàng',canActivate: [AuthGuard] },
      { path: 'message', component: MessageComponent, title:'Liên hệ',canActivate: [AuthGuard] },
      { path: 'category', component: CategoryComponent, title:'Danh mục',canActivate: [AuthGuard] },
      { path: 'coupon', component: CouponComponent, title:'Mã giảm giá',canActivate: [AuthGuard] },
      { path: 'user', component: UserComponent, title:'Người dùng',canActivate: [AuthGuard] },
      { path: 'employee-admin', component: EmployeeAdminComponent, title:'nhân viên',canActivate: [AuthGuard] },
      { path: 'manager', component: ManagerComponent, title:'quản lý',canActivate: [AuthGuard] },
    ],
  },
  {
    path: 'manager',
    component: ManagerLayoutComponent,
    children: [
      { path: 'dashboard', component: ManagerDashboardComponent, title:'Dashboard', canActivate: [AuthGuardManager] },
      { path: '', component: DashboardComponent, title:'Dashboard', canActivate: [AuthGuardManager] },
      { path: 'book', component: BookComponent, title:'Sách', canActivate: [AuthGuardManager] },
      { path: 'publisher', component: PublisherComponent, title:'Nhà phát hành', canActivate: [AuthGuardManager] },
      { path: 'author', component: AuthorComponent, title:'Tác giả', canActivate: [AuthGuardManager] },
      { path: 'supplier', component: SupplierComponent, title:'Nhà cung cấp', canActivate: [AuthGuardManager] },
      { path: 'order-admin', component: OrderAdminComponent, title:'Đơn hàng', canActivate: [AuthGuardManager] },
      { path: 'message', component: MessageComponent, title:'Liên hệ', canActivate: [AuthGuardManager] },
      { path: 'category', component: CategoryComponent, title:'Danh mục', canActivate: [AuthGuardManager] },
      { path: 'coupon', component: CouponComponent, title:'Mã giảm giá', canActivate: [AuthGuardManager] },
      { path: 'employee', component: EmployeeComponent, title:'nhân viên',canActivate: [AuthGuardManager] },
    ],
  },
  {
    path: 'employee',
    component: EmployeeLayoutComponent,
    children: [
      { path: 'dashboard', component: EmployeeDashboardComponent, title:'Dashboard',canActivate: [AuthGuardEmployee] },
      { path: '', component: DashboardComponent, title:'Dashboard',canActivate: [AuthGuardEmployee] },
      { path: 'order', component: OrderComponent, title:'Đơn hàng',canActivate: [AuthGuardEmployee] },
      { path: 'message', component: MessageComponent, title:'Liên hệ',canActivate: [AuthGuardEmployee] },
      { path: 'chatbox-list', component: ChatboxListUserComponent, title:'Hỗ trợ khách hàng', canActivate: [AuthGuardEmployee] },
      { path: 'chatbox/:userId', component: ChatboxEmployeeComponent, title:'Hỗ trợ khách hàng', canActivate: [AuthGuardEmployee] },
    ],
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent, title:'Login'},
      { path: '', component: LoginComponent, title:'Login'}
    ],
  },
];

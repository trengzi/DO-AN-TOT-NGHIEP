
import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { HttpClientModule } from '@angular/common/http';
import { LoginService } from '../../services/login.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    FormsModule,
    ToastModule,
    MessagesModule,
    HttpClientModule,
    CommonModule
  ],
  providers: [
    MessageService,
    LoginService,
    AuthService
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @ViewChild('targetElement') targetElement!: ElementRef;
  element = {
    username: '',
    password: '',
  }
  jwtString: any;
  constructor(
    private _loginService:LoginService,
    public messageService: MessageService,
    public _authService: AuthService,
    public router: Router,
  ){}

  solveDangNhap(){
    if(!this.element.username || !this.element.password)
    {
      this.messageService.add({severity:'warn', summary: 'Thông báo', detail: 'Email và mật khẩu không được để trống', life: 3000});
      return
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    let ck = emailRegex.test(this.element.username);
    if(!ck)
    {
      this.messageService.add({severity:'warn', summary: 'Thông báo', detail: 'Email không đúng định dạng, vui lòng kiểm tra lại', life: 3000})
      return;
    }
    this._loginService.tryLogin(this.element).subscribe(data => {
      if(data.status == 'success')
      {
        this.messageService.add({severity:'success', summary: 'Thông báo', detail: 'Đăng nhập thành công', life: 3000})
        this.jwtString = data.tokenString
        localStorage.setItem('jwtToken', this.jwtString);
        const token = localStorage.getItem('jwtToken');
        if (token) {
          let tmpRole = data.role == "Admin" ? 1 : data.role == "Manager" ? 2 : data.role == "Employee" ? 3 : 0
            this._authService.updateData(true, tmpRole, data.employeeId);
            setTimeout(() => {
              this.router.navigate([`/${data.role.toLowerCase()}/dashboard`]);
            }, 1000);
          }
      }
      else if(data.status == 'not_allow')
      {
        this.messageService.add({severity:'info', summary: 'Thông báo', detail: 'Yêu cầu tài khoản admin để đăng nhập', life: 3000})
      }
      else
      {
        this.messageService.add({severity:'info', summary: 'Thông báo', detail: 'Thông tin tài khoản hoặc mật khẩu không chính xác!', life: 3000})
      }
    })
  }
}

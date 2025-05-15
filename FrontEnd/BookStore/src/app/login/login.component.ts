import { AuthService } from './../../service/auth.service';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { LoginService } from '../../service/login.service';
import { HttpClientModule } from '@angular/common/http';

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


  ngAfterViewInit() {
    this.scrollToTarget();
  }

  scrollToTarget() {
    if (this.targetElement) {
      this.targetElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
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
          const userInfo = this._authService.getUserInfo(token);
          const username = userInfo['Email'];
          this._authService.setAccount(userInfo['FullName'], userInfo['UserId'])
            // this._authService.setLoginState(username, data.fullName);
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 1000);
        }
      }
      else if(data.status == 'lock')
      {
        this.messageService.add({severity:'info', summary: 'Thông báo', detail: 'Tài khoản hiện đang bị khóa, liên hệ admin để biết thêm chi tiết', life: 3000})
      }
      else
      {
        this.messageService.add({severity:'info', summary: 'Thông báo', detail: 'Thông tin tài khoản hoặc mật khẩu không chính xác!', life: 3000})
      }
    })
  }
}

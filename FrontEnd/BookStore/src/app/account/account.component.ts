import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './../../service/auth.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToastModule } from 'primeng/toast';
import { LoginService } from '../../service/login.service';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    InputTextModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    ToastModule,
    RadioButtonModule,
    HttpClientModule,
    DatePipe,
    DialogModule,
    CalendarModule
  ],
  providers:[
    AuthService,
    LoginService,
    MessageService
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {

  userId: any;
  diachi: any;

  account: any;
  changePasswordModel = false;

  oldPass: any;
  newPass: any;
  newPass2: any;

  constructor(
    public messageService: MessageService,
    private _loginService: LoginService,
    private _authService: AuthService,
  ) {
    const storedValueAccount = AuthService.userId;
    this.userId = storedValueAccount;
    if(this.userId)
    {
      this.callAPI();
    }
  }

  callAPI(): void{
    this._loginService.getUserById(this.userId).subscribe(data =>{
      this.account = data;
    })
  }

  putUser(): void{
    if (!(this.account.dateOfBirth && !isNaN(Date.parse(this.account.dateOfBirth)))) {
      this.messageService.add({severity:'warn', summary: 'Thông báo', detail: 'Định dạng ngày tháng không hợp lệ', life: 3000});
      return;
    }
    this._loginService.putUser(this.account, this.userId).subscribe(data => {
      this.messageService.add({severity:'success', summary: 'Thông báo', detail: 'Sửa thông tin người dùng thành công', life: 3000});
      this._authService.updateData(true, this.account.fullName, this.userId );
      console.log(this.account)
      this.callAPI();
    })
  }

  changePassword(){
    this.changePasswordModel = true;
  }

  doChangePass(){
    if(!this.oldPass || !this.newPass || !this.newPass2)
    {
      this.messageService.add({severity:'info', summary: 'Thông báo', detail: 'Vui lòng điền đầy đủ thông tin', life: 3000});
      return;
    }


    // Điều kiện 1: Độ dài tối thiểu
  if (this.newPass.length < 5) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Thông báo',
      detail: 'Mật khẩu mới phải có ít nhất 5 ký tự',
      life: 3000
    });
    return;
  }


  if (!/\d/.test(this.newPass)) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Thông báo',
      detail: 'Mật khẩu mới phải chứa ít nhất một chữ số',
      life: 3000
    });
    return;
  }

  if (!/[A-Z]/.test(this.newPass)) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Thông báo',
      detail: 'Mật khẩu mới phải chứa ít nhất một chữ cái viết hoa',
      life: 3000
    });
    return;
  }

  if (!/[a-z]/.test(this.newPass)) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Thông báo',
      detail: 'Mật khẩu mới phải chứa ít nhất một chữ cái viết thường',
      life: 3000
    });
    return;
  }

  if (!/[^a-zA-Z0-9]/.test(this.newPass)) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Thông báo',
      detail: 'Mật khẩu mới phải chứa ít nhất một ký tự đặc biệt',
      life: 3000
    });
    return;
  }

  if (this.newPass !== this.newPass2) {
    this.messageService.add({
      severity: 'error',
      summary: 'Thông báo',
      detail: 'Mật khẩu xác nhận không khớp',
      life: 3000
    });
    return;
  }

  this._loginService.changePass( this.account.email, this.oldPass, this.newPass).subscribe(data => {
    if(data.status == 'success'){
      this.messageService.add({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Đổi mật khẩu thành công',
        life: 3000
      });
      setTimeout(() => {
        this.changePasswordModel = false;
        this.oldPass = '';
        this.newPass = '';
        this.newPass2 = '';
      }, 2000);
    }
    else
    {
      this.messageService.add({
        severity: 'error',
        summary: 'KhôngThành công',
        detail: data.message,
        life: 3000
      });
    }
  })


  }
}

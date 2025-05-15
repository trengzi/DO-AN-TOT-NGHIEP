import { HttpClientModule } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { RouterOutlet, RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { LoginService } from '../../service/login.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    AutoCompleteModule,
    FormsModule,
    ToastModule,
    InputNumberModule,
    RadioButtonModule,
    CalendarModule,
    PasswordModule,
    ButtonModule,
    InputTextModule,
    HttpClientModule
  ],
  providers: [
    MessageService,
    LoginService
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {


  codeInput: any;
  codeConfirm: any;
  hoVaTen: any;
  password: any;
  ngaySinh: any;
  sdt: any;
  address: any;

  email: any;
  rqPassword: any;

  constructor(
    private _loginService: LoginService,
    public messageService: MessageService,
  ){}


  async showConfirmDialog() {

    let checkRQ = false;
    if(this.password == null || this.password == "")
    {
      this.rqPassword = "Mật khẩu không được để trống";
      checkRQ = true;
    }
    else
    this.rqPassword = null;
    if(checkRQ)
      {
        return;
      }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Kiểm tra email với biểu thức chính quy
    let ck = emailRegex.test(this.email);
    if(!ck)
    {
      this.messageService.add({severity:'error', summary: 'Thông báo', detail: 'Email không đúng định dạng, vui lòng kiểm tra lại', life: 3000})
      return;
    }

    if(!this.hoVaTen)
    {
      this.messageService.add({severity:'error', summary: 'Thông báo', detail: 'Vui lòng nhập họ và tên', life: 3000})
      return;
    }

    if(!this.address)
      {
        this.messageService.add({severity:'error', summary: 'Thông báo', detail: 'Vui lòng nhập địa chỉ', life: 3000})
        return;
      }

    //required password rule Identity
    if (this.password.length < 5) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thông báo',
        detail: 'Mật khẩu mới phải có ít nhất 5 ký tự',
        life: 3000
      });
      return;
    }


    if (!/\d/.test(this.password)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thông báo',
        detail: 'Mật khẩu mới phải chứa ít nhất một chữ số',
        life: 3000
      });
      return;
    }

    if (!/[A-Z]/.test(this.password)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thông báo',
        detail: 'Mật khẩu mới phải chứa ít nhất một chữ cái viết hoa',
        life: 3000
      });
      return;
    }

    if (!/[a-z]/.test(this.password)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thông báo',
        detail: 'Mật khẩu mới phải chứa ít nhất một chữ cái viết thường',
        life: 3000
      });
      return;
    }

    if (!/[^a-zA-Z0-9]/.test(this.password)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thông báo',
        detail: 'Mật khẩu mới phải chứa ít nhất một ký tự đặc biệt',
        life: 3000
      });
      return;
    }

    //kiem tra username
    let ckUsername = false;
    await this._loginService.checkEmail(this.email).subscribe(data => {
      if(data.status == 'success')
      {
        const body1 = {
          userName: this.email,
          password: this.password,
        }
        let formattedNgaySinh = new Date(this.ngaySinh).toISOString().split('T')[0];
        const body2  = {
          fullName: this.hoVaTen,
          dateOfBirth: formattedNgaySinh,
          address: this.address,
          email: this.email,
          phoneNumber: this.sdt
        }
        this._loginService.postAccount(body1).subscribe(result => {
          if(result.status == 'success')
          {
            this._loginService.postUser(body2).subscribe( rs => {
              if(rs.status == 'success')
              {
                 this.messageService.add({severity:'success', summary: 'Thông báo', detail: 'Đăng ký tài khoản thành công', life: 3000});
              }
              else
              {
                  this.messageService.add({severity:'error', summary: 'Thông báo', detail: 'Có lỗi xảy ra, hãy thử lại sau', life: 3000});
              }
            })

          }

        })
      }
      else
      {
        this.messageService.add({severity:'error', summary: 'Thông báo', detail: 'Email đã đăng kí, vui lòng thử lại email khác', life: 3000});
        return;
      }
    });


  }

}

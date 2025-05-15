import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  public static userFullName: any;
  public static userId: any;
  public static isDangNhap = false;
  jwt = localStorage.getItem('jwtToken');
  static dataSubject: Subject<boolean> = new Subject<boolean>();
  static dataSubjectAccount: Subject<any> = new Subject<any>();
  static dataSubjectId: Subject<any> = new Subject<any>();

  constructor(
    private http: LoginService
  ){
    if(this.jwt)
    {
      var userInfo = this.getUserInfo(this.jwt ?? '');
      const body = {
        token: this.jwt
      }
      this.http.checkBlackList(body).subscribe(data => {
        if(!data.status)
        {
          this.setAccount(userInfo['FullName'], userInfo['UserId']);
        }
      })

    }

  }
  decodeToken(token: string): any {
    if (!token) {
      return null;
    }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  getUserInfo(token: string) {
    return this.decodeToken(token);
  }



  updateData(newData: boolean, newDataAccount: any, userId: any) {
    AuthService.dataSubject.next(newData);
    AuthService.dataSubjectAccount.next(newDataAccount);
    AuthService.isDangNhap = newData;
    AuthService.userFullName = newDataAccount;
    AuthService.userId = userId;
  }

  setAccount(userFullName: any, userId: any): void{
    AuthService.userFullName = userFullName;
    AuthService.userId = userId;
    this.updateData(true, userFullName, userId);
  }

  dangXuat():void{
    AuthService.userFullName = null;
    AuthService.userId = null;
    localStorage.removeItem('jwtToken');
  }
}

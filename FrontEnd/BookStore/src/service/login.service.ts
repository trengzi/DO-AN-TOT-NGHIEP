import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  url = 'https://localhost:7111/api/Auth';
  urlUser = 'https://localhost:7111/api/Users';
  constructor(
    private http:HttpClient
  ) { }

  tryLogin(body: any): Observable<any>{
    return this.http.post(`${this.url}/Login`, body, this.httpOptions);
  }

  getInfoUser(email: any): Observable<any>{
    return this.http.get(`${this.urlUser}/getUserByEmail/${email}`, this.httpOptions);
  }

  getUserById(id: any):  Observable<any>{
    return this.http.get(`${this.urlUser}/${id}`, this.httpOptions);
  }

  putUser(user: any, userId: any): Observable<any>
  {
    return this.http.put(`${this.urlUser}/${user.id}`,user, this.httpOptions);
  }

  changePass(email: any, oldPass: any, newPass: any): Observable<any>
  {
    const body = {
      email,
      oldPass,
      newPass
    }
    return this.http.post(`${this.url}/changePassword/`, body, this.httpOptions);
  }

  checkEmail(email: any): Observable<any>{
    return this.http.get(`${this.url}/checkEmail/${email}`, this.httpOptions);
  }

  postAccount(body: any): Observable<any>{
    return this.http.post(`${this.url}/Register`, body, this.httpOptions);
  }

  postUser(body: any): Observable<any>{
    return this.http.post(`${this.urlUser}`, body, this.httpOptions);
  }

  logout(body: any): Observable<any>{
    return this.http.post(`${this.url}/logout`, body);
  }


  checkBlackList(body: any): Observable<any>{
    return this.http.post(`${this.url}/checkBlackList`, body);
  }
}

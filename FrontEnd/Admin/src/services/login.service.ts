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
  constructor(
    private http:HttpClient
  ) { }

  tryLogin(body: any): Observable<any>{
    return this.http.post(`${this.url}/AdminLogin`, body, this.httpOptions);
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  url = 'https://localhost:7111/api/coupons';
  constructor(
    private http: HttpClient,
  ) { }

  getAllCouponAvailable(): Observable<any>{
    return this.http.get(`${this.url}/getAllCouponAvailable`, this.httpOptions);
  }

  alterCoupon(id: any, body: any): Observable<any>{
    return this.http.put(`${this.url}/${id}`, body, this.httpOptions);
  }
}

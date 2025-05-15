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

  getAllCoupon(): Observable<any>{
    return this.http.get(this.url, this.httpOptions);
  }


  postCoupon(body: any): Observable<any>{
    return this.http.post(this.url, body, this.httpOptions);
  }

  deleteCoupon(id: any): Observable<any>{
    return this.http.delete(`${this.url}/${id}`, this.httpOptions);
  }

  putCoupon(id: any, body: any): Observable<any>{
    return this.http.put(`${this.url}/${id}`, body, this.httpOptions);
  }

  getCouponById(couponId: any): Observable<any>{
    return this.http.get(`${this.url}/${couponId}`, this.httpOptions);
  }
}

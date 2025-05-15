import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  url = 'https://localhost:7111/api/carts';
  constructor(
    private http: HttpClient,
  ) {

   }

  getSanPhamInGioHang(idGioHang: any):  Observable<any>
  {
    return this.http.get(`${this.url}/getsanphamtronggiohang/${idGioHang}`,this.httpOptions);
  }

  addToCart(body: any): Observable<any>
  {
    return this.http.post(this.url, body, this.httpOptions);
  }

  updateCart(userId: any, body: any): Observable<any>
  {
    return this.http.put(`${this.url}/updateCart/${userId}`, body, this.httpOptions);
  }

  deleteBookInCart(id: any): Observable<any>
  {
    return this.http.put(`${this.url}/deleteBook/${id}`, this.httpOptions);
  }
}

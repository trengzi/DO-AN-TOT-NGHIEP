import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  url = 'https://localhost:7111/api/books';
  constructor(
    private http: HttpClient,
  ) { }

  getBookByFilter(keyword: any, categoryId: any, rangeFrom: any, rangeTo: any, order: any, page: any): Observable<any>{
    return this.http.get(`${this.url}/getAllSanPhamWithFilter/${keyword ? keyword : null}/${categoryId}/${rangeFrom}/${rangeTo}/${order}/${page}`, this.httpOptions);
  }

  getAllSanPhamYeuThich(userId: any): Observable<any>{
    return this.http.get(`${this.url}/getAllSanPhamyeuThich/${userId}`, this.httpOptions)
  }

  deleteYeuThich(bookId: any, userId: any): Observable<any>{
    return this.http.delete(`${this.url}/xoaSanPhamYeuThich/${bookId}/${userId}`, this.httpOptions)
  }

  postYeuThich(body: any): Observable<any>{
    return this.http.post(`${this.url}/postYeuThich`, body, this.httpOptions)
  }

  checkYeuThich(bookId: any, userId: any): Promise<any>{
    return this.http.get(`${this.url}/checkYeuThich/${bookId}/${userId}`, this.httpOptions).toPromise();
  }

  updateProducts(body: any): Observable<any> {
    return this.http.put(`${this.url}/update-products`, body, this.httpOptions);
  }

  getBookSearch(keyword: any, page: any): Observable<any>{
    return this.http.get(`${this.url}/getAllSanPhamSearch/${keyword ? keyword : null}/${page}`, this.httpOptions);
  }

  checkSoLuong(bookId: any, quantity: any): Observable<any>{
    return this.http.get(`${this.url}/checkSoLuong/${bookId}/${quantity}`, this.httpOptions);
  }

  checkSoLuongMany(body: any): Observable<any>{
    return this.http.post(`${this.url}/checkSoLuongMany`, body );
  }
}

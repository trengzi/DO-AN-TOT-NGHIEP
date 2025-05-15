import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
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

  postBook(body: any): Observable<any>{
    return this.http.post(this.url, body, this.httpOptions);
  }

  deleteBook(id: any): Observable<any>{
    return this.http.delete(`${this.url}/${id}`, this.httpOptions);
  }

  getBookById(id: any): Observable<any>{
    return this.http.get(`${this.url}/GetBookByIdToUpdate/${id}`, this.httpOptions);
  }

  putBook(id: any, body: any): Observable<any>{
    return this.http.put(`${this.url}/${id}`, body, this.httpOptions);
  }

}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  url = 'https://localhost:7111/api/books';
  constructor(
    private http: HttpClient,
  ) { }

  getDetailBook(id: any): Observable<any>{
    return this.http.get(`${this.url}/${id}`, this.httpOptions);
  }

  getCategoryBook(id: any): Observable<any>{
    return this.http.get(`${this.url}/getCategory20Book/${id}`, this.httpOptions);
  }
}

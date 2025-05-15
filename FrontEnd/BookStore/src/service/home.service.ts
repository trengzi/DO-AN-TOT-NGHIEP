import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  url = 'https://localhost:7111/api/books';
  constructor(
    private http: HttpClient,
  ) { }

  getPublishedBook(): Observable<any>{
    return this.http.get(`${this.url}/get10NewestBook`, this.httpOptions);
  }

  get3SanPhamDanhGiaCao(): Observable<any>{
    return this.http.get(`${this.url}/get3HighestReviewBook`, this.httpOptions);
  }

  get3SanPhamTuan(): Observable<any>{
    return this.http.get(`${this.url}/get3SanPhamTuan`, this.httpOptions);
  }

  get3SanPhamThang(): Observable<any>{
    return this.http.get(`${this.url}/get3SanPhamThang`, this.httpOptions);
  }
}

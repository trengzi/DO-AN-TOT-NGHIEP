import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  url = 'https://localhost:7111/api/categories';
  constructor(
    private http: HttpClient,
  ) { }

  getAllCategory(): Observable<any>{
    return this.http.get(this.url, this.httpOptions);
  }

  postCategory(body: any): Observable<any>{
    return this.http.post(this.url, body, this.httpOptions);
  }

  deleteCategory(id: any): Observable<any>{
    return this.http.delete(`${this.url}/${id}`, this.httpOptions);
  }

  putCategory(id: any, body: any): Observable<any>{
    return this.http.put(`${this.url}/${id}`, body, this.httpOptions);
  }

  getCategoryById(categoryId: any): Observable<any>{
    return this.http.get(`${this.url}/${categoryId}`, this.httpOptions);
  }

}

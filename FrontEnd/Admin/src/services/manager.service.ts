import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  url = 'https://localhost:7111/api/managers';
  constructor(
    private http: HttpClient,
  ) { }

  postManager(body: any): Observable<any>{
    return this.http.post(this.url, body, this.httpOptions);
  }

  deleteManager(id: any): Observable<any>{
    return this.http.delete(`${this.url}/${id}`, this.httpOptions);
  }

  putManager(id: any, body: any): Observable<any>{
    return this.http.put(`${this.url}/${id}`, body, this.httpOptions);
  }

  getManagerById(categoryId: any): Observable<any>{
    return this.http.get(`${this.url}/${categoryId}`, this.httpOptions);
  }

  getAllManager(): Observable<any>{
    return this.http.get(`${this.url}/getAllManager`, this.httpOptions);
  }
}

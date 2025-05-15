import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  url = 'https://localhost:7111/api/pages';
  constructor(
    private http: HttpClient,
  ) { }

  getPage(id: any): Observable<any>{
    return this.http.get(`${this.url}/${id}`, this.httpOptions);
  }
}

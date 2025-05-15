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

}

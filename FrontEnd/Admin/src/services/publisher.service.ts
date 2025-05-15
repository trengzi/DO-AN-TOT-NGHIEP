import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublisherService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  url = 'https://localhost:7111/api/publishers';
  constructor(
    private http: HttpClient,
  ) { }

  getAllPublisher(): Observable<any>{
    return this.http.get(this.url, this.httpOptions);
  }



  postPublisher(body: any): Observable<any>{
    return this.http.post(this.url, body, this.httpOptions);
  }

  deletePublisher(id: any): Observable<any>{
    return this.http.delete(`${this.url}/${id}`, this.httpOptions);
  }

  putPublisher(id: any, body: any): Observable<any>{
    return this.http.put(`${this.url}/${id}`, body, this.httpOptions);
  }

  getPublisherById(publisherId: any): Observable<any>{
    return this.http.get(`${this.url}/${publisherId}`, this.httpOptions);
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  url = 'https://localhost:7111/api/messages';
  constructor(
    private http: HttpClient,
  ) { }

  getAllMessage(): Observable<any>{
    return this.http.get(this.url, this.httpOptions);
  }


  postMessage(body: any): Observable<any>{
    return this.http.post(this.url, body, this.httpOptions);
  }

  deleteMessage(id: any): Observable<any>{
    return this.http.delete(`${this.url}/${id}`, this.httpOptions);
  }

  putMessage(id: any, body: any): Observable<any>{
    return this.http.put(`${this.url}/${id}`, body, this.httpOptions);
  }

  getMessageById(messageId: any): Observable<any>{
    return this.http.get(`${this.url}/${messageId}`, this.httpOptions);
  }
}

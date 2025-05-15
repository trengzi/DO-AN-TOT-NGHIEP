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

  postMessage(body: any): Observable<any>{
    return this.http.post(this.url, body, this.httpOptions);
  }

}

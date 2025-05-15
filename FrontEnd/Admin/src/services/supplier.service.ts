import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  url = 'https://localhost:7111/api/suppliers';
  constructor(
    private http: HttpClient,
  ) { }

  getAllSupplier(): Observable<any>{
    return this.http.get(this.url, this.httpOptions);
  }


  postSupplier(body: any): Observable<any>{
    return this.http.post(this.url, body, this.httpOptions);
  }

  deleteSupplier(id: any): Observable<any>{
    return this.http.delete(`${this.url}/${id}`, this.httpOptions);
  }

  putSupplier(id: any, body: any): Observable<any>{
    return this.http.put(`${this.url}/${id}`, body, this.httpOptions);
  }

  getSupplierById(supplierId: any): Observable<any>{
    return this.http.get(`${this.url}/${supplierId}`, this.httpOptions);
  }
}

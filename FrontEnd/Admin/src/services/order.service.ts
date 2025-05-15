import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  url = 'https://localhost:7111/api/orders';
  urlOrderDetails = 'https://localhost:7111/api/orderDetails';
  constructor(
    private http: HttpClient,
  ) { }

  getAllOrder(): Observable<any>{
    return this.http.get(`${this.url}`, this.httpOptions);
  }

  getAllOrderByEmployeeId(employeeId: any): Observable<any>{
    return this.http.get(`${this.url}/GetAllOrderByEmployeeId/${employeeId}`, this.httpOptions);
  }

  getAllOrderAdmin(page: any): Observable<any>{
    return this.http.get(`${this.url}/orderAdmin/${page}`, this.httpOptions);
  }

  getOrderById(id: any):  Observable<any>
  {
    return this.http.get(`${this.url}/${id}`, this.httpOptions);
  }

  getListSanPhamByIDDonHang(idDonHang: any):  Observable<any>
  {
    return this.http.get(`${this.urlOrderDetails}/getListSanPhamByIdDonHangAdmin/${idDonHang}`, this.httpOptions);
  }

  changeStatusUp(orderId: any):  Observable<any>
  {
    return this.http.get(`${this.url}/changeStatusUp/${orderId}`, this.httpOptions);
  }

  changeStatusDown(orderId: any):  Observable<any>
  {
    return this.http.get(`${this.url}/changeStatusDown/${orderId}`, this.httpOptions);
  }

  setEmployeeForOrder(orderId: any, employeeId: any):  Observable<any>
  {
    return this.http.put(`${this.url}/setEmployeeForOrder/${orderId}/${employeeId}`, this.httpOptions);
  }
}

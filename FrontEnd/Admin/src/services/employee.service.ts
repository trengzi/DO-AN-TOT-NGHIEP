import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  url = 'https://localhost:7111/api/orders';
  urlEmployee = 'https://localhost:7111/api/employees';
  constructor(
    private http: HttpClient,
  ) { }

  getAllEmployee(): Observable<any>{
    return this.http.get(`${this.url}/getAllEmployee`, this.httpOptions);
  }

  getAllEmployeeByManagerId(managerId: any): Observable<any>{
    return this.http.get(`${this.url}/getAllEmployee/${managerId}`, this.httpOptions);
  }


  postEmployee(body: any): Observable<any>{
    return this.http.post(this.urlEmployee, body, this.httpOptions);
  }

  deleteEmployee(id: any): Observable<any>{
    return this.http.delete(`${this.urlEmployee}/${id}`, this.httpOptions);
  }

  putEmployee(id: any, body: any): Observable<any>{
    return this.http.put(`${this.urlEmployee}/${id}`, body, this.httpOptions);
  }

  getEmployeeById(categoryId: any): Observable<any>{
    return this.http.get(`${this.urlEmployee}/${categoryId}`, this.httpOptions);
  }
}

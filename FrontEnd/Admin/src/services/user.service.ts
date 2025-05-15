import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  url = 'https://localhost:7111/api/users';
  urlAuth = 'https://localhost:7111/api/auth';
  constructor(
    private http: HttpClient,
  ) { }

  getAllUser(): Observable<any>{
    return this.http.get(this.url, this.httpOptions);
  }

  getListUserForAdminSupport(): Observable<any>{
    return this.http.get(`${this.url}/getlistuserforadminsupport`, this.httpOptions);
  }

  postUser(body: any): Observable<any>{
    return this.http.post(this.url, body, this.httpOptions);
  }

  deleteUser(id: any): Observable<any>{
    return this.http.delete(`${this.url}/${id}`, this.httpOptions);
  }

  putUser(id: any, body: any): Observable<any>{
    return this.http.put(`${this.url}/${id}`, body, this.httpOptions);
  }

  getUserById(userId: any): Observable<any>{
    return this.http.get(`${this.url}/${userId}`, this.httpOptions);
  }

  lockUser(email: any): Observable<any>{
    return this.http.get(`${this.urlAuth}/lockUser/${email}`, this.httpOptions);
  }

  unlockUser(email: any): Observable<any>{
    return this.http.get(`${this.urlAuth}/unlockUser/${email}`, this.httpOptions);
  }
  updateUserRole(userId: string, role: number): Observable<any> {
    return this.http.post('/api/user/update-role', { userId, role });
  }
}

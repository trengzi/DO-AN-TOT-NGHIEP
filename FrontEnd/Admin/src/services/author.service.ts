import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  url = 'https://localhost:7111/api/authors';
  urlBookAuthors = 'https://localhost:7111/api/bookAuthors';
  constructor(
    private http: HttpClient,
  ) { }

  getAllAuthor(): Observable<any>{
    return this.http.get(this.url, this.httpOptions);
  }

  postBookAuthor(body: any): Observable<any>{
    return this.http.post(`${this.urlBookAuthors}/postRange`, body, this.httpOptions);
  }

  deleteBookAuthor(bookId: any): Observable<any>{
    return this.http.delete(`${this.urlBookAuthors}/deleteByBookId/${bookId}`,  this.httpOptions);
  }

  getAuthorByBookId(bookId: any): Observable<any>{
    return this.http.get(`${this.url}/GetAuthorByBookId/${bookId}`,  this.httpOptions);
  }

  putBookAuthor(id: any, body: any): Observable<any>{
    return this.http.put(`${this.urlBookAuthors}/UpdateAuthorsForBook/${id}`, body, this.httpOptions);
  }


  postAuthor(body: any): Observable<any>{
    return this.http.post(this.url, body, this.httpOptions);
  }

  deleteAuthor(id: any): Observable<any>{
    return this.http.delete(`${this.url}/${id}`, this.httpOptions);
  }

  putAuthor(id: any, body: any): Observable<any>{
    return this.http.put(`${this.url}/${id}`, body, this.httpOptions);
  }

  getAuthorById(authorId: any): Observable<any>{
    return this.http.get(`${this.url}/${authorId}`, this.httpOptions);
  }
}

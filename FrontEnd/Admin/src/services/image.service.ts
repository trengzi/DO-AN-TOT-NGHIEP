import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  url = 'https://localhost:7111/api/cloudinary';
  constructor(
    private http: HttpClient,
  ) { }

  uploadImages(files: File[]): Observable<any> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('files', file); // Key 'files' phải khớp với API
    });

    return this.http.post(`${this.url}/upload-multiple`, formData);
  }
}

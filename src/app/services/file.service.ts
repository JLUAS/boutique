import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  // private apiUrl = 'https://boutique-t9xx.onrender.com';
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  downloadFile(nombre:any) {
    return this.http.get(`${this.apiUrl}/download/example/${nombre}`, {
      responseType: 'blob'  // Esto permite que Angular reciba el archivo como Blob
    });
  }
}

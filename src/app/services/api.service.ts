import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  sendPost(body: FormData): Observable<any> {
    return this.http.post(`https://boutique-t9xx.onrender.com/upload`, body);
  }

  getFiles(): Observable<any> {
    return this.http.get(`https://boutique-t9xx.onrender.com/files`);
  }

  downloadFile(id: number): Observable<Blob> {
    return this.http.get(`https://boutique-t9xx.onrender.com/download/${id}`, { responseType: 'blob' });
  }
}

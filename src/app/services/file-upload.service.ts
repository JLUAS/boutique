import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private apiUrl = 'https://boutique-t9xx.onrender.com'; // Asegúrate de que la URL sea correcta

  constructor(private http: HttpClient) {}

  sendPost(body: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload/excel`, body);
  }

  sendPostPlanograma(body: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload/excel/planograma`, body);
  }
}

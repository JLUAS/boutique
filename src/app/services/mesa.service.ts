import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Mesa } from '../models/Mesa';
@Injectable({
  providedIn: 'root'
})
export class MesaService {
  private apiUrl = 'https://boutique-t9xx.onrender.com';
  constructor(private http: HttpClient) { }

  postMesa(Mesa: Mesa): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.post(`${this.apiUrl}/admin/create/mesa`, Mesa, { headers });
  }
  getMesas():Observable<any>{
    return this.http.get(`${this.apiUrl}/admin/get/mesa`);
  }
  updateMesa(mesa: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.put(`${this.apiUrl}/admin/update/mesa/${mesa.id}`, mesa, { headers });
  }
}

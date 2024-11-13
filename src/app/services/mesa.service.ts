import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Mesa } from '../models/Mesa';
@Injectable({
  providedIn: 'root'
})
export class MesaService {
  // private apiUrl = 'https://boutique-t9xx.onrender.com';
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  postMesa(Mesa: Mesa, nombre_negocio:any): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.post(`${this.apiUrl}/admin/create/mesa/${nombre_negocio}`, Mesa, { headers });
  }
  getMesas(nombre_negocio:string):Observable<any>{
    console.log(nombre_negocio)
    return this.http.get(`${this.apiUrl}/admin/get/mesa/${nombre_negocio}`);
  }
  updateMesa(mesa: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.put(`${this.apiUrl}/admin/update/mesa/${mesa.id}`, mesa, { headers });
  }
}

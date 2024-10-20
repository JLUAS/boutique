import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Orden } from '../models/Orden';

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {
  private apiUrl = 'https://boutique-t9xx.onrender.com';
  constructor(private http: HttpClient) { }

  getProductByCategoryUser(categoria:string): Observable<any>{
    return this.http.get(`${this.apiUrl}/user/get/products`, {
      params: { categoria }}
    );
  }

  postOrder(Orden: Orden): Observable<any>{
    return this.http.post(`${this.apiUrl}/user/create/new/order`, Orden);
  }

}

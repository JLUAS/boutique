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

  postOrders(ordenes: Orden[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/create/new/order`, { ordenes });
  }

  getOrdersByTable(mesa:number): Observable<any>{
    return this.http.get(`${this.apiUrl}/user/get/orders/mesa`, {
      params: { mesa }}
    );
  }

  updateOrder(mesa: number, producto: string, cantidad: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/update/orden/${mesa}`, { producto, cantidad });
  }

  addToOrder(mesa: number, producto: string, cantidad: number, precioUnitario:number , entregado: string, pagado:string): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/insert/orden/${mesa}`, { producto, cantidad, precioUnitario, entregado, pagado });
  }

}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../models/Item';
import { Planograma } from '../models/Planograma';
import { Categoria } from '../models/Categoria';
import { Producto, ProductoEditable } from '../models/Producto';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = 'https://boutique-t9xx.onrender.com';

  constructor(private http: HttpClient) { }

  getAdminDatabase(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get<any[]>(`${this.apiUrl}/inventory/main`, { headers });
  }

  getInventory(username: string): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get<any[]>(`${this.apiUrl}/inventory/${username}`, { headers });
  }

  addItem(username: string, item: Item): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.post(`${this.apiUrl}/inventory/${username}`, item, { headers });
  }

  addItemAdmin(item: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.post(`${this.apiUrl}/inventory`, item, { headers });
  }

  updateItem(base: string, rank: string, item: Item): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.put(`${this.apiUrl}/inventory/${base}/${rank}`, item, { headers });
  }

  deleteItemAdmin(base: string, rank: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.delete(`${this.apiUrl}/inventory/${base}/${rank}`, { headers });
  }

  updateItemUser(base: string, rank: string, item: Item, username: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.put(`${this.apiUrl}/inventoryUser/${base}/${rank}/${username}`, item, { headers });
  }
  sendPost(body: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.post(`${this.apiUrl}/upload/excel`, body, { headers });
  }
  //Obtener todos los nombres de las bases de datos
  getBasesDatos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/bases-datos`);
  }
  //Obtener datos de una base de datos
  getDatos(base: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/datos/${base}`);
  }
  getDatosUser(base: string,username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/datosUser/${base}/${username}`);
  }
  // Obtener todos los nombres de los planogramas
  getPlanogramas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/planogramas`);
  }
  // Obtener datos de un planograma
  getPlanogramaData(planograma: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/datosPlanograma/${planograma}`);
  }
  // Eliminar fila de una tabla planograma
  deletePlanograma(base: string, frente: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.delete(`${this.apiUrl}/planograma/${base}/${frente}`, { headers });
  }
  // Editar informacion de una fila de planograma
  updatePlanograma(base: string, frente: string, item: Planograma): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.put(`${this.apiUrl}/planograma/${base}/${frente}`, item, { headers });
  }
  // Obtener todas las bases de datos de un usuario
  getUserDatabases(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/databases/${username}`);
  }
  checkIfExistDatabase(username:string, baseDatos:string): Observable<any>{
    return this.http.get(`${this.apiUrl}/user/${username}/${baseDatos}`)
  }
  // Obtener datos de un planograma
  getPlanogramasUser(planograma: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/datosFrentesTotalesUser/planogramas/${planograma}`);
  }
  // Obtener datos de un planograma
  getDegradadosUser(planograma: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/datosDegradadoUser/degradados/${planograma}`);
  }
  getFrentesUser(planograma: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/datosFrentesUser/frentes/${planograma}`);
  }


  // Punto de venta

  postCategory(Categoria: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.post(`${this.apiUrl}/admin/create/category`, Categoria, { headers });
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/get/categories`);
  }

  postProduct(Producto: Producto): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.post(`${this.apiUrl}/admin/create/product`, Producto, { headers });
  }

  getProducts(): Observable<any>{
    return this.http.get(`${this.apiUrl}/admin/get/products`);
  }

  getProductsByCategory(categoria: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/get/products/category`, {
      params: { categoria }
    });
  }
  updateProduct(producto: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.put(`${this.apiUrl}/admin/update/product/${producto.id}`, producto, { headers });
  }
}

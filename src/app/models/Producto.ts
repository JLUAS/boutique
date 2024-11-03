export interface Producto {
  nombre: string;
  precio: number;
  categoria: string;
  estado: string;
  imagen: File | null;
  descripcion: string;
  nombre_negocio: string;
}
export interface ProductoEditable {
  id:number
  nombre: string;
  precio: number;
  categoria: string;
  estado: string;
  imagen: File | null;
  descripcion: string;
  nombre_negocio: string;
}

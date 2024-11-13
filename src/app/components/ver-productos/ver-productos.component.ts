import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { Producto, ProductoEditable } from '../../models/Producto';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FileService } from '../../services/file.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-ver-productos',
  templateUrl: './ver-productos.component.html',
  styleUrls: ['./ver-productos.component.css']
})
export class VerProductosComponent implements OnInit {
  categories: string[] = [];
  selectedCategory: string = '';
  products: Producto[] = [];
  producto: Producto = {id: 0, nombre: '', precio: 0, categoria: '', estado: '', imagen: null, descripcion: '', nombre_negocio: '', imagenURL: ''};
  productoEditable = {nombre: '', precio: 0, categoria: '', estado: ''}
  isModalOpen = false;
  isEditModalOpen = false;
  rolSuper: boolean = false;
  alertPostMsg: string = '';
  nombre_negocio: string = '';
  url:string = '';
  prueba = true
  isLoading:boolean = false
  constructor(private iS: InventoryService, private fileService: FileService, private sanitizer: DomSanitizer, private aS: AuthService) {}

  ngOnInit(): void {
    this.getCategories()
    this.selectedCategory = this.categories[0];
    if (this.aS.getRole() == 'super') {
      this.rolSuper = true;
    } else {
      this.rolSuper = false;
    }
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openEditModal(producto: Producto) {
    this.producto = { ...producto };
    this.isEditModalOpen = true;
    this.getCategories();
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }

  getUserData() {
    const username = localStorage.getItem('username');
    if (username) {
      this.iS.getUserBusinessName(username).subscribe(
        data => {
          if (data && data.length > 0) {
            this.nombre_negocio = data[0].nombre_negocio;
          }
        },
        error => {
          console.error('Error fetching business name', error);
        }
      );
    } else {
      console.log('Username not found in localStorage');
    }
  }

  getCategories() {
    this.getUserData();
    if(this.nombre_negocio || this.isEditModalOpen){
      this.iS.getCategories(this.nombre_negocio).subscribe(
        data => {
          this.categories = data.map((item: any) => item.categoria);
        },
        error => {
          console.error('Error fetching categories', error);
        }
      );
    }
  }

  getProductsByCategory() {
    if (this.selectedCategory) {
        this.iS.getProductsByCategory(this.nombre_negocio, this.selectedCategory).subscribe(
          data => {
            this.products = data;
            this.products.forEach(product => this.loadFile(product.nombre));
          },
          error => {
            console.error('Error fetching products by category', error);
          }
        );
    }
  }

  getAllProducts() {
    if (this.selectedCategory) {
      if(this.rolSuper){
        this.iS.getAllProducts().subscribe(
          data => {
            this.products = data;
            this.products.forEach(product => this.loadFile(product.nombre));
          },
          error => {
            console.error('Error fetching products by category', error);
          }
        );
      }else{
        this.iS.getProducts(this.nombre_negocio).subscribe(
          data => {
            this.products = data;
            this.products.forEach(product => this.loadFile(product.nombre));
          },
          error => {
            console.error('Error fetching products by category', error);
          }
        );
      }

    }
  }


  loadFile(nombre: string) {
    this.fileService.downloadFile(nombre).subscribe({
      next: (imageBlob) => {
        const url = window.URL.createObjectURL(imageBlob);
        const productIndex = this.products.findIndex(product => product.nombre === nombre);
        if (productIndex !== -1) {
          this.products[productIndex].imagenURL = url;
        }
      },
      error: (error) => {
        console.error('Error al cargar el archivo:', error);
      }
    });
  }
  saveChanges() {
    const { nombre, precio, categoria, estado, descripcion } = this.producto;

    if (!nombre.trim() || precio <= 0 || !['activo', 'inactivo'].includes(estado) || !this.categories.includes(categoria) || !descripcion.trim()) {
      this.alertPostMsg = 'Todos los campos son obligatorios y deben tener valores válidos.';
      return;
    }else{
      this.productoEditable.nombre = this.producto.nombre
      this.productoEditable.precio = this.producto.precio
      this.productoEditable.categoria = this.producto.categoria
      this.productoEditable.estado = this.producto.estado
      this.iS.updateProduct(this.productoEditable).subscribe(() => {
        alert("Producto actualizado exitosamente");
        this.closeEditModal();
        this.getProductsByCategory();  // Refresh the product list
      }, err => {
        alert("Producto actualizado exitosamente");
        this.closeEditModal();
        this.getProductsByCategory();  // Refresh the product list
      });
    }
  }
  delete(productoId: number) {
    this.iS.deleteProduct(productoId).subscribe(() => {
      alert("Producto eliminado exitosamente");
      this.getProductsByCategory();  // Refresh the product list
    }, err => {
      alert("Producto eliminado exitosamente");
      this.getProductsByCategory();  // Refresh the product list
    });
  }
}

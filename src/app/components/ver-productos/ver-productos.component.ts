import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { Producto } from '../../models/Producto';

@Component({
  selector: 'app-ver-productos',
  templateUrl: './ver-productos.component.html',
  styleUrls: ['./ver-productos.component.css']
})
export class VerProductosComponent implements OnInit {
  categories: string[] = [];
  selectedCategory: string = '';
  products: any[] = [];
  producto: Producto = { nombre: '', precio: 0, categoria: '', estado: '' };
  isModalOpen = false;
  isEditModalOpen = false;

  alertPostMsg: string = '';

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openEditModal(producto: Producto) {
    this.producto = { ...producto };
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }
  constructor(private iS: InventoryService) {}

  ngOnInit(): void {
    this.getCategories();
    this.selectedCategory = this.categories[0]
    this.getProductsByCategory()
  }

  getCategories() {
    this.iS.getCategories().subscribe(
      data => {
        this.categories = data.map((item: any) => item.categoria);

      },
      error => {
        console.error('Error fetching categories', error);
      }
    );
  }

  getProductsByCategory() {
    if (this.selectedCategory) {
      this.iS.getProductsByCategory(this.selectedCategory).subscribe(
        data => {
          this.products = data;
        },
        error => {
          console.error('Error fetching products by category', error);
        }
      );
    }
  }
  getProducts() {
    this.iS.getProducts().subscribe(
      data => {
        this.products = data;
      },
      error => {
        console.error('Error fetching products', error);
      }
    );
  }

  postProducto() {
    const { nombre, precio, categoria, estado } = this.producto;

    if (!nombre.trim() || precio <= 0 || !categoria.trim() || !['activo', 'inactivo'].includes(estado)) {
      this.alertPostMsg = 'Todos los campos son obligatorios y deben tener valores válidos.';
      return;
    }

    // Verificar si el producto ya existe
    const productoExistente = this.products.find(
      p => p.nombre.toLowerCase() === nombre.trim().toLowerCase() && p.categoria.toLowerCase() === categoria.trim().toLowerCase()
    );

    if (productoExistente) {
      this.alertPostMsg = 'El producto ya existe en esta categoría.';
      return;
    }

    this.iS.postProduct(this.producto).subscribe(() => {
      alert("Producto registrado exitosamente");
      this.closeModal();
      this.getProducts();  // Refresh the product list
    }, err => {
      alert("Producto registrado exitosamente");
      this.closeModal();
      this.getProducts();  // Refresh the product list
    });
  }

  saveChanges() {
    const { nombre, precio, categoria, estado } = this.producto;

    if (!nombre.trim() || precio <= 0 || !categoria.trim() || !['activo', 'inactivo'].includes(estado)) {
      this.alertPostMsg = 'Todos los campos son obligatorios y deben tener valores válidos.';
      return;
    }

    this.iS.updateProduct(this.producto).subscribe(() => {
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
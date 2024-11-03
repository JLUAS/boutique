import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { Producto } from '../../models/Producto';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.css']
})
export class CrearProductoComponent implements OnInit {
  producto: Producto = { nombre: '', precio: 0, categoria: '', estado: '',descripcion: '', imagen:null , nombre_negocio:'' };
  isModalOpen = false;
  categories: string[] = [];
  products: any[] = [];
  alertPostMsg: string = '';
  selectedFile: File | null = null;

  constructor(private iS: InventoryService, private authService: AuthService) {}

  getUserData() {
    const rol = this.authService.getRole();
    if (localStorage.getItem('username')) {
      this.iS.getUserBusinessName(localStorage.getItem('username')).subscribe(
        data => {
          if (data && data.length > 0) {
            this.producto.nombre_negocio = data[0].nombre_negocio;
          }
        },
        error => {
          console.error('Error fetching users by category', error);
        }
      );
    }
  }

  ngOnInit(): void {
    this.getCategories();
    this.getProducts();
    this.getUserData();
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
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
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type === 'image/jpeg') {
        this.selectedFile = file;
        this.alertPostMsg = '';
      } else {
        this.alertPostMsg = 'Solo se permiten imágenes en formato JPEG.';
        this.selectedFile = null;
      }
    }
  }

  postProducto() {
    const { nombre, precio, categoria, estado, descripcion, nombre_negocio } = this.producto;
    if (!nombre.trim() || precio <= 0 || !['activo', 'inactivo'].includes(estado)) {
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

    // Crear FormData y añadir los datos del producto y la imagen
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('precio', precio.toString());
    formData.append('categoria', categoria);
    formData.append('estado', estado);
    formData.append('descripcion', descripcion);
    formData.append('nombre_negocio', nombre_negocio);

    // Añadir la imagen solo si ha sido seleccionada
    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile, this.selectedFile.name);
    }

    this.iS.postProduct(formData).subscribe(
      () => {
        alert('Producto registrado exitosamente');
        this.closeModal();
        this.getProducts(); // Actualizar la lista de productos
      },
      err => {
        alert('Error al registrar el producto');
        console.error(err);
      }
    );
  }
}

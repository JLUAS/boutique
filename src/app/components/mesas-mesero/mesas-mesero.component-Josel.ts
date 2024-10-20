import { Component, OnInit } from '@angular/core';
import { MesaService } from '../../services/mesa.service';
import { InventoryService } from '../../services/inventory.service';
import { OrdenesService } from '../../services/ordenes.service';
import { Mesa } from '../../models/Mesa';
import { Producto } from '../../models/Producto';
import { Orden } from '../../models/Orden';

@Component({
  selector: 'app-mesas-mesero',
  templateUrl: './mesas-mesero.component.html',
  styleUrls: ['./mesas-mesero.component.css']
})
export class MesasMeseroComponent implements OnInit {
  addProduct:boolean = false
  mesas: Mesa[] = [];
  categories: string[] = [];
  products: Producto[] = [];
  filteredProducts: Producto[] = [];
  orden: Orden = { mesa: 0, producto: '', cantidad: 0, precioUnitario: 0, entregado: 'pendiente', pagado: 'pendiente' };
  ordenes: Orden[] = [];
  mesa: Mesa = { mesa: 0, estado: 'inactiva' };
  isEditModalOpen: boolean = false;
  isLoading = false;
  alertPostMsg: string = '';
  selectedCategory: string = '';
  selectedProduct: Producto = {nombre: '', precio: 0, categoria:'', estado: ''}; // Producto seleccionado
  quantity: number = 1; // Cantidad por defecto
  productoCart: Producto = { nombre: '', precio: 0, categoria: '', estado: '' };

  // Map for dynamic category colors
  categoryColors: { [key: string]: string } = {};

  constructor(private mS: MesaService, private iS: InventoryService, private oS: OrdenesService) {}

  ngOnInit(): void {
    this.getMesas();
    this.getCategories();
  }

  getCategories() {
    this.iS.getCategories().subscribe(
      data => {
        this.categories = data.map((item: any) => item.categoria);
        this.assignColorsToCategories();
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
        this.filteredProducts = this.products;
      },
      error => {
        console.error('Error fetching products by category', error);
      }
    );
  }

  getMesas() {
    this.mS.getMesas().subscribe(
      data => {
        this.mesas = data;
      },
      error => {
        console.error('Error fetching mesas', error);
      }
    );
  }

  openEditModal(mesa: Mesa) {
    if (mesa.estado === 'activa') {
      this.mesa = { ...mesa };
      this.orden.mesa = mesa.mesa;
      this.isEditModalOpen = true;
      this.getProducts();
    } else {
      alert('No se puede abrir una mesa con orden en curso');
    }
  }

  addProductToCart(producto: Producto) {

    this.productoCart = producto;
    const nuevaOrden: Orden = {
      mesa: this.mesa.mesa,
      producto: producto.nombre,
      cantidad: this.quantity,
      precioUnitario: producto.precio,
      entregado: 'pendiente',
      pagado: 'pendiente'
    };
    this.ordenes.push(nuevaOrden);
    this.quantity = 1; // Reiniciar la cantidad después de agregar el producto
  }

  removeOrder(order: Orden) {
    const index = this.ordenes.indexOf(order);
    if (index > -1) {
      this.ordenes.splice(index, 1);
    }
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }

  recargarMesas() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.getMesas();
    }, 1000); // 1 segundo
  }

  selectProduct(producto: Producto) {
    this.selectedProduct = producto;
    this.orden.producto = producto.nombre;
    this.orden.precioUnitario = producto.precio;
  }

  createOrder() {
    if (this.ordenes.length === 0) {
      this.alertPostMsg = 'No hay productos en la orden.';
      return;
    }

    this.oS.postOrders(this.ordenes).subscribe(
      data => {
        console.log('Ordenes creadas exitosamente', data);
        this.closeEditModal();
        this.getMesas();
      },
      error => {
        console.error('Error creando las ordenes', error);
        this.alertPostMsg = 'Error creando las ordenes.';
      }
    );

    this.ordenes = []; // Limpiar las órdenes después de enviarlas
  }

  saveChanges() {
    this.mesa.estado = 'inactiva';

    const { mesa, estado } = this.mesa;
    if (mesa <= 0 || !['activa', 'inactiva'].includes(estado)) {
      this.alertPostMsg = 'Todos los campos son obligatorios y deben tener valores válidos.';
      return;
    }

    this.mS.updateMesa(this.mesa).subscribe(() => {
      alert("Mesa actualizada exitosamente");
      this.closeEditModal();
      this.getMesas();
    }, err => {
      console.error('Error actualizando la mesa', err);
      this.closeEditModal();
      this.getMesas();
    });
  }

  filterProductsByCategory(category: string) {
    if (category === '') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(product => product.categoria === category);
    }
  }

  assignColorsToCategories() {
    const colors = [
      'bg-red-100',
      'bg-blue-100',
      'bg-green-100',
      'bg-yellow-100',
      'bg-purple-100',
      'bg-pink-100',
      'bg-indigo-100',
      'bg-gray-100'
    ];
    this.categories.forEach((category, index) => {
      this.categoryColors[category] = colors[index % colors.length];
    });
  }

  getProductColor(product: Producto): string {
    return this.categoryColors[product.categoria] || 'bg-gray-100';
  }
}

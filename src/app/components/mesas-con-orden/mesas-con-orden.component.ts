import { Component } from '@angular/core';
import { Mesa } from '../../models/Mesa';
import { Orden, Ordenado } from '../../models/Orden';
import { Producto } from '../../models/Producto';
import { InventoryService } from '../../services/inventory.service';
import { MesaService } from '../../services/mesa.service';
import { OrdenesService } from '../../services/ordenes.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mesas-con-orden',
  templateUrl: './mesas-con-orden.component.html',
  styleUrls: ['./mesas-con-orden.component.css']
})
export class MesasConOrdenComponent {
  addProduct: boolean = false;
  modalText = 'Añadir producto';
  isModalLoading = false;
  mesas: Mesa[] = [];
  ordenados: Ordenado[] = [];
  ordenado: Ordenado = { producto: '', cantidad: 0, precioUnitario: 0 };
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
  selectedProduct: Producto = { nombre: '', precio: 0, categoria: '', estado: '' }; // Producto seleccionado
  quantity: number = 1; // Cantidad por defecto
  productoCart: Producto = { nombre: '', precio: 0, categoria: '', estado: '' };

  // Map for dynamic category colors
  categoryColors: { [key: string]: string } = {};

  constructor(private mS: MesaService, private iS: InventoryService, private oS: OrdenesService) {}

  ngOnInit(): void {
    this.getMesas();
    this.getCategories();
    this.addProductButton();
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
        setTimeout(() => {
          this.isModalLoading = false;
        }, 100);
      },
      error => {
        console.error('Error fetching mesas', error);
      }
    );
  }

  openEditModal(mesa: Mesa) {
    if (mesa.estado !== 'activa') {
      this.mesa = { ...mesa };
      this.orden.mesa = mesa.mesa;
      this.isEditModalOpen = true;
      this.isModalLoading = true;

      this.getOrder(mesa.mesa);
      this.getProducts(); // Recargar productos al abrir el modal de edición
    }
  }

  getOrder(mesa: number) {
    this.oS.getOrdersByTable(mesa).subscribe(
      data => {
        this.ordenados = data;
        setTimeout(() => {
          this.isModalLoading = false;
        }, 100);
      },
      error => {
        console.error('Error fetching mesas', error);
      }
    );
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

  addProductButton() {
    this.addProduct = !this.addProduct;
    this.modalText = this.addProduct ? 'Ver orden' : 'Añadir producto';
    if (this.addProduct) {
      this.getProducts(); // Recargar productos al cambiar a la vista de productos
    }
  }

  recargarMesas() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.getMesas();
    }, 100);
  }

  createOrder() {
    if (this.ordenes.length === 0) {
      this.alertPostMsg = 'No hay productos en la orden.';
      return;
    }
    // Itera sobre todas las órdenes y las envía al backend
    this.ordenes.forEach(orden => {
      this.oS.addToOrder(
        orden.mesa,
        orden.producto,
        orden.cantidad,
        orden.precioUnitario,
        orden.entregado,
        orden.pagado
      ).subscribe(
        () => {
          console.log('Orden creada exitosamente');
          this.getOrder(orden.mesa);
          this.addProductButton();
          this.getProducts(); // Recargar productos después de crear la orden
        },
        err => {
          console.error('Error creando la orden', err);
          this.alertPostMsg = 'Orden creada exitosamente.';
          this.getOrder(orden.mesa);
          this.addProductButton();
          this.getProducts(); // Recargar productos en caso de error también
        }
      );
    });

    this.ordenes = []; // Limpiar las órdenes después de enviarlas
    this.addProduct = false;
  }

  saveChanges(i: number) {
    const mesa = this.mesa?.mesa;
    const ordenado = this.ordenados[i]; // Asegúrate de acceder correctamente al objeto ordenado
    const { producto, cantidad } = ordenado;

    if (mesa && producto && cantidad !== undefined) {
      this.oS.updateOrder(mesa, producto, cantidad).subscribe(
        () => {
          alert('Orden actualizada exitosamente');
          this.getOrder(mesa);
        },
        err => {
          console.error('Error actualizando la orden', err);
          alert('Error actualizando la orden');
        }
      );
    } else {
      console.error('Error: mesa, producto o cantidad no definidos');
      alert('Error: No se pudo actualizar la orden');
    }
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

  increaseQuantity(index: number) {
    if (this.ordenados[index].cantidad < 99) {
      this.ordenados[index].cantidad++;
    }
  }

  decreaseQuantity(index: number) {
    if (this.ordenados[index].cantidad > 1) {
      this.ordenados[index].cantidad--;
    }
  }
}

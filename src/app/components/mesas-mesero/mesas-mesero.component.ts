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
  mesas: Mesa[] = [];
  categories: string[] = [];
  products: Producto[] = [];
  orden: Orden = { mesa: 0, producto: '', cantidad: 0, precioUnitario: 0, entregado: 'pendiente', pagado: 'pendiente' };
  mesa: Mesa = { mesa: 0, estado: 'inactiva' };
  isEditModalOpen: boolean = false;
  isLoading = false;
  alertPostMsg: string = '';
  selectedCategory: string = '';
  selectedProduct: Producto  = {nombre: '', precio: 0, categoria:'', estado: ''}; // Producto seleccionado
  quantity: number = 1; // Cantidad por defecto

  constructor(private mS: MesaService, private iS: InventoryService, private oS: OrdenesService) {}

  ngOnInit(): void {
    this.getMesas();
    this.getCategories();
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

  getProductsByCategory(categoria: string) {
    this.selectedCategory = categoria;
    if (this.selectedCategory) {
      this.oS.getProductByCategoryUser(this.selectedCategory).subscribe(
        data => {
          this.products = data;
        },
        error => {
          console.error('Error fetching products by category', error);
        }
      );
    }
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
    if(mesa.estado == 'activa'){
      this.mesa = { ...mesa };
      this.orden.mesa = mesa.mesa;
      this.isEditModalOpen = true;
    }else{
      alert('No se puede abrir una mesa con orden en curso')
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
    if (!this.selectedProduct) {
      this.alertPostMsg = 'Por favor, selecciona un producto.';
      return;
    }
    if (this.quantity <= 0) {
      this.alertPostMsg = 'La cantidad debe ser mayor a cero.';
      return;
    }

    this.orden.cantidad = this.quantity;
    this.orden.entregado = 'pendiente';
    this.orden.pagado = 'pendiente';

    this.oS.postOrder(this.orden).subscribe(
      data => {
        alert('Orden creada exitosamente');
        this.closeEditModal();
        this.getMesas();
      },
      error => {
        console.error('Error creando la orden', error);
        this.alertPostMsg = 'Error creando la orden.';
      }
    );
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
      alert("Mesa actualizada exitosamente");
      this.closeEditModal();
      this.getMesas();
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { MesaService } from '../../services/mesa.service';
import { MatButtonModule } from '@angular/material/button';
import { Mesa } from '../../models/Mesa';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-mesas-creadas',
  templateUrl: './mesas-creadas.component.html',
  styleUrl: './mesas-creadas.component.css'
})
export class MesasCreadasComponent implements OnInit {
  mesas: any[] = []
  mesa: Mesa ={mesa: 0, estado: '', personas: 0}
  isEditModalOpen: boolean = false
  isLoading = false;
  alertPostMsg: string = '';
  nombre_negocio:string = '';
  try:number = 0
  constructor(private mS: MesaService, private iS: InventoryService){}

  ngOnInit(): void {
    this.getMesas();
  }
  getUserData() {
    if (localStorage.getItem('username')) {
      this.iS.getUserBusinessName(localStorage.getItem('username')).subscribe(
        data => {
          if (data && data.length > 0) {
            this.nombre_negocio = data[0].nombre_negocio;
          }
        },
        error => {
          console.error('Error fetching users by category', error);
        }
      );
    }
  }
  getMesas(){
    this.getUserData();
    console.log(this.nombre_negocio)
    if(this.nombre_negocio != '' && this.try == 0){
      this.mS.getMesas(this.nombre_negocio).subscribe((mesas: Mesa[]) => {
        this.mesas = mesas;
      });
      console.log(this.try)
      this.try = 1
    }
  }

  openEditModal(mesa: Mesa) {
    this.mesa = { ...mesa };
    this.isEditModalOpen = true;
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
    saveChanges() {
      const { mesa, estado } = this.mesa;

      if (mesa <= 0 || !['activa', 'inactiva'].includes(estado)) {
        this.alertPostMsg = 'Todos los campos son obligatorios y deben tener valores válidos.';
        return;
      }

      this.mS.updateMesa(this.mesa).subscribe(() => {
        alert("Producto actualizado exitosamente");
        this.closeEditModal();
        this.getMesas()
      }, err => {
        alert("Producto actualizado exitosamente");
        this.closeEditModal();
        this.getMesas()
      });
    }
}

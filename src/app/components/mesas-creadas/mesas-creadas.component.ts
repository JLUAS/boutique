import { Component, OnInit } from '@angular/core';
import { MesaService } from '../../services/mesa.service';
import { MatButtonModule } from '@angular/material/button';
import { Mesa } from '../../models/Mesa';

@Component({
  selector: 'app-mesas-creadas',
  templateUrl: './mesas-creadas.component.html',
  styleUrl: './mesas-creadas.component.css'
})
export class MesasCreadasComponent implements OnInit {
  mesas: any[] = []
  mesa: Mesa ={mesa: 0, estado: ''}
  isEditModalOpen: boolean = false
  isLoading = false;
  alertPostMsg: string = '';

  constructor(private mS: MesaService){}

  ngOnInit(): void {
    this.getMesas()
  }
  getMesas(){
    this.mS.getMesas().subscribe(
      data => {
        this.mesas = data;
      },
      error => {
        console.error('Error fetching products by category', error);
      }
    )
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

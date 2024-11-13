import { Component, OnInit } from '@angular/core';
import { Mesa } from '../../models/Mesa';
import { MesaService } from '../../services/mesa.service';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-mesa',
  templateUrl: './mesa.component.html',
  styleUrl: './mesa.component.css'
})
export class MesaComponent implements OnInit{
  mesa: Mesa = { mesa: 0, estado: '',personas: 0 };
  mesas: Mesa[] = []; // Lista de mesas existentes
  isModalOpen = false;
  alertPostMsg: string = '';
  nombre_negocio: string = '';
  constructor(private mS: MesaService, private iS: InventoryService) {
  }
  ngOnInit(): void {
    this.getMesas();
    this.getUserData();
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

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  getMesas() {
    this.getUserData();
    this.mS.getMesas(this.nombre_negocio).subscribe((mesas: Mesa[]) => {
      this.mesas = mesas;
    });
  }

  postMesa() {
    const { mesa, estado, personas } = this.mesa;
    if (mesa <= 0 || !['activa', 'inactiva'].includes(estado) || personas <= 0) {
      this.alertPostMsg = 'Todos los campos son obligatorios y deben tener valores válidos.';
      return;
    }else{
      const mesaExiste = this.mesas.some(m => m.mesa === mesa);
      if (mesaExiste) {
        this.alertPostMsg = 'El número de mesa ya existe. Por favor, elija otro número.';
        return;
      }else{
        this.getUserData();
        console.log("Nombre negocio: ", this.nombre_negocio)
        this.mS.postMesa(this.mesa, this.nombre_negocio).subscribe(() => {
          alert("Mesa agregada");
          this.closeModal();
          this.getMesas();
        }, err => {
          alert("Mesa agregada");
          this.closeModal();
          this.getMesas();
        });
      }
    }
  }

}

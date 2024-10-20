import { Component } from '@angular/core';
import { Mesa } from '../../models/Mesa';
import { MesaService } from '../../services/mesa.service';

@Component({
  selector: 'app-mesa',
  templateUrl: './mesa.component.html',
  styleUrl: './mesa.component.css'
})
export class MesaComponent {
  mesa: Mesa = { mesa: 0, estado: '' };
  mesas: Mesa[] = []; // Lista de mesas existentes
  isModalOpen = false;
  alertPostMsg: string = '';

  constructor(private mS: MesaService) {
    this.getMesas(); // Obtener las mesas existentes al inicializar el componente
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  getMesas() {
    this.mS.getMesas().subscribe((mesas: Mesa[]) => {
      this.mesas = mesas;
    });
  }

  postMesa() {
    const { mesa, estado } = this.mesa;
    if (mesa <= 0 || !['activa', 'inactiva'].includes(estado)) {
      this.alertPostMsg = 'Todos los campos son obligatorios y deben tener valores válidos.';
      return;
    }

    // Verificar si el número de mesa ya existe
    const mesaExiste = this.mesas.some(m => m.mesa === mesa);
    if (mesaExiste) {
      this.alertPostMsg = 'El número de mesa ya existe. Por favor, elija otro número.';
      return;
    }

    this.mS.postMesa(this.mesa).subscribe(() => {
      alert("Mesa agregada");
      this.closeModal();
      this.getMesas(); // Actualizar la lista de mesas
    }, err => {
      alert("Mesa agregada");
      this.closeModal();
    });
  }
}

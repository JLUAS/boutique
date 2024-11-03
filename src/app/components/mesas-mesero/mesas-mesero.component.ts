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
export class MesasMeseroComponent {

}

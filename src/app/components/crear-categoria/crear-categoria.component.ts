import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { Categoria } from '../../models/Categoria';

@Component({
  selector: 'app-crear-categoria',
  templateUrl: './crear-categoria.component.html',
  styleUrls: ['./crear-categoria.component.css']
})
export class CrearCategoriaComponent implements OnInit {
  categoria:Categoria = { nombreCategoria: '' };
  isModalOpen = false;
  categories: any[] = [];
  possiblePost: boolean = false;
  alertPostMsg: string = '';
  nombre_negocio: string = ''
  constructor(private iS: InventoryService) {}

  ngOnInit(): void {
    this.getUserData();
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  getUserData(){
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

  getCategories() {
    this.iS.getCategories(this.nombre_negocio).subscribe(
      data => {
        this.categories = data.map((item: any) => item.categoria);
      },
      error => {
        console.error('Error fetching categories', error);
      }
    );
  }

  postCategory() {
    this.getCategories();
    let category = this.categoria.nombreCategoria.trim();

    if (category === '') {
      this.alertPostMsg = 'La categoría no puede estar vacía.';
      return;
    }

    // let categoryLowCase = category.toLowerCase();
    // if (this.categories.map(category => category.toLowerCase()).includes(categoryLowCase)) {
    //   this.alertPostMsg = 'La categoría ya existe, intenta con otra diferente.';
    //   return;
    // }

    this.iS.postCategory(this.categoria, this.nombre_negocio).subscribe(() => {
      alert("Categoría registrada exitosamente");
      this.closeModal();
      this.getCategories();  // Refresh the category list
    }, err => {
      alert('Categoria agregada correctamente')
    });
    this.closeModal()
  }
}

import { User } from './../../models/User';
import { Component } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-ver-usuarios',
  templateUrl: './ver-usuarios.component.html',
  styleUrl: './ver-usuarios.component.css'
})
export class VerUsuariosComponent {
  categories: string[] = [];
  selectedCategory: string = '';
  users: any[] = [];
  user: User = { nombre: '', email: '', contacto: '', nombre_negocio: '', rol:'', ubicacion:'', password: ''};
  isModalOpen = false;
  isEditModalOpen = false;

  alertPostMsg: string = '';

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openEditModal(user: User) {
    this.user = { ...user };
    this.user.password ='';
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }
  constructor(private iS: InventoryService, private aS: AuthService) {}

  ngOnInit(): void {
    this.getRol();
    this.selectedCategory = this.categories[0]
    this.getUsers()
  }

  getRol() {
    const rol = this.aS.getRole();
    if(rol == 'admin'){
      this.iS.getRol().subscribe(
        data => {
          this.categories = data.map((item: any) => item.rol);

        },
        error => {
          console.error('Error fetching categories', error);
        }
      );
    }else if(rol == 'super'){
      this.iS.getAllRol().subscribe(
        data => {
          this.categories = data.map((item: any) => item.rol);

        },
        error => {
          console.error('Error fetching categories', error);
        }
      );
    };

  }

  getUsersByRol() {
    const rol = this.aS.getRole();
    if (this.selectedCategory == 'admin' || this.selectedCategory == 'user' || this.selectedCategory == 'super') {
      if(rol =='super'){
        this.iS.getUsersByRolSuper(this.selectedCategory).subscribe(
          data => {
            this.users = data;
          },
          error => {
            console.error('Error fetching users by category', error);
          }
      );
      }else{
        this.iS.getUsersByRol(this.selectedCategory, localStorage.getItem('username')).subscribe(
          data => {
            this.users = data;
          },
          error => {
            console.error('Error fetching users by category', error);
          }
      );
      }

    }

  }
  getUsers(){
    this.iS.getUsers(localStorage.getItem('username')).subscribe(
      data => {
        this.users = data;
      },
      error => {
        console.error('Error fetching products by category', error);
      }
    );
  }

  saveChanges() {
    console.log(this.user)
    this.iS.updateProduct(this.user).subscribe(() => {
      alert("Producto actualizado exitosamente");
      this.closeEditModal();
      this.getUsersByRol();  // Refresh the product list
    }, err => {
      alert("Producto actualizado exitosamente");
      this.closeEditModal();
      this.getUsersByRol();  // Refresh the product list
    });
  }
}

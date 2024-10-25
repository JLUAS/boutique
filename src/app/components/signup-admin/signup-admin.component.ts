import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { InventoryService } from '../../services/inventory.service';
import { User } from '../../models/User';
import { CustomValidators } from '../customValidator';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-signup-admin',
  templateUrl: './signup-admin.component.html',
  styleUrls: ['./signup-admin.component.css']
})
export class SignupAdminComponent {
  categories: string[] = [];
  user = { nombre: '', email: '', password: '', nombre_negocio: '', ubicacion: 'NA', contacto: 'NA', rol: '' };
  isModalOpen = false;
  selectedCategory: string = '';
  nombre_negocio: string = '';
  msgError: string = '';
  passwordError: string = ''; // Para mostrar errores relacionados con la contraseña
  passwordMismatchError: string = ''; // Para mostrar si las contraseñas no coinciden
  confirmPassword: string = ''; // Nuevo campo para confirmar la contraseña
  users: any[] = [];
  allowedCharacters = '@$!%*?&.-_¡?¿#"!/()\'{};:';

  constructor(private authService: AuthService, private router: Router, private iS: InventoryService) {}
  openModal() {
    this.isModalOpen = true;
    this.getUserData()
    console.log(this.user.nombre_negocio, this.nombre_negocio)
    this.user.nombre_negocio = this.nombre_negocio
    this.iS.getCategories().subscribe(
      data => {
        this.categories = data.map((item: any) => item.rol);
      },
      error => {
        console.error('Error fetching categories', error);
      }
    );
  }

  closeModal() {
    this.isModalOpen = false;
  }

  getUserData() {
    const rol = this.authService.getRole();
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

  registerAdmin() {
    this.msgError = '';
    this.passwordError = '';
    this.passwordMismatchError = '';
    this.user.nombre_negocio = this.nombre_negocio
    this.getUserData();
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.-_¡?¿#"!/()'{};:])[A-Za-z\d@$!%*?&.-_¡?¿#"!/()'{};:]{8,12}$/;
    // Verifica si las contraseñas no coinciden
    if (this.confirmPassword !== this.user.password) {
      this.passwordMismatchError = 'Las contraseñas no coinciden.';
    }
    // Verifica si la contraseña no cumple con el formato requerido
    else if (!passwordRegex.test(this.user.password)) {
      console.log(this.user.password)
      this.passwordError = 'La contraseña debe tener entre 8 y 12 caracteres, incluir una mayúscula, un número y un símbolo.';
    }
    // Verifica que los otros campos estén completos
    else if (this.user.nombre && this.user.email && this.user.password && this.user.nombre_negocio && this.user.ubicacion && this.user.contacto) {
      this.authService.registerAdmin(this.user).subscribe(() => {
        this.msgError = "Administrador correctamente agregado a la base de datos";
      }, err => {
        console.error('Error en la solicitud:', err);
        location.reload();
      });
    } else {
      this.msgError = "Por favor completa todos los campos.";
    }
  }

}

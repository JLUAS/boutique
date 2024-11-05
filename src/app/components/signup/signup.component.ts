import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  user = { nombre: '', email: '', password: '', nombre_negocio: '', ubicacion: '', contacto: '' , rol: 'user'};
  adminMsg: string = '';
  isModalOpen = false;
  nombre_negocio: string = '';
  ubicacion: string = '';
  msgError: string = '';
  passwordError: string = ''; // Para mostrar errores relacionados con la contraseña
  passwordMismatchError: string = ''; // Para mostrar si las contraseñas no coinciden
  confirmPassword: string = ''; // Nuevo campo para confirmar la contraseña
  allowedCharacters = '@$!%*?&.-_¡?¿#"!/()\'{};:';
  constructor(private authService: AuthService, private router: Router, private iS: InventoryService) {}

  ngOnInit(): void {}
  openModal() {
    this.isModalOpen = true;
    this.getUserData()
    this.user.nombre_negocio = this.nombre_negocio
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
      this.iS.getUserUbication(localStorage.getItem('username')).subscribe(
        data => {
          if (data && data.length > 0) {
            this.ubicacion = data[0].ubicacion;
          }
        },
        error => {
          console.error('Error fetching users by category', error);
        }
      );
    }
    console.log(localStorage.getItem('username'))
  }

  registerUser() {
    this.msgError = '';
    this.passwordError = '';
    this.passwordMismatchError = '';
    this.getUserData()
    this.user.nombre_negocio = this.nombre_negocio;
    this.user.ubicacion = this.ubicacion;
    console.log(this.user)
    console.log(this.user.password, this.confirmPassword)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.-_¡?¿#"!/()'{};:])[A-Za-z\d@$!%*?&.-_¡?¿#"!/()'{};:]{8,12}$/;
    if((this.confirmPassword !== this.user.password)){
      this.passwordMismatchError = 'Las contraseñas no coinciden.'
    }else if(!passwordRegex.test(this.user.password)) {
      console.log(this.user.password)
      this.passwordError = 'La contraseña debe tener entre 8 y 12 caracteres, incluir una mayúscula, un número y un símbolo.';

    }else if(this.user.nombre && this.user.email && this.user.password && this.user.nombre_negocio && this.user.ubicacion && this.user.contacto){
        this.authService.registerUser(this.user).subscribe(() => {
        }, err => {
          alert("Usuario correctamente registrado en la base de datos");
          window.location.reload()
        });
    } else {
        this.msgError = "Por favor completa todos los campos"
    }
    }

}

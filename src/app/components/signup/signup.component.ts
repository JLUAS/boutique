import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  user = { username: '', password: '', baseDeDatos: '' }; // Cambia baseDeDatos a un array
  adminMsg: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  registerUser() {
    this.user.baseDeDatos = 'created'
    if (this.user.baseDeDatos.trim() !== '') {
      this.authService.registerUser(this.user).subscribe(() => {
        alert("Usuario correctamente registrado en la base de datos");
        this.router.navigate(['/usuarios']);
      }, err => {
      });
    } else {
      alert("El campo Base de datos no puede estar vacío");

    }
    alert("Usuario correctamente registrado en la base de datos");
        this.router.navigate(['/usuarios']);

    }

}

import { Component, OnInit, signal } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  iconColor = '#A8D0DA'; // Color Sinbad
  admin: boolean = false;
  msg: string = '';
  user = { username: '', password: '' };
  isLoading = false;
  msgError:string = ''

  constructor(private authService: AuthService, private router: Router) {}
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  ngOnInit(): void {
    this.msg = '¿Eres administrador? Inicia sesión.';
  }

  loginMsg() {
    this.msgError = ''
    this.admin = !this.admin;
    if (this.admin) {
      this.msg = '¿Eres usuario? Inicia sesión.';
    } else {
      this.msg = '¿Eres administrador? Inicia sesión.';
    }
  }

  userLogin() {
    this.msgError = ''
    this.isLoading = true;
    this.authService.login(this.user).subscribe(
      (res: any) => {
        this.isLoading = false;
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', this.user.username);
        this.router.navigate(['/usuario']);
      },
      (err) => {
        this.isLoading = false;
        this.msgError = 'Error al iniciar sesión'
        console.error(err);
        console.log(this.msgError)
      }
    );
  }

  adminLogin() {
    this.msgError = ''
    this.isLoading = true;
    this.authService.adminLogin(this.user).subscribe(
      (res: any) => {
        this.isLoading = false;
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', this.user.username);
        this.router.navigate(['/dashboard']);
      },
      (err) => {
        this.isLoading = false;
        this.msgError = 'Error al iniciar sesión'
        console.error(err);
        console.log(this.msgError)

      }
    );
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { LoginService } from '../services/login.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterOutlet, 
    RouterModule, 
    CommonModule, 
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  router = inject(Router)
  Loading: boolean = false;
  loginForm: FormGroup;
  alertMessage: string = '';
  alertClass: string = '';

  navigateSingup() {
    this.router.navigate(['/singup'])
  }

  navigateToApp() {
    this.router.navigate(['/home'])
  }

  constructor(
    private loginService: LoginService,
    private cookieService: CookieService,
    private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  Loging(): void {

    this.closeAlert();

    if (this.loginForm.valid) {
      const username = this.loginForm.value.username;
      const password = this.loginForm.value.password; 
      const body = {
        usuario: username,
        contrasena: password
      };
      this.Loading = true;
      this.loginService.Login(body).subscribe(
        (response: any) => {
          this.Loading = false;
          
          if (response && response.code === 100) {
            this.setCookie(response.token);
            this.setAlert('Inicio de sesión exitoso', 'alertOk');
            this.navigateToApp();
          } else {
            this.setAlert(response.msm, 'alertError');
          }
        },
        (error) => {
          this.Loading = false;
          if (error.error && error.error.msm) {
            this.setAlert(error.error.msm, 'alertError');
          } else {
            this.setAlert('Error al iniciar sesión', 'alertError');
          }
        }
      );
    } else {
      this.setAlert('Completa los datos de inicio', 'alertError');
    }
  }

  ngOnInit() {
    const tokenExiste = this.getCookie();
    if (tokenExiste) {
      this.navigateToApp();
    }
  }

  setAlert(message: string, cssClass: string): void {
    this.alertMessage = message;
    this.alertClass = cssClass;
  }

  closeAlert(): void {
    this.alertMessage = '';
    this.alertClass = '';
  }

  setCookie(token: string) {
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 45);
    this.cookieService.set('token', token, expirationDate);
  }

  getCookie() {
    const valorToken = this.cookieService.get('token');
    return valorToken !== '';
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservasService } from '../services/reservas.service';
import { TokenService } from '../services/token.service';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.css'
})
export class ReservasComponent implements OnInit {
  constructor(
    private reservasService: ReservasService, 
    private tokenService: TokenService,
    private cookieService: CookieService
  ) {}
  Loading: boolean = true;
  token: string = '';
  alertMessage: string = '';
  alertClass: string = '';
  reservas: any;

  ngOnInit(): void {

    this.token = this.getCookie();
    const valToken = this.tokenService.getDecodedToken(this.token);
    
    if (!valToken) { 
      this.setAlert('Tu sesion expiro vuelve a iniciar', 'alertError');
      return
    }
    const idUser = valToken.nameid;

    this.reservasService.GetReservas(idUser, this.token).subscribe(
      (response: any) => {
        this.Loading = false;
        if (response && response.code === 100) {
          this.reservas = response.data;
          console.log("data", JSON.stringify(response.data))
        } else {
          this.setAlert(response.msm, 'alertError');
        }
      },
      (error) => {
        this.Loading = false;
        console.log("error", error)
        if (error.error && error.error.msm) {
          this.setAlert(error.error.msm, 'alertError');
        } else {
          this.setAlert('No se pudo realizar la operacion, intente nuevamente', 'alertError');
        }
      }
    );
  }

  setAlert(message: string, cssClass: string): void {
    this.alertMessage = message;
    this.alertClass = cssClass;
  }

  closeAlert(): void {
    this.alertMessage = '';
    this.alertClass = '';
  }

  getCookie() {
    const valorToken = this.cookieService.get('token');
    return valorToken;
  }
}

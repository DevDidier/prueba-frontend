import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitacionService } from '../services/habitacion.service';
import { ReservarService } from '../services/reservar.service';
import { TokenService } from '../services/token.service';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-habitacion',
  standalone: true,
  imports: [
      CommonModule,
      MatNativeDateModule,
      MatDatepickerModule,
      MatFormFieldModule,
      FormsModule
    ],
  templateUrl: './habitacion.component.html',
  styleUrls: ['./habitacion.component.css']
})
export class HabitacionComponent implements OnInit {
  @Input() id!: number;
  habitacion: any;
  Loading: boolean = true;
  LoadingReq: boolean = false;
  fechasReservadas: { inicio: Date, fin: Date }[] = [];
  minDate: string = '';
  startDate: Date | undefined;
  endDate: Date | undefined;
  token: string = '';

  alertMessage: string = '';
  alertClass: string = '';

  constructor(
    private habitacionService: HabitacionService,
    private cookieService: CookieService,
    private reservarService: ReservarService,
    private tokenService: TokenService
  ) {
    const hoy = new Date();
    this.minDate = hoy.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.habitacionService.getHabitacion(this.id).subscribe(
      (data) => {
        this.habitacion = data;
        this.Loading = false;
        this.fechasReservadas = this.habitacion.reservas
          .map((r: any) => ({ inicio: new Date(r.fecha_inicio), fin: new Date(r.fecha_fin) }));
      },
      (error) => {
        this.Loading = false;
      }
    );
  }

  Reservar(): void {
    this.closeAlert();
    this.token = this.getCookie();
    const valToken = this.tokenService.getDecodedToken(this.token);
    
    if (!valToken) { 
      this.setAlert('Tu sesion expiro vuelve a iniciar', 'alertError');
      return
    }
    const idUser = valToken.nameid;
    if (this.startDate && this.endDate) {
      this.LoadingReq = true;
      const formattedStartDate = this.formatDate(this.startDate);
      const formattedEndDate = this.formatDate(this.endDate);
      
      const body = {
        idUser: idUser,
        idRoom: this.id,
        fechaini: formattedStartDate,
        fechafin: formattedEndDate
      }

      this.reservarService.crearReserva(body, this.token).subscribe(
        (response: any) => {
          this.LoadingReq = false;
          
          if (response && response.code === 100) {
            this.setAlert(response.msm, 'alertOk');
          } else {
            this.setAlert(response.msm, 'alertError');
          }
        },
        (error) => {
          this.LoadingReq = false;
          if (error.error && error.error.msm) {
            this.setAlert(error.error.msm, 'alertError');
          } else {
            this.setAlert('No se pudo realizar la operacion, intente nuevamente', 'alertError');
          }
        }
      );
    } else {
      this.setAlert('Selecciona las fechas de reserva', 'alertError');
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    return `${year}-${month}-${day}`;
  }

  isDateRangeAvailable = (date: Date | null): boolean => {
    if (!date) {
      return true;
    }
    
    console.log("reservas", this.fechasReservadas);
    return !this.fechasReservadas.some(reserva => 
      date >= reserva.inicio && date <= reserva.fin
      || date <= reserva.inicio && date >= reserva.fin
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
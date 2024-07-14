import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservasService } from '../services/reservas.service';
import { TokenService } from '../services/token.service';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CookieService } from 'ngx-cookie-service';
import { CancelarService } from '../services/cancelar.service';
import { HabitacionService } from '../services/habitacion.service';
import { CambiarreservaService } from '../services/cambiarreserva.service';
export interface Reserva {
  id: number;
  id_habitacion: number,
  habitacion: {
    nombre: string;
  };
  fecha_inicio: string;
  fecha_fin: string;
  fechasys: Date;
}
@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [
    CommonModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.css'
})

export class ReservasComponent implements OnInit {
  
  Loading: boolean = true;
  token: string = '';
  alertMessage: string = '';
  alertClass: string = '';
  alertMessageModal: string = '';
  alertClassModal: string = '';
  reservas: Reserva[] = [];
  reservaSeleccionadaId: number | null = null;
  LoadingModal: boolean = false;
  DisabledBtn: boolean = false;
  DisabledBtn2: boolean = false;
  minDate: string = '';
  idUser: number | null = null;
  startDate: Date | undefined;
  endDate: Date | undefined;
  fechasReservadas: { inicio: Date, fin: Date }[] = [];
  habitacion: any;

  constructor(
    private reservasService: ReservasService, 
    private tokenService: TokenService,
    private cookieService: CookieService,
    private cancelarService: CancelarService,
    private habitacionService: HabitacionService,
    private CambiarreservaService: CambiarreservaService
  ) {
    const hoy = new Date();
    this.minDate = hoy.toISOString().split('T')[0];
  }

  ngOnInit(): void {

    this.token = this.getCookie();
    const valToken = this.tokenService.getDecodedToken(this.token);
    
    if (!valToken) { 
      this.setAlert('Tu sesion expiro vuelve a iniciar', 'alertError');
      return
    }
    const idUser = valToken.nameid;
    this.idUser = valToken.nameid;

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

  seleccionarReserva(id: number): void {
    this.reservaSeleccionadaId = id;
    this.DisabledBtn = false;
  }

  verFechas(idReserva: number, idHab: number): void {
    this.alertMessage = '';
    this.reservaSeleccionadaId = idReserva;
    this.habitacionService.getHabitacion(idHab).subscribe(
      (data) => {
        this.habitacion = data;
        console.log("iduser", this.idUser)
        this.fechasReservadas = this.habitacion.reservas
        .filter((r: any) => r.id_user != this.idUser)
        .map((r: any) => ({
            inicio: new Date(r.fecha_inicio),
            fin: new Date(r.fecha_fin)
          }));
      },
      (error) => {
      }
    );
  }

  cancelarReserva(): void {
    if (this.reservaSeleccionadaId !== null) {
      this.token = this.getCookie();
      const valToken = this.tokenService.getDecodedToken(this.token);
      
      if (!valToken) { 
        this.setAlert('Tu sesion expiro vuelve a iniciar', 'alertError');
        return
      }
      this.LoadingModal = true;
      this.DisabledBtn = true;
      const idUser = valToken.nameid;
      const body = {
        idUser: idUser,
        idReserva: this.reservaSeleccionadaId
      }
      this.cancelarService.CancelarReserva(body, this.token).subscribe(
        (response: any) => {
          this.LoadingModal = false;
          this.setAlert('Reserva Cancelada', 'alertOk');
          this.eliminarItem(this.reservaSeleccionadaId);
        },
        (error) => {
          this.LoadingModal = false;
          this.DisabledBtn = false;
          if (error.error && error.error.msm) {
            this.setAlert(error.error.msm, 'alertError');
          } else {
            this.setAlert('Error al cancelar', 'alertError');
          }
        }
      );
      this.reservaSeleccionadaId = null;
    }
  }

  cambiarFecha(): void {
    if (this.reservaSeleccionadaId !== null) {
      this.token = this.getCookie();
      const valToken = this.tokenService.getDecodedToken(this.token);
      if (!valToken) { 
        this.setAlert('Tu sesion expiro vuelve a iniciar', 'alertError');
        return
      }
      this.DisabledBtn2 = true;

      if (this.startDate && this.endDate) {
        const formattedStartDate = this.formatDate(this.startDate);
        const formattedEndDate = this.formatDate(this.endDate);
        this.LoadingModal = true;
        const body = {
          idReserva: this.reservaSeleccionadaId,
          fechaini: formattedStartDate,
          fechafin: formattedEndDate
        }
        const idRes = this.reservaSeleccionadaId
        console.log("idRES", idRes)
        this.CambiarreservaService.CambiarReserva(body, this.token).subscribe(
          (response: any) => {
            this.LoadingModal = false;
            this.setAlert('Reserva Cambiada', 'alertOk');
            console.log("idRES2", idRes)
            this.actualizarFechas(idRes, formattedStartDate, formattedEndDate);
          },
          (error) => {
            this.LoadingModal = false;
            this.DisabledBtn = false;
            if (error.error && error.error.msm) {
              this.setAlert(error.error.msm, 'alertError');
            } else {
              this.setAlert('Error al cancelar', 'alertError');
            }
          }
        );
        this.reservaSeleccionadaId = null;
      }
    }
  }

  setAlert(message: string, cssClass: string): void {
    this.alertMessage = message;
    this.alertClass = cssClass;
  }

  setAlertModal(message: string, cssClass: string): void {
    this.alertMessageModal = message;
    this.alertClassModal = cssClass;
  }

  closeAlert(): void {
    this.alertMessage = '';
    this.alertClass = '';
  }

  eliminarItem(id: any) {
    this.reservas = this.reservas.filter(reserva => reserva.id !== id);
  }

  actualizarFechas(id: any, nuevaFechaInicio: string, nuevaFechaFin: string) {
    this.reservas = this.reservas.map(reserva => {
      console.log("reserva.id", reserva.id)
      console.log("id", id)
      if (reserva.id == id) {
        return {
          ...reserva,
          fecha_inicio: nuevaFechaInicio,
          fecha_fin: nuevaFechaFin
        };
      }
      return reserva;
    });
  }

  getCookie() {
    const valorToken = this.cookieService.get('token');
    return valorToken;
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
}

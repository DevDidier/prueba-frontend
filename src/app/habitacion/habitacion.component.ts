import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitacionService } from '../services/habitacion.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-habitacion',
  standalone: true,
  imports: [
      CommonModule,
      MatNativeDateModule,
      MatDatepickerModule,
      MatFormFieldModule
    ],
  templateUrl: './habitacion.component.html',
  styleUrls: ['./habitacion.component.css']
})
export class HabitacionComponent implements OnInit {
  @Input() id!: number;
  habitacion: any;
  Loading: boolean = true;
  fechasReservadas: { inicio: Date, fin: Date }[] = [];
  minDate: string = '';

  constructor(private habitacionService: HabitacionService) {
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
        console.error('Error fetching habitacion', error);
        this.Loading = false;
      }
    );
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
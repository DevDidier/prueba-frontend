import { Component } from '@angular/core';
import { HabitacionesService } from '../services/habitaciones.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-habitaciones',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './habitaciones.component.html',
  styleUrl: './habitaciones.component.css'
})
export class HabitacionesComponent {
  Loading: boolean = true;
  habitaciones$ = this.habitacionesService.getHabitaciones();

  constructor(private habitacionesService: HabitacionesService) {
    this.habitaciones$.subscribe(
      () => { this.Loading = false; },
      () => { this.Loading = false; }
    );
  }
}
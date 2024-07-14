import { Component, OnInit } from '@angular/core';
import { HabitacionesService } from '../services/habitaciones.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface Habitacion {
  id: number;
  nombre: string;
  valor: number;
  imagen: string;
}

@Component({
  selector: 'app-habitaciones',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './habitaciones.component.html',
  styleUrl: './habitaciones.component.css'
})
export class HabitacionesComponent implements OnInit {
  Loading: boolean = true;
  habitaciones: Habitacion[] = [];

  constructor(private habitacionesService: HabitacionesService) {
  }

  ngOnInit(): void {
    this.habitacionesService.getHabitaciones().subscribe(
      (response: any) => {
        console.log("response", response)
        this.habitaciones = response;
        this.Loading = false;
      }
    );
  }
  
}
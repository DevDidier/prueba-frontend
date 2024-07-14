import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface HabitacionesResponse {
  code: number;
  data: any;
}

@Injectable({
  providedIn: 'root'
})

export class HabitacionesService {
  private readonly _http = inject(HttpClient);
  private apiUrl = 'https://localhost:7221/habitaciones';

  constructor() { }
  
  getHabitaciones(): Observable<any> {
    return this._http.get<HabitacionesResponse>(this.apiUrl).pipe(
      map(response => {
        if (response && response.code === 100) {
          return response.data;
        } else {
          throw new Error('Not Found');
        }
      })
    );
  }
}

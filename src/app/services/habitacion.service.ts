import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface HabitacionResponse {
  code: number;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class HabitacionService {
  private readonly _http = inject(HttpClient);
  private apiUrl = 'https://server.ladiestoys.com.co/habitacion';

  constructor() { }
  
  getHabitacion(id: number): Observable<any> {
    return this._http.get<HabitacionResponse>(`${this.apiUrl}/${id}`).pipe(
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

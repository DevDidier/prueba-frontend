import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  getDecodedToken(token: string): any | null {
    if (token) {
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        return tokenPayload;
      } catch (error) {
        return null;
      }
    }
    return null;
  }
}

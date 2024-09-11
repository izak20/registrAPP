import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserKey = 'currentUser';
  private tokenKey = 'auth_token';
  private userSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.userSubject.asObservable();

  constructor() {
    this.checkToken();
  }

  private checkToken() {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const user = this.getUser();
      if (user) {
        this.userSubject.next(user);
      }
    }
  }

  register(email: string, name: string, password: string, role: string): boolean {
    const user = { email, name, password, role };
    if (localStorage.getItem(email)) {
      return false; // Usuario ya existe
    }
    localStorage.setItem(email, JSON.stringify(user));
    this.setSession(email);
    return true;
  }

  login(email: string, password: string): any {
    const user = localStorage.getItem(email);
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.password === password) {
        this.setSession(email);
        return parsedUser;
      }
    }
    return null; // Credenciales incorrectas
  }

  private setSession(email: string) {
    localStorage.setItem(this.currentUserKey, email);
    localStorage.setItem(this.tokenKey, this.generateToken()); // Genera y guarda un token
    const user = this.getUser();
    this.userSubject.next(user);
  }

  logout() {
    localStorage.removeItem(this.currentUserKey);
    localStorage.removeItem(this.tokenKey);
    this.userSubject.next(null);
  }

  getUser(): any {
    const email = localStorage.getItem(this.currentUserKey);
    if (email) {
      const user = localStorage.getItem(email);
      if (user) {
        return JSON.parse(user);
      }
    }
    return null;
  }

  getUserRole(): string | null {
    const user = this.getUser();
    return user ? user.role : null;
  }

  validateToken(token: string): Observable<boolean> {
    // En una aplicación real, aquí harías una llamada al backend para validar el token
    // Por ahora, simplemente comprobamos si el token existe y coincide con el almacenado
    const storedToken = localStorage.getItem(this.tokenKey);
    return of(!!storedToken && storedToken === token);
  }

  private generateToken(): string {
    // En una aplicación real, el token sería generado por el backend
    // Esto es solo una simulación
    return 'token_' + Math.random().toString(36).substr(2);
  }
}
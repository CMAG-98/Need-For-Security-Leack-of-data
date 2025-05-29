import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private theUser = new BehaviorSubject<User>(new User());

  constructor(private http: HttpClient) {
    this.verifyActualSession();
  }

  login(user: User): Observable<any> {
    return this.http.post<any>(`${environment.url_ms_security}`, user);
  }

  /**
   * Valida el token de Google directamente con la API pública de Google.
   * Retorna una Promise con el perfil validado o error si no es válido.
   */
  async validateGoogleToken(idToken: string): Promise<any> {
    const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Token inválido');
    }
    return await response.json();
  }

  saveSession(dataSesion: any) {
    const data: User = {
      id: dataSesion["user"]["id"],
      name: dataSesion["user"]["name"],
      email: dataSesion["user"]["email"],
      password: "",
      avatar: dataSesion["user"]["avatar"],
      token: dataSesion["token"]
    };
    localStorage.setItem('sesion', JSON.stringify(data));
    this.setUser(data);
  }

  setUser(user: User) {
    this.theUser.next(user);
  }

  getUser(): Observable<User> {
    return this.theUser.asObservable();
  }

  public get activeUserSession(): User {
    return this.theUser.value;
  }

  logout() {
    localStorage.removeItem('sesion');
    this.setUser(new User());
  }

  verifyActualSession() {
    const actualSesion = this.getSessionData();
    if (actualSesion) {
      this.setUser(JSON.parse(actualSesion));
    }
  }

  existSession(): boolean {
    return this.getSessionData() !== null;
  }

  getSessionData(): string | null {
    return localStorage.getItem('sesion');
  }
}

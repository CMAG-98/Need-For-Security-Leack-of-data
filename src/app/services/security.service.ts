import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LogInUser } from '../models/log-in-user.mode';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private theUser = new BehaviorSubject<LogInUser | null>(null);

  constructor(private http: HttpClient) {
    this.verifyActualSession();
  }

  login(user: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${environment.url_ms_security}`, user);
  }

  loginWithGoogleToken(token: string): Observable<any> {
    return this.http.post<any>(
      `${environment.url_ms_security}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  validateGoogleToken(idToken: string): Promise<any> {
    const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;
    return fetch(url).then(response => {
      if (!response.ok) {
        throw new Error('Token inválido');
      }
      return response.json();
    });
  }

  saveSession(dataSesion: any): void {
    const data: LogInUser = {
      id: dataSesion["user"]["id"],
      name: dataSesion["user"]["name"],
      email: dataSesion["user"]["email"],
      token: dataSesion["token"],
      avatar: dataSesion["user"]["avatar"] || dataSesion["user"]["picture"] || '' // 👈 fallback
    };
    localStorage.setItem('sesion', JSON.stringify(data));
    this.setUser(data);
  }

  setUser(user: LogInUser | null): void {
    this.theUser.next(user);
  }

  getUser(): Observable<LogInUser | null> {
    return this.theUser.asObservable();
  }

  get activeUserSession(): LogInUser | null {
    return this.theUser.value;
  }

  logout(): void {
    localStorage.removeItem('sesion');
    this.setUser(null);
  }

  verifyActualSession(): void {
    const actualSesion = this.getSessionData();
    if (actualSesion) {
      this.setUser(JSON.parse(actualSesion));
    }
  }

  existSession(): boolean {
    return !!this.getSessionData();
  }

  private getSessionData(): string | null {
    return localStorage.getItem('sesion');
  }
}

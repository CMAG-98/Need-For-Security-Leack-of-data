import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Session } from '../models/session';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  constructor(private http: HttpClient) {}

  // Genera un token "pequeño" concatenando el userId y el timestamp actual, codificando en Base64
  private generateToken(userId: number): string {
    const rawToken = `${userId}-${Date.now()}`;
    return btoa(rawToken).substring(0, 8); // Se toma solo los primeros 8 caracteres para mantenerlo corto
  }

generateExpiration(hours: number): string {
  const date = new Date(Date.now() + hours * 3600 * 1000);
  
  const pad = (num: number): string => (num < 10 ? '0' + num : num.toString());

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  const second = pad(date.getSeconds());
  
  // Asegurar que retorne exactamente este formato
  const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  console.log('Fecha generada:', formattedDate); // Para debug
  return formattedDate;
}


  list(): Observable<Session[]> {
    return this.http.get<Session[]>(`${environment.url_ms_security}/sessions`);
  }

  view(id: string): Observable<Session> {
    return this.http.get<Session>(`${environment.url_ms_security}/sessions/${id}`);
  }

  getByUserId(userId: number): Observable<Session[]> {
    return this.http.get<Session[]>(`${environment.url_ms_security}/sessions/user/${userId}`);
  }

  create(newSession: Session, userId: string): Observable<Session> {
    // Eliminamos el id si existe, para que el backend lo genere
    delete newSession.id;
    
    // Si no se ha definido el token, lo generamos automáticamente usando el id de usuario
    if (!newSession.token || newSession.token.trim() === '') {
      newSession.token = this.generateToken(Number(userId));
    }
    
    // Si no se ha definido una expiración, generamos una (por defecto 1 hora de vigencia)
    if (!newSession.expiration || newSession.expiration.trim() === '') {
      newSession.expiration = this.generateExpiration(8);
    }
    
    return this.http.post<Session>(`${environment.url_ms_security}/sessions/user/${userId}`, newSession);
  }

  update(session: Session): Observable<Session> {
    return this.http.put<Session>(`${environment.url_ms_security}/sessions/${session.id}`, session);
  }

  delete(id: string): Observable<Session> {
    return this.http.delete<Session>(`${environment.url_ms_security}/sessions/${id}`);
  }
}
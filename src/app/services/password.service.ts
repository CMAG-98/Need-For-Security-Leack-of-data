import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Password } from '../models/password.mode';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  constructor(private http: HttpClient) { }

  list(): Observable<Password[]> {
    return this.http.get<Password[]>(`${environment.url_ms_security}/passwords`);
  }

  view(id: number): Observable<Password> {
    return this.http.get<Password>(`${environment.url_ms_security}/passwords/${id}`);
  }

  getByUserId(userId: number): Observable<Password[]> {
    return this.http.get<Password[]>(`${environment.url_ms_security}/passwords/user/${userId}`);
  }

  create(password: any, userId: number): Observable<any> {
    const formattedData = {
      ...password,
      startAt: this.formatDateTime(password.startAt),
      endAt: password.endAt ? this.formatDateTime(password.endAt) : null
    };

    return this.http.post(`${environment.url_ms_security}/passwords/user/${userId}`, formattedData);
  }

  update(password: Password): Observable<Password> {

    const formattedData = {
      ...password,
      startAt: this.formatDateTime(password.startAt),
      endAt: password.endAt ? this.formatDateTime(password.endAt) : null
    };

    return this.http.put<Password>(`${environment.url_ms_security}/passwords/${password.id}`, formattedData);
  }

  delete(id: number): Observable<Password> {
    return this.http.delete<Password>(`${environment.url_ms_security}/passwords/${id}`);
  }

  private formatDateTime(dateString: string | Date): string {
    const date = new Date(dateString);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../models/role.mode';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  constructor(private http: HttpClient) {}

  list(): Observable<Role[]> {
    return this.http.get<Role[]>(`${environment.url_ms_security}/roles`);
  }

  view(id: number): Observable<Role> {
    return this.http.get<Role>(`${environment.url_ms_security}/roles/${id}`);
  }

  create(newRole: Role): Observable<Role> {
    delete newRole.id;  // Evita enviar `id` si no es necesario
    return this.http.post<Role>(`${environment.url_ms_security}/roles`, newRole);
  }

  update(role: Role): Observable<Role> {
    return this.http.put<Role>(`${environment.url_ms_security}/roles/${role.id}`, role);
  }

  delete(id: number): Observable<Role> {
    return this.http.delete<Role>(`${environment.url_ms_security}/roles/${id}`);
  }
}
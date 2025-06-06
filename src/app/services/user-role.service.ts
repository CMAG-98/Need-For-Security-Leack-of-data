import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRole } from '../models/user-role.mode';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {

  constructor(private http: HttpClient) { }

  list(): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(`${environment.url_ms_security}/user-roles`);
  }

  view(id: string): Observable<UserRole> {
    return this.http.get<UserRole>(`${environment.url_ms_security}/user-roles/${id}`);
  }

  create(userRole: any, userId: string, roleId: string): Observable<any> {
    const formattedData = {
      ...userRole,
      startAt: this.formatDateTime(userRole.startAt),
      endAt: userRole.endAt ? this.formatDateTime(userRole.endAt) : null
    };

    return this.http.post(`${environment.url_ms_security}/user-roles/user/${userId}/role/${roleId}`, formattedData);
  }

  getUserByRol(roleId: number): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(`${environment.url_ms_security}/user-roles/role/${roleId}`);
  }

  getRoleByUser(userId: number): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(`${environment.url_ms_security}/user-roles/user/${userId}`);
  }

  private formatDateTime(dateString: string | Date): string {
    const date = new Date(dateString);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }


  delete(id: string): Observable<UserRole> {
    return this.http.delete<UserRole>(`${environment.url_ms_security}/user-roles/${id}`);
  }
}

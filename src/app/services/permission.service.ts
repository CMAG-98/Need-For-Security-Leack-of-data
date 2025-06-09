import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Permission } from '../models/permission.model';

@Injectable({ 
  providedIn: 'root'
})
export class PermissionService {
  constructor(private http: HttpClient) { }

  list(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${environment.url_ms_security}/permissions`);
  }

  getById(id: number): Observable<Permission> {
    return this.http.get<Permission>(`${environment.url_ms_security}/permissions/${id}`);
  }

  create(permission: Permission): Observable<Permission> {
    return this.http.post<Permission>(`${environment.url_ms_security}/permissions`, permission);
  }

  update(id: number, permission: Permission): Observable<Permission> {
    return this.http.put<Permission>(`${environment.url_ms_security}/permissions/${id}`, permission);
  }

  delete(id: number): Observable<Permission> {
    return this.http.delete<Permission>(`${environment.url_ms_security}/permissions/${id}`);
  }

  getGroupedByRole(roleId: number): Observable<any> {
    return this.http.get<any>(`${environment.url_ms_security}/permissions/grouped/role/${roleId}`);
  }
}
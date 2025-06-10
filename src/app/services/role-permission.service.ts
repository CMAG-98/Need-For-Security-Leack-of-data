import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { RolePermission } from '../models/role-permission.model';

@Injectable({
  providedIn: 'root'
})
export class RolePermissionService {
  constructor(private http: HttpClient) { }

  list(): Observable<RolePermission[]> {
    return this.http.get<RolePermission[]>(`${environment.url_ms_security}/api/role-permissions`);
  }

  getById(id: string): Observable<RolePermission> {
    return this.http.get<RolePermission>(`${environment.url_ms_security}/api/role-permissions/${id}`);
  }

  create(roleId: number, permissionId: number, data: any = {}): Observable<RolePermission> {
    return this.http.post<RolePermission>(`${environment.url_ms_security}/api/role-permissions/role/${roleId}/permission/${permissionId}`, data);
  }

  delete(roleId: number, permissionId: number): Observable<RolePermission> {
    return this.http.delete<RolePermission>(`${environment.url_ms_security}/api/role-permissions/role/${roleId}/permission/${permissionId}`);
  }

}
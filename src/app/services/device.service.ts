import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Device } from '../models/device.model';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  constructor(private http: HttpClient) { }

  list(): Observable<Device[]> {
    return this.http.get<Device[]>(`${environment.url_ms_security}/devices`);
  }

  getById(id: number): Observable<Device> {
    return this.http.get<Device>(`${environment.url_ms_security}/devices/${id}`);
  }

  getByUserId(userId: number): Observable<Device[]> {
    return this.http.get<Device[]>(`${environment.url_ms_security}/devices/user/${userId}`);
  }

  create(data: Device, userId: string): Observable<Device> {
    delete data.id;  // Evita enviar el ID si es undefined
    console.log(data);

    return this.http.post<Device>(`${environment.url_ms_security}/devices/user/${userId}`, data);
  }

  update(data: Device): Observable<Device> {
    return this.http.put<Device>(`${environment.url_ms_security}/devices/${data.id}`, data);
  }

  delete(id: number): Observable<Device> {
    return this.http.delete<Device>(`${environment.url_ms_security}/devices/${id}`);
  }
}

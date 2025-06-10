import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Address } from '../models/address.mode';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  constructor(private http: HttpClient) { }

  list(): Observable<Address[]> {
    return this.http.get<Address[]>(`${environment.url_ms_security}/addresses`);
  }

  view(id: number): Observable<Address> {
    return this.http.get<Address>(`${environment.url_ms_security}/addresses/${id}`);
  }

  getByUserId(userId: number): Observable<Address> {
    return this.http.get<Address>(`${environment.url_ms_security}/addresses/user/${userId}`);
  }

  create(newAddress: Address, userId: string): Observable<Address> {
    delete newAddress.id;  // Evita enviar el ID si es undefined
    console.log(newAddress);

    return this.http.post<Address>(`${environment.url_ms_security}/addresses/user/${userId}`, newAddress);
  }

  update(address: Address): Observable<Address> {
    return this.http.put<Address>(`${environment.url_ms_security}/addresses/${address.id}`, address);
  }

  delete(id: number): Observable<Address> {
    return this.http.delete<Address>(`${environment.url_ms_security}/addresses/${id}`);
  }
}

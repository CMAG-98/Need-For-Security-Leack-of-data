import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Signature } from '../models/signature.model';

@Injectable({
  providedIn: 'root'
})
export class SignatureService {
  constructor(private http: HttpClient) { }

  list(): Observable<Signature[]> {
    return this.http.get<Signature[]>(`${environment.url_ms_security}/digital-signatures`);
  }

  getById(id: number): Observable<Signature> {
    return this.http.get<Signature>(`${environment.url_ms_security}/digital-signatures/${id}`);
  }

  getByUserId(userId: number): Observable<Signature> {
    return this.http.get<Signature>(`${environment.url_ms_security}/digital-signatures/user/${userId}`);
  }

  create(file: File, userId: string): Observable<Signature> {
    const formData = new FormData();
    formData.append('photo', file);

    return this.http.post<Signature>(`${environment.url_ms_security}/digital-signatures/user/${userId}`, formData);
  }

  update(file: File, id: string): Observable<Signature> {
    const formData = new FormData();
    formData.append('photo', file);

    return this.http.put<Signature>(`${environment.url_ms_security}/digital-signatures/${id}`, formData);
  }

  delete(id: number): Observable<Signature> {
    return this.http.delete<Signature>(`${environment.url_ms_security}/digital-signatures/${id}`);
  }
}

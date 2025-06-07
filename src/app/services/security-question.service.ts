import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { SecurityQuestion } from '../models/securityQuestion.model';

@Injectable({
  providedIn: 'root'
})
export class SecurityQuestionService {
  constructor(private http: HttpClient) { }

  list(): Observable<SecurityQuestion[]> {
    return this.http.get<SecurityQuestion[]>(`${environment.url_ms_security}/security-questions`);
  }

  getById(id: number): Observable<SecurityQuestion> {
    return this.http.get<SecurityQuestion>(`${environment.url_ms_security}/security-questions/${id}`);
  }

  create(data: SecurityQuestion): Observable<SecurityQuestion> {
    delete data.id;  // Evita enviar el ID si es undefined
    console.log(data);

    return this.http.post<SecurityQuestion>(`${environment.url_ms_security}/security-questions`, data);
  }

  update(data: SecurityQuestion): Observable<SecurityQuestion> {
    return this.http.put<SecurityQuestion>(`${environment.url_ms_security}/security-questions/${data.id}`, data);
  }

  delete(id: number): Observable<SecurityQuestion> {
    return this.http.delete<SecurityQuestion>(`${environment.url_ms_security}/security-questions/${id}`);
  }
}

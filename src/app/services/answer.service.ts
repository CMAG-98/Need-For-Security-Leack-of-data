import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Answer } from '../models/answer.model';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {
  constructor(private http: HttpClient) { }

  list(): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${environment.url_ms_security}/answers`);
  }

  getById(id: number): Observable<Answer> {
    return this.http.get<Answer>(`${environment.url_ms_security}/answers/${id}`);
  }

  getByUserId(userId: number): Observable<Answer> {
    return this.http.get<Answer>(`${environment.url_ms_security}/answers/user/${userId}`);
  }

  create(data: Answer, userId: string, questionId: string): Observable<Answer> {
    delete data.id;  // Evita enviar el ID si es undefined
    console.log(data);

    return this.http.post<Answer>(`${environment.url_ms_security}/answers/user/${userId}/question/${questionId}`, data);
  }

  update(data: Answer): Observable<Answer> {
    return this.http.put<Answer>(`${environment.url_ms_security}/answers/${data.id}`, data);
  }

  delete(id: number): Observable<Answer> {
    return this.http.delete<Answer>(`${environment.url_ms_security}/answers/${id}`);
  }
}

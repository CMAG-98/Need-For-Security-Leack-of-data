import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from '../models/profile';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private http: HttpClient) { }

  list(): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${environment.url_ms_security}/profiles`);
  }

  view(id: number): Observable<Profile> {
    return this.http.get<Profile>(`${environment.url_ms_security}/profiles/${id}`);
  }

  getByUserId(userId: number): Observable<Profile> {
    return this.http.get<Profile>(`${environment.url_ms_security}/profiles/user/${userId}`);
  }

  create(newProfile: Profile, userId: string): Observable<Profile> {
    delete newProfile.id;
    console.log(newProfile);
    return this.http.post<Profile>(`${environment.url_ms_security}/profiles/user/${userId}`, newProfile);
  }

  update(profile: Profile): Observable<Profile> {
    return this.http.put<Profile>(`${environment.url_ms_security}/profiles/${profile.id}`, profile);
  }

  delete(id: number): Observable<Profile> {
    return this.http.delete<Profile>(`${environment.url_ms_security}/profiles/${id}`);
  }
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private baseUrl = `https://localhost:7227`; // Set your base URL if required

  constructor(private http: HttpClient) {}

  getPendingInvitations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/invitations/pending`);
  }
  respondInvitation(invitationId: number, accept: boolean): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/invitations/respond`, {
      invitationId,
      accept,
    });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Story } from '../models/story.model';

@Injectable({
  providedIn: 'root'
})
export class SprintDetailsService {

  private apiUrl = 'http://localhost:7227/api'; 

  constructor(private http: HttpClient) {}


  // Fetch stories for a specific sprint, grouped by status
  getStoriesBySprint(sprintId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sprint/${sprintId}/details`);
  }

  // Update story status
  updateStoryStatus(storyId: number, newStatus: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/story/${storyId}/status`, { Status:newStatus });
  }
}

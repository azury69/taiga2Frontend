import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Story } from '../models/story.model';

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  private apiUrl = 'https://localhost:7227/api/story';
  private storySubject = new BehaviorSubject<Story[]>([]);
  story$ = this.storySubject.asObservable();

  constructor(private http: HttpClient) {}

  getStoriesByProject(projectId: number): Observable<Story[]> {
    return this.http.get<Story[]>(`${this.apiUrl}/project/${projectId}`).pipe(
      tap(stories => {
        this.storySubject.next(stories);
      }),
      
    );
  }

  createStory(story: Story): Observable<Story> {
    return this.http.post<Story>(`${this.apiUrl}`, story).pipe(
      tap((newStory) => {
        const currentStories = this.storySubject.value;
        this.storySubject.next([...currentStories, newStory]);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error creating story', error);
        return throwError(error);
      })
    );
  }

  deleteStory(storyId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${storyId}`).pipe(
      tap(() => {
        const updatedStories = this.storySubject.value.filter(s => s.id !== storyId);
        this.storySubject.next(updatedStories);
      })
    );
  }
}

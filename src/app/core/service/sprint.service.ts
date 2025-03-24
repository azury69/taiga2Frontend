import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Sprint } from '../models/sprint.model';
@Injectable({
  providedIn: 'root'
})
export class SprintService {

  private apiUrl = 'https://localhost:7227/api';
  private sprintSubject:BehaviorSubject<Sprint[]>=new BehaviorSubject<Sprint[]>([]);
  sprint$:Observable<Sprint[]>=this.sprintSubject.asObservable();

  constructor(private http:HttpClient) { }
  
  createSprint(sprint: Sprint): Observable<Sprint> {
    return this.http.post<Sprint>(`${this.apiUrl}/sprints`, sprint).pipe(
      tap((newSprint) => {
        const currentSprints = this.sprintSubject.value;
        this.sprintSubject.next([...currentSprints, newSprint]);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error creating sprint', error);
        return throwError(error);
      })
    );
  }
  getAllSprint():Observable<Sprint[]>{
    return this.http.get<Sprint[]>(`${this.apiUrl}/sprints`).pipe(
      tap((sprint)=>{
        this.sprintSubject.next(sprint)
      }
    ))
  }
  getSprintsByProject(projectId: number): Observable<Sprint[]> {
    return this.http.get<Sprint[]>(`${this.apiUrl}/sprintby/${projectId}`).pipe(
      tap((sprints) => {
        this.sprintSubject.next(sprints);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching sprints:', error);
        return throwError(error);
      })
    );
  }
  deleteSprint(sprintId:number){
    return this.http.delete(`${this.apiUrl}/sprint/${sprintId}`)
  }

}

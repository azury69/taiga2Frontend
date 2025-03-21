import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError,BehaviorSubject, tap } from 'rxjs';
import { Project } from '../models/project.model';
@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'https://localhost:7227/api'; // Base API URL
  private projectSubject: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);
  projects$: Observable<Project[]> = this.projectSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Create a new project
  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/projects`, project).pipe(
      tap((newProject) => {
        // Update local state with the newly created project
        const currentProjects = this.projectSubject.getValue();
        this.projectSubject.next([...currentProjects, newProject]);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error creating project', error);
        return throwError(error);
      })
    );
  }

  // Get all projects for the logged-in user
  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/getallprojects`).pipe(
      tap((projects) => {
        this.projectSubject.next(projects);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching projects', error);
        return throwError(error);
      })
    );
  }

  // Get a specific project by its ID
  getProjectById(projectId: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/project/${projectId}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching project by ID', error);
        return throwError(error);
      })
    );
  }

  // Delete a project
  deleteProject(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/project/${id}`).pipe(
      tap(() => {
        // Remove the deleted project from local state
        const updatedProjects = this.projectSubject.getValue().filter((project) => project.id !== id);
        this.projectSubject.next(updatedProjects);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error deleting project', error);
        return throwError(error);
      })
    );
  }
}

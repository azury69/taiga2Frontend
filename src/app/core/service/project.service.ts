import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError,BehaviorSubject, tap } from 'rxjs';
import { Project } from '../models/project.model';
import { NotificationService } from './notification.service';
import { User } from '../models/user.model';
@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'https://localhost:7227/api'; // Base API URL
  private projectSubject: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);
  projects$: Observable<Project[]> = this.projectSubject.asObservable();

  constructor(private http: HttpClient,private notificationservice:NotificationService) {}
  // private getAuthHeaders() {
  //   const token = localStorage.getItem('token');
  //   console.log('Token:', token);  // Log the token to see if it's there
  //   const headers = new HttpHeaders({
  //     Authorization: token ? `Bearer ${token}` : '',
  //   });
  //   console.log('Headers:', headers);  // Log the headers to see if the Authorization header is being set
  //   return headers;
  // }
  // Create a new project
  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/projects`, project).pipe(
      tap((newProject) => {
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

  // Get all users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/all-users`);
  }

  // Search users by email
  searchUsers(query: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/search-users?query=${query}`);
  }

  // Send an invitation to a user for a project
  sendInvitation(inviteData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/invitations/send`, inviteData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error sending invitation', error);
        return throwError(error);
      })
    );
  }

  // Get pending invitations for the logged-in user
  getPendingInvitations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/invitations/pending`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching pending invitations', error);
        return throwError(error);
      })
    );
  }

  // Accept an invitation
  acceptInvitation(invitationId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/invitations/accept/${invitationId}`, {}).pipe(
      tap(() => {
        this.getAllProjects().subscribe();
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error accepting invitation', error);
        return throwError(error);
      })
    );
  }

}

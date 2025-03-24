// navbar.component.ts
import { Component, OnInit, Output } from '@angular/core';
import { AuthService } from '../../core/service/auth.service';
import { Router } from '@angular/router';
import { ProjectService } from '../../core/service/project.service';
import { EventEmitter } from '@angular/core';
import { NotificationService } from '../../core/service/notification.service';
import { Project } from '../../core/models/project.model';
import { Invitation } from '../../core/models/invitation.model';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports:[NgIf,NgFor],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  workingOnProjects: Project[] = [];
  showDropdown = false;
  userRole = '';
  showNotificationDropdown = false;
  invitations: Invitation[] = [];
  @Output() createProjectClicked = new EventEmitter<void>();
  notification: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private projectService: ProjectService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });

    this.projectService.projects$.subscribe((projects) => {
      this.workingOnProjects = projects;
    });

    // Fetch pending invitations
    this.fetchPendingInvitations();
  }

  fetchPendingInvitations(): void {
    this.notificationService.getPendingInvitations().subscribe((invitations) => {
      this.invitations = invitations;
      this.notification = invitations.length
        ? `You have ${invitations.length} new invitation(s)`
        : 'No new invitations';
    });
  }

  navigateToProject(projectId: number): void {
    this.router.navigate(['/project', projectId]).then(() => {
      this.showDropdown = false;
    });
  }

  toggleNotificationDropdown(): void {
    this.showNotificationDropdown = !this.showNotificationDropdown;
  }

  closeNotificationDropdown(): void {
    this.showNotificationDropdown = false;
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  triggerCreateProject(): void {
    this.createProjectClicked.emit();
  }

  openCreateProjectForm(): void {
    this.router.navigate(['/create-project']);
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  openAcceptInvitationForm(invitation: Invitation): void {
    const invitationId = invitation.id; // Make sure this is properly set
    const accept = true; // or false depending on your use case
    
    this.notificationService.respondInvitation(invitationId, accept).subscribe(
      (response) => {
        console.log('Invitation accepted:', response);
        this.fetchPendingInvitations(); 
      },
      (error) => {
        console.error('Error accepting invitation:', error);
      }
    );
  }
  
}

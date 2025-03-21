import { Component, OnInit, Output } from '@angular/core';
import { AuthService } from '../../core/service/auth.service';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { Project } from '../../core/models/project.model';
import { ProjectService } from '../../core/service/project.service';
import { EventEmitter } from '@angular/core';
import { Invitation } from '../../core/models/invitation.model';

@Component({
  selector: 'app-navbar',
  imports: [NgIf, NgFor],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;  // Initialize as false
  workingOnProjects: Project[] = [];
  showDropdown = false;
  userRole = '';
  showNotificationDropdown = false;
  invitations: any[] = [];
  @Output() createProjectClicked = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
  
    this.projectService.projects$.subscribe((projects) => {
      this.workingOnProjects = projects;
    });
  }
  navigateToProject(projectId: number) {
    this.router.navigate(['/project', projectId]).then(() => {
      this.showDropdown = false; // Close dropdown after routing completes
    });
  }
  // Toggle notification dropdown visibility
  toggleNotificationDropdown() {
    this.showNotificationDropdown = !this.showNotificationDropdown;
  }

  closeNotificationDropdown() {
    this.showNotificationDropdown = false;
  }

  // Toggle project dropdown visibility
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  triggerCreateProject(): void {
    this.createProjectClicked.emit();
  }

  createProject() {
    this.router.navigate(['/create-project']);
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']); // Redirect after logout
    });
  }

  openCreateProjectForm() {
    this.router.navigate(['/create-project']);
  }
}

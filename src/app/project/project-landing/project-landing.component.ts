import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Project } from '../../core/models/project.model';
import { Router, RouterModule } from '@angular/router';
import { InviteUserComponent } from "../invite-user/invite-user.component";
import { ProjectService } from '../../core/service/project.service';
import { CreateProjectComponent } from "../create-project/create-project.component";
@Component({
  selector: 'app-project-landing',
  templateUrl: './project-landing.component.html',
  styleUrls: ['./project-landing.component.css'],
  imports: [FormsModule, NgIf, NgFor, RouterModule, CreateProjectComponent]
})

export class ProjectLandingComponent implements OnInit {
  createdProjects: Project[] = [];
  workingOnProjects: Project[] = [];
  showModal = false;
  selectedProjectId!: number;

  constructor(private projectService: ProjectService, private router: Router) {}

  ngOnInit(): void {

    // Get Created Projects
    this.projectService.getAllProjects().subscribe((projects) => {
      this.createdProjects = projects.filter(p => p.isCreator); 
      this.workingOnProjects = projects.filter(p => !p.isCreator);
    });

  }

  // Open invite modal
  openInviteModal(projectId: number): void {
    this.selectedProjectId = projectId;
    this.showModal = true;
  }

  // Close modal
  closeModal(): void {
    this.showModal = false;
  }

  deleteProject(id: any): void {
    this.projectService.deleteProject(id).subscribe({
      next: () => {
        this.createdProjects = this.createdProjects.filter((project) => project.id !== id);
      },
      error: (error) => {
        console.error('Error deleting project:', error);
      },
    });
  }

  // Open Create Project Modal
  openCreateProjectForm() {
    this.showModal = true;
  }

  // Close Modal
  closeCreateProjectForm() {
    this.showModal = false;
  }
  handleProjectCreated(newProject: Project) {
    this.createdProjects.push(newProject);  // Add the new project to the list
    this.showModal = false;  // Close the modal
  }
}


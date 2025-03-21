import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../shared/navbar/navbar.component";
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Project } from '../core/models/project.model';
import { Router, RouterModule } from '@angular/router';
import { InviteUserComponent } from "../invite-user/invite-user.component";
import { ProjectService } from '../core/service/project.service';
@Component({
  selector: 'app-project-landing',
  templateUrl: './project-landing.component.html',
  styleUrls: ['./project-landing.component.css'],
  imports: [NavbarComponent, FormsModule, NgIf, NgFor, RouterModule, InviteUserComponent]
})

export class ProjectLandingComponent implements OnInit {
  invitedProjects:Project[]=[]
  workingOnProjects:Project[] = []; // Array of projects user is working on
  watchingProjects:Project[] = []; // Array of projects user is watching
  
    showModal = false;
    selectedProjectId!: number;

  projectName:string= ''; // Store the name of the project
  projectDescription:string = ''; // Store the description of the project

  constructor(private projectService: ProjectService,private router:Router) {}
  ngOnInit(): void {
    this.projectService.projects$.subscribe((projects)=>{
      this.workingOnProjects=projects;
    });
    this.projectService.getAllProjects().subscribe();
  }

  // Open the modal and pass the selected projectId
  openInviteModal(projectId: number): void {
    this.selectedProjectId = projectId;
    this.showModal = true;  // Show the modal
  }

  // Close the modal
  closeModal(): void {
    this.showModal = false; // Hide the modal
  }


  deleteProject(id: any): void {
      this.projectService.deleteProject(id).subscribe({
        next: () => {
          this.workingOnProjects = this.workingOnProjects.filter((project) => project.id !== id);
        },
        error: (error) => {
          console.error('Error deleting project:', error);
        },
      });
    
  }
   // Method to navigate to the Create Project page
   openCreateProjectForm() {
    this.router.navigate(['/create-project']);  // Navigate to the Create Project page
  }

  
}


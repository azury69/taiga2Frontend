import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../core/service/project.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Project } from '../core/models/project.model';
@Component({
  selector: 'app-create-project',
  imports: [FormsModule,],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.css'
})
export class CreateProjectComponent {
  projectName: string = '';
  projectDescription: string = '';
  showCreateProjectForm: boolean = true;
  // currentRoute: string = '';

  constructor(private projectService: ProjectService, private router: Router) {}

  // ngOnInit(): void {
  //   this.currentRoute = this.router.url;  // Store the current route when the component initializes
  // }
  createProject() {
    if (this.projectName && this.projectDescription) {
      const newProject:Project = {
        id:null,
        name: this.projectName,
        description: this.projectDescription
      };

      this.projectService.createProject(newProject).subscribe({
        next: (response) => {
          console.log('Project created successfully:', response);
          this.showCreateProjectForm = false; 
          
            this.router.navigate(['landing']);  // Navigate back to the same route
         
        },
        error: (error) => {
          console.error('Error creating project:', error);
        }
      });
    }
    
  }

  closeCreateProjectForm() {
    this.showCreateProjectForm = false;
    this.router.navigate(['landing']);  

  }
}

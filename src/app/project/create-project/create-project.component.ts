// create-project.component.ts

import { Component, EventEmitter, Output } from '@angular/core';
import { ProjectService } from '../../core/service/project.service';
import { Project } from '../../core/models/project.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-project',
  imports:[ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent {
  projectName: string = '';
  projectDescription: string = '';
  
  @Output() closeForm = new EventEmitter<void>();
  @Output() projectCreated = new EventEmitter<Project>();

  constructor(private projectService: ProjectService) {}

  createProject() {
    if (this.projectName && this.projectDescription) {
      const newProject: Project = {
        id: null,
        name: this.projectName,
        description: this.projectDescription
      };

      this.projectService.createProject(newProject).subscribe({
        next: (response) => {
          console.log('Project created successfully:', response);
          this.projectCreated.emit(response);  // Emit the created project to the parent
          this.closeForm.emit();  // Emit close form event to hide the modal
        },
        error: (error) => {
          console.error('Error creating project:', error);
        }
      });
    }
  }

  close() {
    this.closeForm.emit();  // Emit close event when the form is manually closed
  }
}

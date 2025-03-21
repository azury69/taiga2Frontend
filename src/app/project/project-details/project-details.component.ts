import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../core/service/project.service';
import { Project } from '../../core/models/project.model';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Story } from '../../core/models/story.model';
import { StoryService } from '../../core/service/story.service';
import { SprintService } from '../../core/service/sprint.service';
import { Sprint } from '../../core/models/sprint.model';
import { __param } from 'tslib';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css'],
  imports: [NgIf, NavbarComponent, FormsModule, NgFor,DatePipe],
})
export class ProjectDetailsComponent implements OnInit {
// addStoryToSprint(_t31: Sprint) {
// throw new Error('Method not implemented.');
// }
// deleteSprint(arg0: number|undefined) {
// throw new Error('Method not implemented.');
// }
  projectId: number  =0;
  project: Project | null = null;
  stories: Story[] = [];
  sprints: Sprint[] = [];
  showStoryModel = false;
  showSprintModal = false;
  startDate: string = '';
  endDate: string = '';
  storyName: string = '';
  storyDescription: string = '';
  storyPoints: number | null = 0;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private storyService: StoryService,
    private sprintService: SprintService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.projectId = +params.get('id')!;  
    if (this.projectId) {  // Check if projectId is a valid number (not null or undefined)
      this.getProjectDetails(this.projectId);  // Fetch project details
      this.storyService.getStoriesByProject(this.projectId).subscribe((stories) => {
        this.stories = stories;});
      this.sprintService.getSprintsByProject(this.projectId).subscribe((sprints) => {
        this.sprints = sprints;  // Update the sprints array
      });
    } else {
      console.error('Project ID is invalid');
    }
  });
}

  createStory() {
    if (!this.storyName || !this.storyDescription || this.storyPoints === null || !this.projectId) {
      alert('Please fill all fields!');
      return;
    }

    const newStory: Story = {
      id: 0, // Backend will auto-generate
      name: this.storyName,
      description: this.storyDescription,
      points: this.storyPoints,
      projectId: this.projectId,
      sprintId: null,
      assignedToId: null,
    };

    this.storyService.createStory(newStory).subscribe({
      next: () => {
        // Clear form fields
        this.storyName = '';
        this.storyDescription = '';
        this.storyPoints = null;
        this.showStoryModel = false;
      },
      error: (err) => console.error(err),
    });
  }

  // Method to create a sprint
  createSprint(): void {
    if (this.startDate && this.endDate && this.projectId !== null) {  // Check if projectId is not null
      const newSprint: Sprint = {
        id: undefined,  // You can leave this as undefined or null for auto generation on the backend
        startDate: new Date(this.startDate),
        endDate: new Date(this.endDate),
        projectId: this.projectId,  // Ensure this is a valid number
      };
  
      this.sprintService.createSprint(newSprint).subscribe({
        next: (sprint) => {
          this.showSprintModal = false;
          this.sprintService.getSprintsByProject(this.projectId).subscribe();  // Refresh sprints list specific to project
        },
        error: (err) => console.error('Error creating sprint:', err),
      });
    } else {
      console.error('Project ID is invalid or missing');
    }
  }

  // Method to get project details
  getProjectDetails(projectId: number): void {
    this.projectService.getProjectById(projectId).subscribe({
      next: (project) => {
        this.project = project;
      },
      error: (error) => {
        console.error('Error fetching project details:', error);
      },
    });
  }
}

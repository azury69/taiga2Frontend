import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectService } from '../../core/service/project.service';
import { Project } from '../../core/models/project.model';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Story } from '../../core/models/story.model';
import { StoryService } from '../../core/service/story.service';
import { SprintService } from '../../core/service/sprint.service';
import { Sprint } from '../../core/models/sprint.model';
import { __param } from 'tslib';
import { InviteUserComponent } from '../invite-user/invite-user.component';


@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css'],
  imports: [NgIf,  FormsModule, NgFor, DatePipe, InviteUserComponent,RouterLink],
})
export class ProjectDetailsComponent implements OnInit {

editSprint(_t35: Sprint) {
throw new Error('Method not implemented.');
}
editStory(_t18: Story) {
throw new Error('Method not implemented.');
}
selectedStoryId: number | null = null;  // Store selected story ID

  projectId: number = 0;
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
  storyStatus:number=0;
  isLoading: boolean = false;  // Add loading state
  errorMessage: string = '';
  showStoryDropdown: number | null = null;

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
    if (this.projectId) {  
      this.getProjectDetails(this.projectId);  
      this.loadSprints();  
        this.loadStories();  
      
    } else {
      console.error('Project ID is invalid');
    }
  });
}
toggleStoryDropdown(sprintIndex: number): void {
  this.showStoryDropdown = this.showStoryDropdown === sprintIndex ? null : sprintIndex;
}

assignStoryToSprint(event: Event, sprintId: number): void {
  if (this.selectedStoryId !== null) {
    this.storyService.addStoryToSprint(this.selectedStoryId, sprintId).subscribe({
      next: () => {
        this.loadSprints(); 
        this.loadStories();  
        this.showStoryDropdown = null;
      },
      error: (err) => {
        console.error('Error assigning story to sprint', err);
      }
    });
  } else {
    console.error('No story selected!');
  }
}
 // Fetch project details
 getProjectDetails(projectId: number): void {
  this.projectService.getProjectById(projectId).subscribe({
    next: (project) => {
      this.project = project;
    },
    error: (error) => {
      this.errorMessage = 'Failed to load project details';
      console.error(error);
    }
  });
}


loadSprints(): void {
  this.isLoading = true; 
  this.sprintService.getSprintsByProject(this.projectId).subscribe({
    next: (sprints) => {
      this.sprints = sprints;
      this.isLoading = false; 
    },
    error: (error) => {
      this.errorMessage = 'Failed to load sprints';
      this.isLoading = false;  
      console.error(error);
    }
  });
}

// Fetch stories for the project
loadStories(): void {
  this.isLoading = true;  // Start loading
  this.storyService.getStoriesByProject(this.projectId).subscribe({
    next: (stories) => {
      this.stories = stories;
      this.isLoading = false;  // Stop loading
    },
    error: (error) => {
      this.errorMessage = 'Failed to load stories';
      this.isLoading = false;
      console.error(error);
    }
  });
}

addStoryToSprint(storyId: number, sprintId: number): void {
  this.storyService.addStoryToSprint(storyId, sprintId).subscribe(() => {
    console.log('Story added to sprint!');
    this.loadStories(); 
  }, (error) => {
    console.error('Error adding story to sprint', error);
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
      storyStatus:this.storyStatus
    };
    this.storyService.createStory(newStory).subscribe({
      next: () => {
        this.loadStories(); 
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
        id: 0,  // You can leave this as undefined or null for auto generation on the backend
        startDate: new Date(this.startDate),
        endDate: new Date(this.endDate),
        projectId: this.projectId,  // Ensure this is a valid number
      };
  
      this.sprintService.createSprint(newSprint).subscribe({
        next: (sprint) => {
          this.showSprintModal = false;
          this.loadSprints();
        },
        error: (err) => console.error('Error creating sprint:', err),
      });
    } else {
      console.error('Project ID is invalid or missing');
    }
  }

  deleteSprint(sprintId: number): void {
    this.sprintService.deleteSprint(sprintId).subscribe({
      next: () => {
        this.sprints = this.sprints.filter((sprint) => sprint.id !== sprintId);
      },
      error: (error) => {
        this.errorMessage = 'Failed to delete sprint';
        console.error(error);
      }
    });
  }

  // Delete a story
  deleteStory(storyId: number): void {
    this.storyService.deleteStory(storyId).subscribe({
      next: () => {
        this.stories = this.stories.filter((story) => story.id !== storyId);
      },
      error: (error) => {
        this.errorMessage = 'Failed to delete story';
        console.error(error);
      }
    });
  }
  
}

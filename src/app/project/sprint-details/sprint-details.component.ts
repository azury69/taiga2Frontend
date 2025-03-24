import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SprintDetailsService } from '../../core/service/sprint-details.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { SprintService } from '../../core/service/sprint.service';
import { Story } from '../../core/models/story.model';

@Component({
  selector: 'app-sprint-details',
  standalone: true,
  imports: [CommonModule, FormsModule, CdkDropList, CdkDrag],
  templateUrl: './sprint-details.component.html',
  styleUrl: './sprint-details.component.css'
})
export class SprintDetailsComponent implements OnInit {
  todo = new BehaviorSubject<Story[]>([]);
  inProgress = new BehaviorSubject<Story[]>([]);
  codeReview = new BehaviorSubject<Story[]>([]);
  qa = new BehaviorSubject<Story[]>([]);
  done = new BehaviorSubject<Story[]>([]);
  sprintId: number=0;
  projectId: number = 0;

  constructor(private sprintService: SprintDetailsService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.sprintId = +params.get('sprintId')!;
      this.projectId = +params.get('projectId')!;
    });
    if (this.sprintId) {
      this.loadStories();
    }
  
  }

  loadStories(): void {
    this.sprintService.getStoriesBySprint(this.sprintId).subscribe((response: any) => {
      const grouped = response['storiesGroupedByStatus'];
  
      this.todo.next(grouped?.ToDo || []);
      this.inProgress.next(grouped?.InProgress || []);
      this.codeReview.next(grouped?.CodeReview || []);
      this.qa.next(grouped?.QA || []);
      this.done.next(grouped?.Done || []);
    });
  }

  drop(event: CdkDragDrop<Story[]>): void {
    if (event.previousContainer !== event.container) {
      const story: Story = event.item.data;
      console.log('Dropped story:', story); // Debugging line
  
      if (!story.id) {
        console.error('Story ID is undefined!');
        return;
      }
  
      const storyId = story.id;
      const containerId = event.container.id;
  
      // Mapping container ids to enum
      const statusMap: { [key: string]: number } = {
        'todoList': 0,         // ToDo
        'inProgressList': 1,   // InProgress
        'inReviewList': 2,     // CodeReview
        'completedList': 3,    // QA
        'archivedList': 4      // Done
      };
  
      const newStatus = statusMap[containerId];
  
      if (newStatus !== undefined) {
        this.sprintService.updateStoryStatus(storyId, newStatus).subscribe(() => {
          this.loadStories(); // Reload after update
        });
      }
    }
  }
}

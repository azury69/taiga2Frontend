import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../core/models/user.model';
import { NotificationService } from '../../core/service/notification.service';
import { ProjectService } from '../../core/service/project.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-invite-user',
  imports:[FormsModule, NgIf, NgFor],
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.css']
})
export class InviteUserComponent implements OnInit {
  @Input() projectId!: number; // The selected project ID from parent component
  email: string = ''; // Email input for the invite
  users: User[] = []; // List of users found during search
  searchQuery: string = ''; // For searching users by email
  isLoading: boolean = false; // Loading state for search results
  selectedRole: string = ''; // Selected role in the dropdown
  roleOptions = ['ProductOwner', 'ProjectManager', 'SoftwareEngineer', 'QA', 'Viewer']; // List of roles

  constructor(private projectService: ProjectService, private notificationService: NotificationService) {}

  ngOnInit(): void {}

  // Search for users by email
  searchUsers(): void {
    if (this.searchQuery.trim()) {
      this.isLoading = true;
      this.projectService.searchUsers(this.searchQuery).subscribe(
        (users) => {
          this.users = users;
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
        }
      );
    } else {
      this.users = [];
    }
  }

  // Send the invitation to the selected user
  sendInvitation(userEmail: string, selectedRole: string): void {
    // Convert selected role to the corresponding integer value (assuming RoleType enum is integer-based)
    const roleMapping: { [key: string]: number } = {
      'ProductOwner': 0,
      'ProjectManager': 1,
      'SoftwareEngineer': 2,
      'QA': 3,
      'Viewer': 4
    };

    const selectedRoleValue = roleMapping[selectedRole];

    const inviteData = {
      projectId: this.projectId,
      invitedUserEmail: userEmail,  // send the email instead of userId
      role: selectedRoleValue  // send the mapped role
    };

    // Call the backend service to send the invitation
    this.projectService.sendInvitation(inviteData).subscribe(
      () => {
        this.email = ''; // Clear the input field
        this.users = []; // Clear the search results
      }
    );
  }
}

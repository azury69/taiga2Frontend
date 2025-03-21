import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { InvitaionService } from '../service/invitaion.service';
import { Invitation } from '../core/models/invitation.model';
import {  NgFor } from '@angular/common';
@Component({
  selector: 'app-invite-user',
  imports: [ReactiveFormsModule,NgFor],
  templateUrl: './invite-user.component.html',
  styleUrl: './invite-user.component.css'
})
export class InviteUserComponent implements OnInit {
  @Input() projectId!: number; // Receive project ID dynamically
  inviteForm: FormGroup;
  users: any[]=[];

  constructor(
    private fb: FormBuilder,
    // private invitationService: InvitaionService
  ) 
    
  {
    this.inviteForm = this.fb.group({
      invitedUserEmail: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }
  ngOnInit(): void {
      // this.getUsers();    
  }

  // getUsers(){
  //   this.invitationService.getAllUsers().subscribe(
  //     (response: any[]) => {
  //       console.log(response);
  //       this.users = response;  // Store the users in the users array
  //     },
  //     (      error: any) => {
  //       console.error('Error fetching users', error);
  //     }
  //   );
  // }
  onSubmit() {
    if (this.inviteForm.valid) {
      const invitation: Invitation = {
        projectId: this.projectId,
        invitedUserEmail: this.inviteForm.value.invitedUserEmail,
        role: this.inviteForm.value.role // Now a string
      };
      console.log(invitation);
      // this.invitationService.sendInvitation(invitation).subscribe({
        // next: (res: any) => {
          // alert('✅ Invitation sent successfully!');
        // },
        error: (err: { status: number; }) => {
          console.error("Error sending invitation:", err);
      
          let errorMessage = "An unexpected error occurred. Please try again later.";
      
          if (err.status === 400) {
            errorMessage = "Invalid request. Please check the invitation details.";
          } else if (err.status === 404) {
            errorMessage = "User not found. Please verify the email address.";
          } else if (err.status === 500) {
            errorMessage = "Server error. Please contact support.";
          }
      
          alert(errorMessage);
        }
    }
  }
}

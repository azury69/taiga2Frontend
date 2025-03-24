// invitation.model.ts
export interface Invitation {
  id: number;  // Add this field to match the backend
    projectId: number;
    invitedUserEmail: string;
    role: string; 
  }
  
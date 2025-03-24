export interface Story {
        id: number;
        name: string;
        description: string;
        projectId: number;     // Important: always include projectId so backend knows which project
        sprintId?: number | null; // Nullable because initially might be unassigned
        points?: number | null;   // Nullable, optional
        assignedToId?: string | null; 
        storyStatus: number;// Future use, optional (you can omit if not used yet)
      }


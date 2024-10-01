// export class Task {
//     taskId: number;
//     title: string;
//     description: string;
//     dueDate: string;
//     priority: string;  
//     status: string;
//     userId: number;
//     collaborators?: Collaborator[];

import { User } from "./user";

//     constructor(
//         taskId: number,
//         title: string,
//         description: string,
//         dueDate: string,
//         priority: string,
//         status: string,
//         userId: number
//       ) {
//         this.taskId = taskId;
//         this.title = title;
//         this.description = description;
//         this.dueDate = dueDate;
//         this.priority = priority;
//         this.status = status;
//         this.userId = userId;
//         this.collaborators = [];
//       }
//   }

// export interface Collaborator {
//   userId: number;
//   username: string;
//     email: string;
 
// }

// export class Task {
//   taskId: number;
//   title: string;
//   description: string;
//   dueDate: string;
//   priority: string;
//   status: string;
//   userId: number;
//   collaborators?: Collaborator[];

//   constructor(
//     taskId: number = 0,
//     title: string = '',
//     description: string = '',
//     dueDate: string = '',
//     priority: string = 'Medium',
//     status: string = 'Pending',
//     userId: number = 0,
//     collaborators?: Collaborator[]
//   ) {
//     this.taskId = taskId;
//     this.title = title;
//     this.description = description;
//     this.dueDate = dueDate;
//     this.priority = priority;
//     this.status = status;
//     this.userId = userId;
//     this.collaborators = collaborators || [];
//   }
// }


export enum Priority {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High'
}

export enum Status {
    PENDING = 'Pending',
        IN_PROGRESS = 'IN_PROGRESS',
        COMPLETED='Completed'
}
export interface Collaborator {
  [x: string]: any;
  userId: number;
  username: string;
  email: string;
  completed: boolean;
}

export class Task {
  taskId: number;
  title: string;
  description: string;
  dueDate: string; 
  priority: string;
  status: string;
  userId: number;
  isCollaborative: boolean; 
  collaboratorIds: number[]; 
  collaborators?: Collaborator[];
  collaboratorUsernames?: string[];
  color?: string;
  user?: User;

  constructor(
    taskId: number = 0,
    title: string = '',
    description: string = '',
    dueDate: string = '',
    priority: string = '',
    status: string = '',
    userId: number = 0,
    isCollaborative: boolean = false,
    collaboratorIds: number[] = [],
    color: string = '#AEEEEE' // Default color for personal tasks

  ) {
    this.taskId = taskId;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.status = status;
    this.userId = userId;
    this.isCollaborative = isCollaborative;
    this.collaboratorIds = collaboratorIds;
    this.color = color; // Initialize color
  }
}

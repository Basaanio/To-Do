// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { TaskService } from 'src/app/services/taskService';
// import { AuthService } from 'src/app/services/auth-service/auth.service';
// import { Task } from 'src/app/models/task';
// import { Observable, of } from 'rxjs';

// @Component({
//   selector: 'app-list-task',
//   templateUrl: './list-task.component.html',
//   styleUrls: ['./list-task.component.css']
// })
// export class ListTaskComponent implements OnInit {
//   userId: number;
//   tasks: Task[] = [];
//   viewType: string = ''; // To keep track of the current view
//   filteredTasks: Task[] = []; // Tasks displayed based on filters
//   showFilterOptions = false;

//   selectedStatus: Set<string> = new Set();
//   selectedPriority: Set<string> = new Set();

//   constructor(
//     private taskService: TaskService,
//     private authService: AuthService,
//     private route: ActivatedRoute
//   ) {
//     this.userId = this.authService.userProfile.userLoginDTO.userId;
//   }

//   ngOnInit(): void {
//     // Get viewType from route parameters
//     this.route.params.subscribe(params => {
//       this.viewType = params['viewType'];
//       this.loadTasks();
//     });
//   }

//   loadTasks(): void {
//     let tasksObservable: Observable<Task[]>; // Declare the observable variable

//     switch (this.viewType) {
//       case 'due-today':
//         tasksObservable = this.taskService.getTasksDueToday(this.userId);
//         break;
//       case 'due-this-week':
//         tasksObservable = this.taskService.getTasksDueThisWeek(this.userId);
//         break;
//       case 'past-due':
//         tasksObservable = this.taskService.getPastDueTasks(this.userId);
//         break;
//       default:
//         tasksObservable = of([]); // Default to an empty observable if no viewType matches
//         break;
//     }

//     tasksObservable.subscribe(tasks => {
//       this.tasks = tasks;
//       this.filteredTasks = this.filterTasks(); // Filter tasks after fetching
//       this.sortTasksByDate(); // Sort tasks after filtering
//     });
//   }

//   filterTasks(): Task[] {
//     return this.tasks.filter(task => {
//       const statusMatch = this.selectedStatus.size === 0 || this.selectedStatus.has(task.status);
//       const priorityMatch = this.selectedPriority.size === 0 || this.selectedPriority.has(task.priority);
//       return statusMatch && priorityMatch;
//     });
//   }

//   sortTasksByDate(): void {
//     this.filteredTasks.sort((a, b) => {
//       return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
//     });
//   }

//   toggleFilterOptions(): void {
//     this.showFilterOptions = !this.showFilterOptions;
//   }

//   togglePriority(priority: string): void {
//     if (this.selectedPriority.has(priority)) {
//       this.selectedPriority.delete(priority);
//     } else {
//       this.selectedPriority.add(priority);
//     }
//     this.filteredTasks = this.filterTasks(); // Update filtered tasks with new filters
//     this.sortTasksByDate(); // Sort after filtering
//   }

//   toggleStatus(status: string): void {
//     if (this.selectedStatus.has(status)) {
//       this.selectedStatus.delete(status);
//     } else {
//       this.selectedStatus.add(status);
//     }
//     this.filteredTasks = this.filterTasks(); // Update filtered tasks with new filters
//     this.sortTasksByDate(); // Sort after filtering
//   }
// }

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from 'src/app/services/taskService';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { Task } from 'src/app/models/task';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-list-task',
  templateUrl: './list-task.component.html',
  styleUrls: ['./list-task.component.css']
})
export class ListTaskComponent implements OnInit {
  userId: number;
  tasks: Task[] = [];
  viewType: string = ''; // To keep track of the current view
  filteredTasks: Task[] = []; // Tasks displayed based on filters
  showFilterOptions: boolean = false; // Explicitly initializing to ensure it's always a boolean

  selectedStatus: Set<string> = new Set();
  selectedPriority: Set<string> = new Set();

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.userId = this.authService.userProfile.userLoginDTO.userId;
  }

  ngOnInit(): void {
    // Get viewType from route parameters
    this.route.params.subscribe(params => {
      this.viewType = params['viewType'];
      this.loadTasks();
    });
  }

  loadTasks(): void {
    let tasksObservable: Observable<Task[]>; // Declare the observable variable

    switch (this.viewType) {
      case 'due-today':
        tasksObservable = this.taskService.getTasksDueToday(this.userId);
        break;
      case 'due-this-week':
        tasksObservable = this.taskService.getTasksDueThisWeek(this.userId);
        break;
      case 'past-due':
        tasksObservable = this.taskService.getPastDueTasks(this.userId);
        break;
      default:
        tasksObservable = of([]); // Default to an empty observable if no viewType matches
        break;
    }

    tasksObservable.subscribe(tasks => {
      this.tasks = tasks;
      this.filteredTasks = this.filterTasks(); // Filter tasks after fetching
      this.sortTasksByDate(); // Sort tasks after filtering
    });
  }

  filterTasks(): Task[] {
    return this.tasks.filter(task => {
      const statusMatch = this.selectedStatus.size === 0 || this.selectedStatus.has(task.status);
      const priorityMatch = this.selectedPriority.size === 0 || this.selectedPriority.has(task.priority);
      return statusMatch && priorityMatch;
    });
  }

  sortTasksByDate(): void {
    this.filteredTasks.sort((a, b) => {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }

  toggleFilterOptions(): void {
    this.showFilterOptions = !this.showFilterOptions;
  }

  togglePriority(priority: string): void {
    if (this.selectedPriority.has(priority)) {
      this.selectedPriority.delete(priority);
    } else {
      this.selectedPriority.add(priority);
    }
    this.filteredTasks = this.filterTasks(); // Update filtered tasks with new filters
    this.sortTasksByDate(); // Sort after filtering
  }

  toggleStatus(status: string): void {
    if (this.selectedStatus.has(status)) {
      this.selectedStatus.delete(status);
    } else {
      this.selectedStatus.add(status);
    }
    this.filteredTasks = this.filterTasks(); // Update filtered tasks with new filters
    this.sortTasksByDate(); // Sort after filtering
  }
}

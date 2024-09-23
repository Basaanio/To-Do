// import { Component, OnInit } from '@angular/core';
// import { Task } from '../../models/task';
// import { DashboardService } from '../../services/dashboardService';
// import { AuthService } from '../../services/auth-service/auth.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-dashboard',
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.css']
// })
// export class DashboardComponent implements OnInit {
//     tasks: Task[] = [];
//     filteredTasks: { [date: string]: Task[] } = {}; // Explicitly typing the object
//     dates: string[] = [];
//     paginatedDates: string[] = [];
//     currentPage: number = 1;
//     tasksPerPage: number = 4; // Adjust as needed
//     totalPages: number = 1;
//     currentMonth: string = ''; // Property to store the current month
//     currentDate: string = '';
//     greetingMessage: string = '';
//     username: string = '';
//     isTaskFormVisible = false; // Manage task form visibility
//     selectedDate: Date| null = null; // Store selected date for task creation
    
  
//     constructor(
//       private dashboardService: DashboardService,
//       public authService: AuthService,
//       private router: Router
//     ) {}
  
//     ngOnInit() {
//       this.loadTasks();
//       this.setUserDetailsAndGreeting();
//       this.processTasks();

      
//     }
  
//     loadTasks() {
//       this.dashboardService.getUserTasks(this.authService.userProfile.userLoginDTO.userId).subscribe(tasks => {
//         this.tasks = tasks;
//         this.processTasks();
         
//       }, error => {
//         console.error('Error loading tasks:', error);
//       });
//     }
  
//     processTasks() {
//       // Sort tasks by due date
//       this.tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
//       // Filter and organize tasks by date
//       this.filteredTasks = this.tasks.reduce((acc: { [date: string]: Task[] }, task: Task) => {
//         const date = new Date(task.dueDate).toDateString();
//         if (!acc[date]) {
//           acc[date] = [];
//           this.dates.push(date);
//         }
//         acc[date].push(task);
//         return acc;
//       }, {});
  
//       // Handle pagination
//       this.totalPages = Math.ceil(this.dates.length / this.tasksPerPage);
//       this.updatePaginatedDates();
//       this.updateMonth(); 
//     }
  
//     updatePaginatedDates() {
//       const start = (this.currentPage - 1) * this.tasksPerPage;
//       const end = start + this.tasksPerPage;
//       this.paginatedDates = this.dates.slice(start, end);
//       this.updateMonth(); 
//     }
  
//     previousPage() {
//       if (this.currentPage > 1) {
//         this.currentPage--;
//         this.updatePaginatedDates();
//       }
//     }
  
//     nextPage() {
//       if (this.currentPage < this.totalPages) {
//         this.currentPage++;
//         this.updatePaginatedDates();
//       }
//     }
  
//     getDayOfWeek(date: string): string {
//       return new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
//     }
  
//     getFormattedDate(date: string): string {
//       return new Date(date).toLocaleDateString('en-US', { day: '2-digit' });
//     }
  
//     updateMonth() {
//       if (this.paginatedDates.length > 0) {
//         const firstDate = new Date(this.paginatedDates[0]);
//         const lastDate = new Date(this.paginatedDates[this.paginatedDates.length - 1]);
  
//         if (firstDate.getMonth() === lastDate.getMonth()) {
//           // If all dates are within the same month
//           this.currentMonth = firstDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
//         } else {
//           // If dates span multiple months
//           const firstMonth = firstDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
//           const lastMonth = lastDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
//           this.currentMonth = `${firstMonth} - ${lastMonth}`;
//         }
//       }
//     }
  
//     getFormattedTime(date: string): string {
//       const taskDate = new Date(date);
//       return taskDate.toLocaleTimeString('en-US', {
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true 
//       });
//     }
  
//     setUserDetailsAndGreeting() {
//       this.username = this.authService.userProfile.userLoginDTO.username; 
  
//       // Get the current date
//       const today = new Date();
//       this.currentDate = today.toLocaleDateString('en-US', {
//         weekday: 'long',
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       });
  
//       // Determine greeting message based on the time of day
//       const currentHour = today.getHours();
//       if (currentHour < 12) {
//         this.greetingMessage = 'Good morning';
//       } else if (currentHour < 18) {
//         this.greetingMessage = 'Good afternoon';
//       } else {
//         this.greetingMessage = 'Good evening';
//       }
//     }
  
//     openTaskForm(date: Date) {
//       this.selectedDate = date; 
//       this.isTaskFormVisible = true; 
//     }
  
//     closeTaskForm() {
//       this.isTaskFormVisible = false; 
//       this.loadTasks(); 
//     }

//     onTaskAdded() {
//       this.loadTasks(); 
//     }
//   }

import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Task } from '../../models/task';
import { DashboardService } from '../../services/dashboardService';
import { AuthService } from '../../services/auth-service/auth.service';
import { Router } from '@angular/router';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskService } from 'src/app/services/taskService';
import { SearchService } from 'src/app/services/searchService';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  tasks: Task[] = [];
  filtereTasks: { [date: string]: Task[] } = {};
  dates: string[] = [];
  paginatedDates: string[] = [];
  currentPage: number = 1;
  tasksPerPage: number = 5; // Adjust as needed
  totalPages: number = 1;
  currentMonth: string = '';
  currentDate: string = '';
  greetingMessage: string = '';
  username: string = '';
  isTaskFormVisible = false; // Manage task form visibility
  selectedDate: Date | null = null; // Store selected date for task creation

  selectedTask?: Task;
  isModalOpen = false;
  
  filteredTasks: Task[] = []; // Tasks to be displayed
  searchedTask: string = ''; // The current search term

  
  @Output() taskCreated = new EventEmitter<void>();
  @ViewChild(TaskFormComponent) taskFormComponent!: TaskFormComponent; // Reference to the TaskFormComponent

  
  constructor(
    private dashboardService: DashboardService,
    public authService: AuthService,
    private router: Router,
    private taskService: TaskService,
    private searchService:SearchService
  ) {}

  ngOnInit() {
    this.dashboardService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
      this.processTasks();
    });
    
    this.loadTasks(); // Initial load
    this.setUserDetailsAndGreeting();
    
    console.log("Hello")
    this.searchService.currentTaskTerm.subscribe(searchTerm => {
      this.searchedTask = searchTerm
      this.filterTasksByName()
    })
    // Subscribe to task creation event
    this.taskFormComponent.taskCreated.subscribe((newTask: Task) => {
      this.tasks.push(newTask); // Add the new task to the list
      this.processTasks(); // Reprocess tasks to update the view
    });
    this.loadTasks(); // Load all tasks initially
    
    
  }



  openEditModal(task: Task) {
    this.selectedTask = task; // Set the selected task to edit
    this.isModalOpen = true; // Open the modal
  }

  closeModal(updatedTask?: Task) {
    this.isModalOpen = false; // Close the modal
    if (updatedTask) {
      // Refresh the tasks if updatedTask is provided
      this.loadTasks(); // Ensure you have a method to refresh tasks
    }
  }
  
  // ngOnInit() {
  //   this.loadTasks();
  //   this.setUserDetailsAndGreeting();
  //   this.dashboardService.taskCreated$.subscribe(() => {
  //     this.loadTasks();
  //   });

  // ngOnInit() {
  //   this.dashboardService.tasks$.subscribe(tasks => {
  //     this.tasks = tasks;
  //     this.processTasks();

  //   });
  //   this.loadTasks(); // Initial load
  // this.setUserDetailsAndGreeting();
  // }

  loadTasks() {
    this.dashboardService.getUserTasks(this.authService.userProfile.userLoginDTO.userId).subscribe(tasks => {
      this.tasks = tasks;
      console.log('Loaded tasks:', this.tasks); 
      this.processTasks();
    }, error => {
      console.error('Error loading tasks:', error);
    });

    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks; // Store all tasks
      this.filteredTasks = tasks; // Initially show all tasks
    });
  }

  onTaskAdded() {
    this.loadTasks(); // Refresh the task list when a new task is created
  }

  // processTasks() {
  //   // Sort tasks by due date
  //   this.dates = [];

  //   this.tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  //   // Filter and organize tasks by date
  //   this.filteredTasks = this.tasks.reduce((acc: { [date: string]: Task[] }, task: Task) => {
  //     const date = new Date(task.dueDate).toDateString();
  //     if (!acc[date]) {
  //       acc[date] = [];
  //       this.dates.push(date);
  //     }
  //     acc[date].push(task);
  //     return acc;
  //   }, {});



  processTasks() {
    // Sort tasks by due date
    this.dates = [];
  
    this.tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
    // Map to store collaborator colors
    const collaboratorColors = new Map<number, string>();
    const collaboratorsSet = new Set<number>();
  
    // Collect unique collaborator IDs
    this.tasks.forEach(task => {
      task.collaboratorIds?.forEach(collabId => {
        collaboratorsSet.add(collabId);
      });
    });
  
    
    // Filter and organize tasks by date and assign colors
    this.filtereTasks = this.tasks.reduce((acc: { [date: string]: Task[] }, task: Task) => {
      const date = new Date(task.dueDate).toDateString();
      if (!acc[date]) {
        acc[date] = [];
        this.dates.push(date);
      }
      
      // Assign color based on collaborator
      task.color = task.isCollaborative && task.collaboratorIds.length > 0
        ? collaboratorColors.get(task.collaboratorIds[0]) || '#D3D3D3' // Default color
        : '#AEEEEE'; // Default for personal tasks
        
      acc[date].push(task);
      return acc;
    }, {});
  
 
  
  

    // Handle pagination
    this.totalPages = Math.ceil(this.dates.length / this.tasksPerPage);
    this.updatePaginatedDates();
    this.updateMonth();
  }

  updatePaginatedDates() {
    const start = (this.currentPage - 1) * this.tasksPerPage;
    const end = start + this.tasksPerPage;
    this.paginatedDates = this.dates.slice(start, end);
    this.updateMonth();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedDates();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedDates();
    }
  }

  getDayOfWeek(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
  }

  getFormattedDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { day: '2-digit' });
  }

  updateMonth() {
    if (this.paginatedDates.length > 0) {
      const firstDate = new Date(this.paginatedDates[0]);
      const lastDate = new Date(this.paginatedDates[this.paginatedDates.length - 1]);

      if (firstDate.getMonth() === lastDate.getMonth()) {
        this.currentMonth = firstDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      } else {
        const firstMonth = firstDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        const lastMonth = lastDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        this.currentMonth = `${firstMonth} - ${lastMonth}`;
      }
    }
  }

  getFormattedTime(date: string): string {
    const taskDate = new Date(date);
    return taskDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  setUserDetailsAndGreeting() {
    this.username = this.authService.userProfile.userLoginDTO.username;

    const today = new Date();
    this.currentDate = today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const currentHour = today.getHours();
    if (currentHour < 12) {
      this.greetingMessage = 'Good morning';
    } else if (currentHour < 18) {
      this.greetingMessage = 'Good afternoon';
    } else {
      this.greetingMessage = 'Good evening';
    }
  }

  openTaskForm(date: Date) {
    this.selectedDate = date;
    this.isTaskFormVisible = true;
  }

  closeTaskForm() {
    this.isTaskFormVisible = false; 
    // No need to call loadTasks here, as the subscription will handle it
  }

 
  filterTasksByName() {
    if (this.searchedTask) {
      this.filteredTasks = this.tasks.filter(task =>
        task.title.toLowerCase().includes(this.searchedTask.toLowerCase())
      );
      this.tasks = this.filteredTasks
      this.processTasks()
    } else {
      this.filteredTasks = this.tasks; // Show all tasks if no search term
      this.processTasks()
    }
  }
}

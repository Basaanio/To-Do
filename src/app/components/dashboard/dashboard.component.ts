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
import { AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  tasks: Task[] = [];
  sortedTasks: { [date: string]: Task[] } = {};
  dates: string[] = [];
  paginatedDates: string[] = [];
  currentPage: number = 1;
  tasksPerPage: number = 4; // Adjust as needed
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
    private searchService:SearchService,
    private toastr:ToastrService
    
  ) {}

  ngOnInit() {

    this.dashboardService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
      this.filteredTasks = tasks;
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
      this.filteredTasks.push(newTask);
      this.processTasks(); // Reprocess tasks to update the view
    });

  }

  // ngAfterViewInit() {
  //   this.taskFormComponent.taskCreated.subscribe((newTask: Task) => {
  //     this.tasks.push(newTask); // Add the new task to the list
  //     this.filteredTasks.push(newTask);
  //     this.processTasks(); // Reprocess tasks to update the view
  //   });
  // }
  
changeTaskStatus(taskId: number, newStatus: string) {
    const task = this.tasks.find(t => t.taskId === taskId);
    if (task) {
      task.status = newStatus; // Update the status
    } else {
      console.error('Task not found');
    }
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

  futureDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const currentDate = new Date();
    const selectedDate = new Date(control.value);
    if (selectedDate < currentDate) {
      return { pastDate: true }; // Return an error object if the date is in the past
    }
    return null; // No error
  }

  // onTaskAdded() {
  //   this.loadTasks(); // Refresh the task list when a new task is created
  // }
  onTaskAdded(newTask: Task) {
    this.loadTasks();
    console.log('New task added:', newTask);
    // Add task to the correct date in sortedTasks
    const taskDate = this.getFormattedDate(newTask.dueDate);  // Get the date of the task
  
    if (!this.sortedTasks[taskDate]) {
      this.sortedTasks[taskDate] = [];  // Initialize if no tasks for that date
    }
    this.sortedTasks[taskDate].push(newTask);  // Add new task
  }
  
  onTaskDeleted() {
    this.loadTasks(); // Reload tasks to reflect the deletion
  }

 processTasks() {
      // Initialize an empty array for dates
      this.dates = [];

      // Sort tasks by due date
      this.tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
      // Populate sortedTasks with tasks grouped by due date
      this.sortedTasks = this.tasks.reduce<{ [date: string]: Task[] }>((acc, task) => {
        const date = new Date(task.dueDate).toDateString();
        
        // If the date key doesn't exist in the accumulator, create it
        if (!acc[date]) {
          acc[date] = [];
          this.dates.push(date); // Store the date for later use
        }
        
        // Push the current task to the corresponding date
        acc[date].push(task);
        return acc;
      }, {});




  // processTasks() {
  //   // Sort tasks by due date
  //   this.dates = [];
  
  //   this.tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
  //   // Map to store collaborator colors
  //   const collaboratorColors = new Map<number, string>();
  //   const collaboratorsSet = new Set<number>();
  
  //   // Collect unique collaborator IDs
  //   this.tasks.forEach(task => {
  //     task.collaboratorIds?.forEach(collabId => {
  //       collaboratorsSet.add(collabId);
  //     });
  //   });
  
    
    // Filter and organize tasks by date and assign colors
    // this.sortedTasks = this.tasks.reduce((acc: { [date: string]: Task[] }, task: Task) => {
    //   const date = new Date(task.dueDate).toDateString();
    //   if (!acc[date]) {
    //     acc[date] = [];
    //     this.dates.push(date);
    //   }
      
    //   // Assign color based on collaborator
    //   task.color = task.isCollaborative && task.collaboratorIds.length > 0
    //     ? collaboratorColors.get(task.collaboratorIds[0]) || '#D3D3D3' // Default color
    //     : '#AEEEEE'; // Default for personal tasks
        
    //   acc[date].push(task);
    //   return acc;
    // }, {});
  
 
  
  

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
    console.log("closed");
    this.isTaskFormVisible = false; 
    // No need to call loadTasks here, as the subscription will handle it
  }

 
  filterTasksByName() {
    if (this.searchedTask) {
      this.tasks = this.filteredTasks.filter(task =>
        task.title.toLowerCase().includes(this.searchedTask.toLowerCase())
      );
      this.processTasks()
    } else {
      this.filteredTasks = this.tasks; // Show all tasks if no search term
      this.processTasks()
    }
  }




  handleTaskCreated(newTask: Task) {
    this.tasks.push(newTask);
    console.log("New task added:", newTask);
    this.refreshTasks();
  }
  refreshTasks(): void {
    this.taskService.getTasks().subscribe((tasks: Task[]) => {
      this.tasks = tasks; // Update the task list with the fetched tasks
    });
  }

}

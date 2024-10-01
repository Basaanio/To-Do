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
  tasksPerPage: number = 4;
  totalPages: number = 1;
  currentMonth: string = '';
  currentDate: string = '';
  greetingMessage: string = '';
  username: string = '';
  isTaskFormVisible = false;
  selectedDate: Date | null = null;

  selectedTask?: Task;
  isModalOpen = false;
  
  filteredTasks: Task[] = [];
  searchedTask: string = ''; 

  
  @Output() taskCreated = new EventEmitter<void>();
  
  @ViewChild(TaskFormComponent) taskFormComponent!: TaskFormComponent;

  
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
    
    this.loadTasks();
    this.setUserDetailsAndGreeting();
    
    console.log("Hello")

    this.searchService.currentTaskTerm.subscribe(searchTerm => {
      this.searchedTask = searchTerm
      this.filterTasksByName()
    })
    this.taskFormComponent.taskCreated.subscribe((newTask: Task) => {
      this.tasks.push(newTask);
      this.filteredTasks.push(newTask);
      this.processTasks();
    });

  }

  
changeTaskStatus(taskId: number, newStatus: string) {
    const task = this.tasks.find(t => t.taskId === taskId);
    if (task) {
      task.status = newStatus;
    } else {
      console.error('Task not found');
    }
  }

  openEditModal(task: Task) {
    this.selectedTask = task; 
    this.isModalOpen = true; 
  }

  closeModal() {
    console.log("Hello")
    this.isModalOpen = false;
  }
  
 
  loadTasks() {
    this.dashboardService.getUserTasks(this.authService.userProfile.userLoginDTO.userId).subscribe(tasks => {
      this.tasks = tasks;
      console.log('Loaded tasks:', this.tasks); 
      this.processTasks();
    }, error => {
      console.error('Error loading tasks:', error);
    });

    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks; 
      this.filteredTasks = tasks; 
    });
  }

  futureDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const currentDate = new Date();
    const selectedDate = new Date(control.value);
    if (selectedDate < currentDate) {
      return { pastDate: true }; 
    }
    return null; 
  }

  onTaskAdded(newTask: Task) {
    this.loadTasks();
    console.log('New task added:', newTask);
    const taskDate = this.getFormattedDate(newTask.dueDate);
  
    if (!this.sortedTasks[taskDate]) {
      this.sortedTasks[taskDate] = [];
    }
    this.sortedTasks[taskDate].push(newTask);
  }
  
  onTaskDeleted() {
    this.loadTasks();
  }

 processTasks() {
      this.dates = [];

      this.tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
      this.sortedTasks = this.tasks.reduce<{ [date: string]: Task[] }>((acc, task) => {
        const date = new Date(task.dueDate).toDateString();
        
        if (!acc[date]) {
          acc[date] = [];
          this.dates.push(date);
        }
        
        acc[date].push(task);
        return acc;
      }, {}); 

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
  }

 
  filterTasksByName() {
    if (this.searchedTask) {
      this.tasks = this.filteredTasks.filter(task =>
        task.title.toLowerCase().includes(this.searchedTask.toLowerCase())
      );
      this.processTasks()
    } else {
      this.filteredTasks = this.tasks;
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
      this.tasks = tasks;
    });
  }

}

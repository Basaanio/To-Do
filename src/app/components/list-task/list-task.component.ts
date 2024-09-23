import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from 'src/app/services/taskService';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { Task } from 'src/app/models/task';

@Component({
  selector: 'app-list-task',
  templateUrl: './list-task.component.html',
  styleUrls: ['./list-task.component.css']
})
export class ListTaskComponent implements OnInit {
  userId: number;
  tasks: Task[] = [];
  viewType: string=''; // To keep track of the current view

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
    switch (this.viewType) {
      case 'due-today':
        this.taskService.getTasksDueToday(this.userId).subscribe(tasks => {
          this.tasks = tasks;
        });
        break;
      case 'due-this-week':
        this.taskService.getTasksDueThisWeek(this.userId).subscribe(tasks => {
          this.tasks = tasks;
        });
        break;
      case 'past-due':
        this.taskService.getPastDueTasks(this.userId).subscribe(tasks => {
          this.tasks = tasks;
        });
        break;
      default:
        this.tasks = [];
    }
  }
}

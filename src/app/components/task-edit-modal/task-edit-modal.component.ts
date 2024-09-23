import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from 'src/app/services/taskService';
import { Task } from 'src/app/models/task';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'app-task-edit-modal',
  templateUrl: './task-edit-modal.component.html',
  styleUrls: ['./task-edit-modal.component.css']
})
export class TaskEditModalComponent {
  @Input() task!: Task; // Task to edit
  @Output() close = new EventEmitter<Task>(); // Emit when done
  taskForm!: FormGroup;

  collaboratorIds: number[] = []; // Store collaborator IDs
  collaboratorUsernames: string[] = []; 

  constructor(private fb: FormBuilder, private taskService: TaskService, public authService: AuthService) {
    this.createForm();
  }

  createForm() {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required],
      priority: ['', Validators.required],
      status: ['', Validators.required],
      collaboratorIds: [[]] 
    });
  }

  ngOnInit() {
    console.log(this.task)
    // this.taskService.getCollaboratorsByTaskId(this.task.taskId).subscribe(response => console.log(response))

    if (this.task) {
      this.taskService.getCollaboratorsByTaskId(this.task.taskId).subscribe(response => {
        response.forEach(collabortor => {
          if(collabortor['collaboratorUser'].username !== this.authService.userProfile.userLoginDTO.username) {
            this.collaboratorUsernames.push(collabortor['collaboratorUser'].username)
          }
        })
      });
    }
  
  }


  ngOnChanges() {
    if (this.task) {
      console.log('Task data:', this.task); // Log the entire task object
      const dueDateUTC = new Date(this.task.dueDate);
      const localDate = new Date(dueDateUTC.getTime() - dueDateUTC.getTimezoneOffset() * 60000);
  
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description,
        dueDate: localDate.toISOString().slice(0, 16),
        priority: this.task.priority,
        status: this.task.status,
      });
  
    }
  }
  
  

onSubmit() {
  if (this.taskForm.valid) {
      const dueDateLocal = new Date(this.taskForm.value.dueDate);
      const dueDateUTC = new Date(dueDateLocal.getTime() - dueDateLocal.getTimezoneOffset() * 60000);

      const updatedTaskData: Task = {
          ...this.task,
          ...this.taskForm.value,
          dueDate: dueDateUTC.toISOString(), // Send as ISO string in UTC
      };

      this.taskService.updateTask(this.task.taskId, updatedTaskData).subscribe(
          (response: Task) => {
              this.close.emit(response);
          },
          error => {
              console.error("Error updating task:", error);
          }
      );
  }
}


  onCancel() {
    this.close.emit(); // Emit without data to indicate cancellation
  }
}

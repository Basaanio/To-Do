import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from 'src/app/services/taskService';
import { UserService } from 'src/app/services/userService';
import { Task } from 'src/app/models/task';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Status } from 'src/app/models/task';


@Component({
  selector: 'app-task-edit-modal',
  templateUrl: './task-edit-modal.component.html',
  styleUrls: ['./task-edit-modal.component.css']
})
export class TaskEditModalComponent implements OnInit {
  @Input() task!: Task; 
  @Output() taskDeleted = new EventEmitter<void>(); 
   @Output() closeModal = new EventEmitter<void>();

  

  taskForm!: FormGroup;
  users: User[] = []; 
  selectedCollaborators: User[] = []; 
  isCollaboratorVisible: boolean = false; 
  creatorUsername: string = ''; 


  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private userService: UserService,
    public authService: AuthService,
    public toastr:ToastrService,

  ) {
    this.createForm();
  }



  ngOnInit() {
    this.loadUsers(); // Load the list of users

    if (this.task) {
        this.patchTaskForm(); // Populate the form with existing task data
        this.loadSelectedCollaborators(); // Load collaborators for the task
        this.loadCreatorUsername();

        if (this.task.status === 'COMPLETED') {
            this.taskForm.disable(); // Disable form if task is completed
        }
    } else {
        this.createForm(); // Create form for a new task
    }

    // Subscribe to changes in the status control
    this.taskForm.get('status')?.valueChanges.subscribe(status => {
        if (status === 'COMPLETED') {
            this.markTaskAsDone(); // Call the method to mark the task as done
        }
    });
}

close() {
      console.log("emitting from task edit modal");
      this.closeModal.emit();
}
  

  createForm() {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required],
      priority: ['', Validators.required],
      status: ['', Validators.required],
      creator: [{ value: '', disabled: true }] // Creator field (read-only)
    });
  }

markTaskAsDone() {
  this.task.status = 'COMPLETED'; 

  this.taskService.updateTask(this.task.taskId, this.task).subscribe(
      (response: Task) => {
          this.close(); 
          this.toastr.success('Task marked as completed!', 'Success'); 
      },
      error => {
          console.error('Error marking task as done:', error);
          this.toastr.error('Error marking task as completed!', 'Error');
      }
  );
}

  
loadUsers() {
  this.userService.getUsers().subscribe(
    (users: User[]) => {
      const loggedInUserId = this.authService.userProfile.userLoginDTO.userId; 

      this.users = users.filter(user => user.userId !== loggedInUserId); 

      console.log('Fetched Users:', this.users); 
    },
    error => {
      console.error('Error fetching users:', error);
    }
  );
}


markTaskAsCompletedForCollaborator(): void {
      const collaboratorUserId = this.authService.userProfile.userLoginDTO.userId;
      const taskId = this.task.taskId;
  
      this.taskService.updateCollaboratorTaskStatus(taskId, collaboratorUserId, true)
        .subscribe(
          (updatedTask: Task) => {
            console.log('Collaborator marked task as completed:', updatedTask);
            this.task = updatedTask;
          },
          (error) => {
            console.error('Error marking task as completed:', error);
          }
          
        );
    }
    

  toggleCollaborator() {
    this.isCollaboratorVisible = !this.isCollaboratorVisible;
  }

  patchTaskForm() {
    this.taskForm.patchValue({
      title: this.task.title,
      description: this.task.description,
      dueDate: new Date(this.task.dueDate).toISOString().slice(0, 16),
      priority: this.task.priority,
      status: this.task.status
    });
  }

  loadSelectedCollaborators() {
    this.taskService.getCollaboratorsByTaskId(this.task.taskId).subscribe(collaborators => {
      const creatorId = this.task.user?.userId;
      this.selectedCollaborators = collaborators.map(c => c['collaboratorUser']);
  
      this.isCollaboratorVisible = this.selectedCollaborators.length > 0;
    });
  }
  loadCreatorUsername() {
    const creatorId = this.task.userId; 
    this.userService.getUserById(creatorId).subscribe(
      response => {
        const user = response.data; 
        this.creatorUsername = user.username; 
      },
      error => {
        console.error('Error fetching creator username:', error);
      }
    );
  }
  
  

  toggleCheckbox(user: User) {
    const index = this.selectedCollaborators.findIndex(collaborator => collaborator.userId === user.userId);
    if (index === -1) {
      this.selectedCollaborators.push(user);
    } else {
      this.selectedCollaborators.splice(index, 1);
    }
  }

  isCollaboratorSelected(user: User): boolean {
    return this.selectedCollaborators.some(collaborator => collaborator.userId === user.userId);
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const updatedTaskData: Task = {
        ...this.task,
        ...this.taskForm.value,
        collaboratorIds: this.isCollaboratorVisible 
          ? this.selectedCollaborators.map(user => user.userId)
          : [] 
      };
  
      this.taskService.updateTask(this.task.taskId, updatedTaskData).subscribe(
        (response: Task) => {
          this.close();
          this.toastr.success('Task updated successfully!', 'Success');
       },
        error => {
          console.error('Error updating task:', error);
          this.toastr.error('Error updating task!', 'Error'); 

        }
      );
    }
  }
  

  onCancel() {
    this.close(); 
  }
  deleteTask() {
    const taskId = this.task.taskId; 
    this.taskService.deleteTaskWithCollaborators(taskId).subscribe(
      () => {
        console.log('Task and collaborators deleted successfully');
        this.taskDeleted.emit(); 
        this.close();
        this.toastr.success('Task deleted successfully!', 'Success'); 

      },
      error => {
        console.error('Error deleting task:', error);
        this.toastr.error('Error deleting task!', 'Error'); 

      }
    );
  }

 
}


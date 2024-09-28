// import { Component, Input, Output, EventEmitter } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { TaskService } from 'src/app/services/taskService';
// import { Task } from 'src/app/models/task';
// import { AuthService } from 'src/app/services/auth-service/auth.service';

// @Component({
//   selector: 'app-task-edit-modal',
//   templateUrl: './task-edit-modal.component.html',
//   styleUrls: ['./task-edit-modal.component.css']
// })
// export class TaskEditModalComponent {
//   @Input() task!: Task; // Task to edit
//   @Output() close = new EventEmitter<Task>(); // Emit when done
//   taskForm!: FormGroup;
//   @Output() statusChanged = new EventEmitter<string>();


//   collaboratorIds: number[] = []; // Store collaborator IDs
//   collaboratorUsernames: string[] = []; 

//   constructor(private fb: FormBuilder, private taskService: TaskService, public authService: AuthService) {
//     this.createForm();
//   }

//   createForm() {
//     this.taskForm = this.fb.group({
//       title: ['', Validators.required],
//       description: [''],
//       dueDate: ['', Validators.required],
//       priority: ['', Validators.required],
//       status: ['', Validators.required],
//       collaboratorIds: [[]] 
//     });
//   }

//   ngOnInit() {
//     console.log(this.task)
//     // this.taskService.getCollaboratorsByTaskId(this.task.taskId).subscribe(response => console.log(response))

//     if (this.task) {
//       this.taskService.getCollaboratorsByTaskId(this.task.taskId).subscribe(response => {
//         response.forEach(collabortor => {
//           if(collabortor['collaboratorUser'].username !== this.authService.userProfile.userLoginDTO.username) {
//             this.collaboratorUsernames.push(collabortor['collaboratorUser'].username)
//           }
//         })
//       });
//     }
  
//   }


//   ngOnChanges() {
//     if (this.task) {
//       console.log('Task data:', this.task); // Log the entire task object
//       const dueDateUTC = new Date(this.task.dueDate);
//       const localDate = new Date(dueDateUTC.getTime() - dueDateUTC.getTimezoneOffset() * 60000);
  
//       this.taskForm.patchValue({
//         title: this.task.title,
//         description: this.task.description,
//         dueDate: localDate.toISOString().slice(0, 16),
//         priority: this.task.priority,
//         status: this.task.status,
//       });
  
//     }
//   }
//   markAsDone() {
//     this.task.status = 'COMPLETED';
//     this.statusChanged.emit(this.task.status); 
//   }
  

// onSubmit() {
//   if (this.taskForm.valid) {
//       const dueDateLocal = new Date(this.taskForm.value.dueDate);
//       const dueDateUTC = new Date(dueDateLocal.getTime() - dueDateLocal.getTimezoneOffset() * 60000);

//       const updatedTaskData: Task = {
//           ...this.task,
//           ...this.taskForm.value,
//           dueDate: dueDateUTC.toISOString(), // Send as ISO string in UTC
//       };

//       this.taskService.updateTask(this.task.taskId, updatedTaskData).subscribe(
//           (response: Task) => {
//               this.close.emit(response);
//           },
//           error => {
//               console.error("Error updating task:", error);
//           }
//       );
//   }
// }


//   onCancel() {
//     this.close.emit(); // Emit without data to indicate cancellation
//   }
// }

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
  @Input() task!: Task; // Task to edit
  @Output() close = new EventEmitter<Task>(); // Emit when done
  @Output() taskDeleted = new EventEmitter<void>(); // Define the taskDeleted event
  

  taskForm!: FormGroup;
  users: User[] = []; // List of users
  selectedCollaborators: User[] = []; // Selected collaborators
  isCollaboratorVisible: boolean = false; // To track visibility of collaborator selection
  creatorUsername: string = ''; // To store the creator's username


  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private userService: UserService,
    public authService: AuthService,
    public toastr:ToastrService,

  ) {
    this.createForm();
  }

  // ngOnInit() {
  //   this.loadUsers();
  //   if (this.task) {
  //     this.patchTaskForm();
  //     this.loadSelectedCollaborators();
  //     if (this.task.status === 'COMPLETED') {
  //       this.taskForm.disable();
  //     }
  //   } else {
  //     this.createForm(); // Create form for a new task
  //   }
  //   }


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
//     AsComplete(task: Task) {
//     // Update the task status in the backend (make sure to implement this API call)
//     task.status = Status.COMPLETED; // Update the task status
//     // Notify collaborators
//     this.notificationService.notifyCollaborators(task);
// }
// In your task completion logic

markTaskAsDone() {
  this.task.status = 'COMPLETED'; // Update the task status

  this.taskService.updateTask(this.task.taskId, this.task).subscribe(
      (response: Task) => {
          this.close.emit(response); // Emit the updated task
          this.toastr.success('Task marked as completed!', 'Success'); // Success notification
      },
      error => {
          console.error('Error marking task as done:', error);
          this.toastr.error('Error marking task as completed!', 'Error'); // Error notification
      }
  );
}


  
  
loadUsers() {
  this.userService.getUsers().subscribe(
    (users: User[]) => {
      const loggedInUserId = this.authService.userProfile.userLoginDTO.userId; // Get logged-in user ID

      // Filter out the logged-in user from the list of users
      this.users = users.filter(user => user.userId !== loggedInUserId); 

      console.log('Fetched Users:', this.users); // Log the filtered user list
    },
    error => {
      console.error('Error fetching users:', error);
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
    // Load collaborators for the current task
    this.taskService.getCollaboratorsByTaskId(this.task.taskId).subscribe(collaborators => {
      const creatorId = this.task.user?.userId;
      this.selectedCollaborators = collaborators.map(c => c['collaboratorUser']);
  
      // Check if there are any collaborators and set the visibility flag accordingly
      this.isCollaboratorVisible = this.selectedCollaborators.length > 0;
    });
  }
  loadCreatorUsername() {
    const creatorId = this.task.userId; // Get the userId directly from the task
    this.userService.getUserById(creatorId).subscribe(
      response => {
        const user = response.data; // Extract the user from the response
        this.creatorUsername = user.username; // Store the creator's username
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

  // onSubmit() {
  //   if (this.taskForm.valid) {
  //     const updatedTaskData: Task = {
  //       ...this.task,
  //       ...this.taskForm.value,
  //       collaboratorIds: this.selectedCollaborators.map(user => user.userId)
  //     };

  //     this.taskService.updateTask(this.task.taskId, updatedTaskData).subscribe(
  //       (response: Task) => {
  //         this.close.emit(response);
  //       },
  //       error => {
  //         console.error('Error updating task:', error);
  //       }
  //     );
  //   }
  // }


  onSubmit() {
    if (this.taskForm.valid) {
      const updatedTaskData: Task = {
        ...this.task,
        ...this.taskForm.value,
        collaboratorIds: this.isCollaboratorVisible 
          ? this.selectedCollaborators.map(user => user.userId)
          : [] // No collaborators if the checkbox is unchecked
      };
  
      this.taskService.updateTask(this.task.taskId, updatedTaskData).subscribe(
        (response: Task) => {
          this.close.emit(response);
          this.toastr.success('Task updated successfully!', 'Success'); // Success notification
       },
        error => {
          console.error('Error updating task:', error);
          this.toastr.error('Error updating task!', 'Error'); // Error notification

        }
      );
    }
  }
  

  onCancel() {
    this.close.emit(); // Emit without data to indicate cancellation
  }
  deleteTask() {
    const taskId = this.task.taskId; 
    this.taskService.deleteTaskWithCollaborators(taskId).subscribe(
      () => {
        console.log('Task and collaborators deleted successfully');
        this.taskDeleted.emit(); // Emit event after deletion
        this.close.emit(); // Close the modal
        this.toastr.success('Task deleted successfully!', 'Success'); // Success notification

      },
      error => {
        console.error('Error deleting task:', error);
        this.toastr.error('Error deleting task!', 'Error'); // Error notification

      }
    );
  }

 
}


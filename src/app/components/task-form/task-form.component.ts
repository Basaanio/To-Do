import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from 'src/app/services/taskService';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { UserService } from 'src/app/services/userService';
import { User } from 'src/app/models/user';
import { Task } from 'src/app/models/task';
import { pastDateValidator } from 'src/app/Validators/pastDateValidator';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from 'src/app/services/dashboardService';
@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  submitted = false;
  priorityOptions = ['LOW', 'MEDIUM', 'HIGH'];
  statusOptions = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
  isCollaboratorVisible: boolean = false;
  users: User[] = [];
  selectedCollaborators: User[] = [];
  @Output() formClosed = new EventEmitter<void>();
  @Output() taskCreated = new EventEmitter<Task>();
  isLoading = false; // Track loading state
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private authService: AuthService,
    public userService: UserService,
    private toastr: ToastrService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      priority: ['', Validators.required],
      status: ['PENDING', Validators.required],
      dueDate: ['', [Validators.required, pastDateValidator()]],
    });

    this.taskForm.get('status')?.valueChanges.subscribe((value) => {
      console.log(`Selected status: ${value}`);
    });
    this.loadUsers();

  }

  loadUsers() {
    this.userService.getUsers().subscribe(
      (users: User[]) => {
        const loggedInUserId = this.authService.userProfile.userLoginDTO.userId; // Get logged-in user ID

        // Filter out the logged-in user from the list of users
        this.users = users.filter((user) => user.userId !== loggedInUserId);

        console.log('Fetched Users:', this.users); // Log the filtered user list
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  closeTaskForm() {
    this.formClosed.emit();
    console.log("closedform");
  }

  //  onSubmit(): void {
  //   this.submitted = true;

  //   if (this.taskForm.valid) {
  //     const selectedCollaboratorIds = this.selectedCollaborators.map(user => user.userId);

  //     const taskData = new Task(
  //       undefined,
  //       this.taskForm.value.title,
  //       this.taskForm.value.description,
  //       this.taskForm.value.dueDate,
  //       this.taskForm.value.priority,
  //       this.taskForm.value.status,
  //       this.authService.userProfile.userLoginDTO.userId,
  //       this.isCollaboratorVisible,
  //       selectedCollaboratorIds
  //     );

  //     console.log("Submitting Task Data:", taskData);

  //     this.taskService.createTask(taskData).subscribe(response => {
  //       console.log("Task created successfully:", response);
  //       this.taskForm.reset();
  //       this.selectedCollaborators = [];
  //       this.isCollaboratorVisible = false;
  //       this.formClosed.emit();
  //     }, error => {
  //       console.error("Error creating task:", error);
  //     });
  //   }
  // }

  // onSubmit(): void {
  //   this.submitted = true;

  //   if (this.taskForm.valid) {
  //     const selectedCollaboratorIds = this.selectedCollaborators.map(user => user.userId);

  //     const taskData = new Task(
  //       undefined,
  //       this.taskForm.value.title,
  //       this.taskForm.value.description,
  //       this.taskForm.value.dueDate,
  //       this.taskForm.value.priority,
  //       this.taskForm.value.status,
  //       this.authService.userProfile.userLoginDTO.userId,
  //       this.isCollaboratorVisible,
  //       selectedCollaboratorIds
  //     );

  //     console.log("Submitting Task Data:", taskData);

  //     this.taskService.createTask(taskData).subscribe(
  //       response => {
  //         console.log("Task created successfully:", response);
  //         this.taskForm.reset();
  //         this.selectedCollaborators = [];
  //         this.isCollaboratorVisible = false;

  //         // Emit an event to notify other components (like dashboard)
  //         this.taskCreated.emit(response);

  //         this.formClosed.emit();
  //       },
  //       error => {
  //         console.error("Error creating task:", error);
  //         this.errorMessage = error.message; // Store the error message for display
  //       },
  //       () => {
  //         // Reset loading state after completion
  //         this.isLoading = false;
  //       }
  //     );
  //   }
  // }



onSubmit(): void {
    this.submitted = true;
    this.isLoading = true; // Start loading when submitting the form

    if (this.taskForm.valid) {
        const selectedCollaboratorIds = this.selectedCollaborators.map(user => user.userId);
        const taskData = new Task(
            undefined,
            this.taskForm.value.title,
            this.taskForm.value.description,
            this.taskForm.value.dueDate,
            this.taskForm.value.priority,
            this.taskForm.value.status,
            this.authService.userProfile.userLoginDTO.userId,
            this.isCollaboratorVisible,
            selectedCollaboratorIds
        );

        console.log("Submitting Task Data:", taskData);

        this.taskService.createTask(taskData).subscribe(
            response => {
                console.log("Task created successfully:", response);
                this.toastr.success('Task created successfully!', 'Success');

                this.taskForm.reset();
                this.selectedCollaborators = [];
                this.isCollaboratorVisible = false;

                // Emit the created task to the parent component (like dashboard)
                this.taskCreated.emit(response);
                this.formClosed.emit();
            },
            error => {
                console.error("Error creating task:", error);
                this.errorMessage = error.message; // Store the error message for display
            },
            () => {
                // Reset loading state after completion
                this.isLoading = false; // Reset loading state
            }
        );
    } else {
        this.isLoading = false; // Reset loading state if form is invalid
    }
}




  // onSubmit(): void {
  //   this.submitted = true;

  //   if (this.taskForm.valid) {
  //     const selectedCollaboratorIds = this.selectedCollaborators.map(
  //       (user) => user.userId
  //     );

  //     const taskData = new Task(
  //       undefined,
  //       this.taskForm.value.title,
  //       this.taskForm.value.description,
  //       this.taskForm.value.dueDate,
  //       this.taskForm.value.priority,
  //       this.taskForm.value.status,
  //       this.authService.userProfile.userLoginDTO.userId,
  //       this.isCollaboratorVisible,
  //       selectedCollaboratorIds
  //     );

  //     this.taskService.createTask(taskData).subscribe(
  //       (response) => {
  //         console.log('Task created successfully:', response);
  //         this.toastr.success('Task created successfully!', 'Success');
  //         // Emit the created task to the parent component
  //         this.taskCreated.emit(response);
  //         console.log('Task creation event emitted:', response);
  //         this.closeTaskForm(); // Optionally close the form
  //       },
  //       (error) => {
  //         console.error('Error creating task:', error);
  //         this.toastr.error('Error creating task!', 'Error');
  //       }
  //     );
  //   }
  // }

  toggleCollaborator() {
    this.isCollaboratorVisible = !this.isCollaboratorVisible;
    console.log('Collaborator visibility:', this.isCollaboratorVisible);
  }

  toggleCheckbox(index: number) {
    const user = this.users[index];
    if (this.selectedCollaborators.includes(user)) {
      this.selectedCollaborators = this.selectedCollaborators.filter(
        (collaborator) => collaborator.userId !== user.userId
      );
    } else {
      this.selectedCollaborators.push(user);
    }

    console.log('Selected Collaborators:', this.selectedCollaborators);
  }
}

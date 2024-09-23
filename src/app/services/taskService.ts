import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Collaborator, Task } from '../models/task';
import { AuthService } from './auth-service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private tasksSubject: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
  public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();
  private taskCreatedSubject: Subject<void> = new Subject<void>();
  public taskCreated$: Observable<void> = this.taskCreatedSubject.asObservable();

  private apiUrl = 'http://localhost:8080/tasks';
  private collaboratorApiUrl = 'http://localhost:8080/collaborators-tasks/task'; // Base URL for collaborators


  constructor(private http: HttpClient, private authService: AuthService) { }

  private loadTasks() {
    this.http.get<Task[]>('/api/tasks').subscribe(
      tasks => this.tasksSubject.next(tasks),
      error => console.error('Error loading tasks:', error)
    );
  }

  // createTask(task: Task): Observable<Task> {
  //   const token = this.authService.userProfile.jwt;
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //   return this.http.post<Task>(this.apiUrl, task, { headers })
  //     .pipe(
  //       catchError(error => {
  //         console.error('Error creating task:', error);
  //         return throwError(() => new Error('Failed to create task'));
  //       })
  //     );
  // }


  createTask(task: Task): Observable<Task> {
    const token = this.authService.userProfile.jwt;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.post<Task>(this.apiUrl, task, { headers }).pipe(
      tap(newTask => {
        const currentTasks = this.tasksSubject.value;
        this.tasksSubject.next([...currentTasks, newTask]); // Update the task list
        this.taskCreatedSubject.next(); // Notify subscribers about the new task
      }),
      catchError(error => {
        console.error('Error creating task:', error);
        return throwError(() => new Error('Failed to create task'));
      })
    );
  }
  


  private tasks: Task[] = []; 
  private filteredTasksSubject = new BehaviorSubject<Task[]>(this.tasks);
  filteredTasks$ = this.filteredTasksSubject.asObservable();

  // searchTasks(term: string) {
  //   const filtered = this.tasks.filter(task =>
  //     task.title.toLowerCase().includes(term.toLowerCase())
  //   );
  //   this.filteredTasksSubject.next(filtered);
  // }


  // searchTasks(term: string) {
  //   const filtered = this.tasksSubject.value.filter(task =>
  //     task.title.toLowerCase().includes(term.toLowerCase())
  //   );
  //   this.tasksSubject.next(filtered); // Update the BehaviorSubject with filtered tasks
  // }


 
  // getTasks(): Observable<Task[]> {
  //   return this.http.get<Task[]>(this.apiUrl).pipe(
  //     tap(tasks => this.tasksSubject.next(tasks)), // Load tasks into the BehaviorSubject
  //     catchError(error => {
  //       console.error('Error fetching tasks:', error);
  //       return throwError(() => new Error('Failed to fetch tasks'));
  //     })
  //   );
  // }



  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      tap(tasks => {
        this.tasksSubject.next(tasks);
      }),
      catchError(error => {
        console.error('Error fetching tasks:', error);
        return throwError(() => new Error('Failed to fetch tasks'));
      })
    );
  }



  updateTask(taskId: number, taskData: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${taskId}`, taskData);
  }


  getCollaboratorsByTaskId(taskId: number): Observable<Collaborator[]> {
    const token = this.authService.userProfile.jwt;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Collaborator[]>(`${this.collaboratorApiUrl}/${taskId}`, { headers })
        .pipe(
            tap(response => console.log('Collaborators response:', response)), // Log the response
            catchError(error => {
                console.error('Error fetching collaborators:', error);
                return throwError(() => new Error('Failed to fetch collaborators'));
            })
        );
}

getTasksDueToday(userId: number): Observable<Task[]> {
  return this.http.get<Task[]>(`${this.apiUrl}/due-today/${userId}`)
  .pipe(
    map(response => {
      console.log('Tasks due today:', response); // Log the response
      return response; // Return the response for further processing
    }),
    catchError(error => {
      console.error('Error fetching tasks due today:', error); // Log the error
      return of([]); // Return an empty array on error
    })
  );
}

getTasksDueThisWeek(userId: number): Observable<Task[]> {
  return this.http.get<Task[]>(`${this.apiUrl}/due-this-week/${userId}`).pipe(
    map(response => {
      console.log('Tasks due this week:', response); // Log the response
      return response; // Return the response for further processing
    }),
    catchError(error => {
      console.error('Error fetching tasks due this week:', error); // Log the error
      return of([]); // Return an empty array on error
    })
  );
}

getPastDueTasks(userId: number): Observable<Task[]> {
  return this.http.get<Task[]>(`${this.apiUrl}/past-due-tasks/${userId}`).pipe(
    map(response => {
      console.log('Past due tasks:', response); // Log the response
      return response; // Return the response for further processing
    }),
    catchError(error => {
      console.error('Error fetching past due tasks:', error); // Log the error
      return of([]); // Return an empty array on error
    })
  );
}
}



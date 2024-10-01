import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, map, Observable, Subject, tap, throwError } from "rxjs";
import { Task } from "../models/task";
import { AuthService } from "./auth-service/auth.service";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  tasks: Task[] = [];

  
  // Expose the taskCreatedSubject as an Observable
  private taskCreatedSubject = new Subject<void>();
  public taskCreated$ = this.taskCreatedSubject.asObservable();
  private tasksSubject = new BehaviorSubject<Task[]>([]);
tasks$ = this.tasksSubject.asObservable();
  constructor(public http: HttpClient, public authService: AuthService) {}

  notifyTaskCreated() {
    this.taskCreatedSubject.next();
  }

  // getUserTasks(userId: number): Observable<Task[]> {
  //   const token = this.authService.userProfile.jwt;
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  //   return this.http.get<Task[]>(`http://localhost:8080/tasks/user/${userId}`, { headers })
  //     .pipe(
  //       map(tasks => {
  //         this.tasks = tasks;
  //         return tasks;
  //       }),
  //       catchError(error => {
  //         console.error('Error fetching tasks:', error);
  //         return throwError(() => new Error('Failed to fetch tasks'));
  //       })
  //     );
  // }


  getUserTasks(userId: number): Observable<Task[]> {
    const token = this.authService.userProfile.jwt;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.get<Task[]>(`http://localhost:8080/tasks/user/${userId}`, { headers })
      .pipe(
        map(tasks => {
          console.log(tasks)
          this.tasksSubject.next(tasks); // Update the BehaviorSubject
          return tasks;
        }),
        catchError(error => {
          console.error('Error fetching tasks:', error);
          return throwError(() => new Error('Failed to fetch tasks'));
        })
      );
  }

  
}

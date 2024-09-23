import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { User } from 'src/app/models/user';
import { AuthService } from './auth-service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';
  public errorFlag: boolean;

  constructor(private http: HttpClient, public authService: AuthService) {
    this.errorFlag = false;
  }

  getUsers(): Observable<any> {
    const headers = this.authService.getRequestHeaders()
    return this.http.get<any>(this.apiUrl, {headers}).pipe(
      map(response => {
        console.log(response); 
        return response; 
      }),
      catchError(error => {
        this.errorFlag = true;
        console.error("Error fetching users", error);
        return throwError(error);
      })
    );
  }
  

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`).pipe(
      catchError(error => {
        this.errorFlag = true;
        console.error("Error fetching user", error);
        return throwError(error);
      })
    );
  }

  updateUser(userId: number, userData: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}`, userData).pipe(
      map(response => {
        console.log("User updated successfully", response);
        return response;
      }),
      catchError(error => {
        this.errorFlag = true;
        console.error("Error updating user", error);
        return throwError(error);
      })
    );
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`).pipe(
      map(() => {
        console.log("User deleted successfully");
      }),
      catchError(error => {
        this.errorFlag = true;
        console.error("Error deleting user", error);
        return throwError(error);
      })
    );
  }
}

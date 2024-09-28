import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { User } from 'src/app/models/user';
import { AuthService } from './auth-service/auth.service';
import { UserRegisterDTO } from '../models/user-registerDTO';

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
  

  getUserById(userId: number): Observable<{ data: UserRegisterDTO }> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`).pipe(
      map(response => {
        if (response) {
          console.log(response)
          return { data: response };
         // Wrapping response in data object
        } else {
          throw new Error('User not found');
        }

      }),
      catchError(error => {
        console.error('Error fetching user profile:', error);
        return throwError(() => new Error('Error fetching user profile'));
      })
    );
  }

  updateUser(userId: number, userData: User): Observable<{ data: UserRegisterDTO }> {
    return this.http.put<User>(`${this.apiUrl}/${userId}`, userData).pipe(
      map(response => {
        if(response){
        console.log("User updated successfully", response);
        return { data: response };
        }
        else {
          throw new Error('User not found');
        }
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

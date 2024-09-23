import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserCredentials } from 'src/app/models/user-credentails';
import { UserResponse } from 'src/app/models/user-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated() {
    throw new Error('Method not implemented.');
  }
  public userProfile: UserResponse;
  public isLoggedIn: boolean
  errorFlag: boolean

  canActivate(): boolean {
    if (this.isLoggedIn && this.userProfile.jwt)
      return true
    return false
  }

  constructor(public http: HttpClient) {
    this.userProfile = new UserResponse()
    this.errorFlag = false
    this.isLoggedIn = false

  }

  register(user: User) {
    let savedUser: any;
    this.http.post<any>("http://localhost:8080/api/users/register", user).subscribe(response=>{console.log(response)});
  }

  loginUser(user: UserCredentials):Observable<any> {

    this.isLoggedIn = false
    this.errorFlag = false
    console.log(user);


    return this.http.post<any>("http://localhost:8080/auth/login", user).pipe(
      map(response => {
        console.log(response)
        if(response) {
          Object.assign(this.userProfile, response)
          this.isLoggedIn = true
        } else {
          throw new Error("Login Failed")
        }
      }),
      catchError(error => {
        this.errorFlag = true
        console.log("Login Error", error)
        return throwError(error)
      })
    );
  }

  getRequestHeaders(): any {
    const token = this.userProfile.jwt
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
 
}







 


 


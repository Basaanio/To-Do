import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route } from '@angular/router';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserCredentials } from 'src/app/models/user-credentails';
import { UserResponse } from 'src/app/models/user-response';
import { Router } from '@angular/router';
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

  constructor(public http: HttpClient, public router: Router) {
    this.userProfile = new UserResponse()
    this.errorFlag = false
    this.isLoggedIn = false

  }

  // register(user: User) {
  //   let savedUser: any;
  //   this.http.post<any>("http://localhost:8080/api/users/register", user).subscribe(response=>{console.log(response)});
  // }

  register(user: User): Observable<any> {
    return this.http.post<any>("http://localhost:8080/api/users/register", user).pipe(
      map(response => {
        // You can transform the response if needed
        console.log('Response from server:', response);
        return response; // Return the response or any transformation of it
      })
    );
  }

  loginUser(user: UserCredentials):Observable<any> {

    this.isLoggedIn = false
    this.errorFlag = false
    console.log(user);


    return this.http.post<any>("http://localhost:8080/auth/login", user).pipe(
      map(response => {
        console.log(response)
        if(response) {
          localStorage.setItem('currentUser', JSON.stringify(response.jwt))
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
    var userObj = localStorage.getItem('currentUser')
    if(userObj !== null) {
      const jwt = JSON.parse(userObj)
      return new HttpHeaders().set('Authorization', `Bearer ${jwt}`);
    }
  }

  getLoggedInUser(): Observable<any> {
    const headers = this.getRequestHeaders()
    return this.http.get<any>("http://localhost:8080/api/current-user", {headers}).pipe(
      map(response => {
        return {data: response}
      }),
      catchError(error => {
        this.router.navigateByUrl("/signin")
        return throwError(error)
      })
    )
 
  }


  logout(): void {
    localStorage.removeItem('currentUser'); // Remove user data from local storage
    this.isLoggedIn = false; // Update the login state
    this.userProfile = new UserResponse(); // Reset the user profile
  }
 
}







 


 


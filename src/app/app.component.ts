import { Component } from '@angular/core';
import { AuthService } from './services/auth-service/auth.service';
import { Router } from '@angular/router';
import { UserCredentials } from './models/user-credentails';
import { catchError, throwError } from 'rxjs';
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent 
{
  title = 'my-app';
isTaskFormVisible= false;
isSidebarOpen=true;


  constructor(public authService: AuthService, public router: Router) {

  }
  toggleTaskForm() {
    this.isTaskFormVisible = !this.isTaskFormVisible;
    console.log('Task Form visibility toggled:', this.isTaskFormVisible);

  }
  closeTaskForm() {
    this.isTaskFormVisible = false;
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen; // Toggle the sidebar state
    console.log('Sidebar Open State:', this.isSidebarOpen);
  }

   ngOnInit() {
    var userObj = localStorage.getItem('currentUser')
    if(userObj !== null) {
      var jwt = JSON.parse(userObj)
      this.authService.getLoggedInUser().subscribe(response => {
        this.authService.userProfile.userLoginDTO = response.data
        console.log(this.authService.userProfile.userLoginDTO)
        this.authService.userProfile.jwt = jwt
        this.authService.isLoggedIn = true
        this.router.navigateByUrl("/dashboard")
      }),
      catchError(error => {
        return throwError(error)
      })
    }
    else {
      this.router.navigateByUrl("/login")
    }
  }

  }


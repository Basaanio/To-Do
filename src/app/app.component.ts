import { Component } from '@angular/core';
import { AuthService } from './services/auth-service/auth.service';
import { Router } from '@angular/router';
import { UserCredentials } from './models/user-credentails';
 
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

    if (userObj !== null) {
      var myUserDetails = JSON.parse(userObj)
      var userCreds: UserCredentials = new UserCredentials()
      userCreds.username = myUserDetails.user.userEmail
      userCreds.password = myUserDetails.password
      console.log(userCreds)
      this.authService.loginUser(userCreds)
    }
    else
      this.router.navigateByUrl("/login")
  }




  //ngOnInit() {
    // var userObj = localStorage.getItem('currentUser')
 
    // if (userObj !== null) {
    //   var myUserDetails = JSON.parse(userObj)
    //   var userCreds: UserCredentials = new UserCredentials()
    //   userCreds.username = myUserDetails.user.username
    //   userCreds.password = myUserDetails.password
    //   console.log(userCreds)
    //   this.authService.loginUser(userCreds).subscribe(
    //     response => {
    //       this.router.navigateByUrl("/dashboard")
    //     },
    //     err => {
    //       console.error('Login Failed', err)
    //     }
    //   )
    // }
    // else
    //   this.router.navigateByUrl("/signin")
  }


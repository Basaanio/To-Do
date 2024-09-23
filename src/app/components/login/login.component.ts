import { Component } from '@angular/core';
import { User } from '../../models/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserCredentials } from 'src/app/models/user-credentails';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { validateEmail } from 'src/app/Validators/email-validators';
import { validatePassword } from 'src/app/Validators/password-validator';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: FormControl
  password: FormControl
  loginForm: FormGroup

  constructor(public authService: AuthService, public router: Router) {
    this.email = new FormControl('', [Validators.required, validateEmail()])
    this.password = new FormControl('', [Validators.required, Validators.minLength(8), validatePassword()])

    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password
    })
  }

  signInOnSubmit() {
    console.log(this.loginForm.value)
    let userCredentials: UserCredentials = {
      username: this.loginForm.value.email,
      password: this.loginForm.value.password  
    }
    this.authService.loginUser(userCredentials).subscribe(response => {
      this.router.navigateByUrl("/dashboard")//asynch function
    })
  }
}

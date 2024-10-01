import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { validateEmail } from 'src/app/Validators/email-validators';
import { validatePassword } from 'src/app/Validators/password-validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  username:FormControl
  email:FormControl
  password:FormControl

  signupForm: FormGroup

  constructor(public http: HttpClient, public authService: AuthService, public router: Router) {
    this.username = new FormControl('', [Validators.required])
    this.email = new FormControl('', [Validators.required, validateEmail()])
    this.password = new FormControl('', [Validators.required, Validators.minLength(8), validatePassword()])

    this.signupForm = new FormGroup({
      username: this.username,
      email: this.email,
      password: this.password,
    })
  }

  signUpOnSubmit() {
    let user: User = {
      userId:this.signupForm.value.userId,
      username: this.signupForm.value.username,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
    }
    
  this.authService.register(user).subscribe(response => {
    this.router.navigateByUrl("/login")//asynch function
  })
}
  
}

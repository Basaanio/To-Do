import { Component } from '@angular/core';
import { UserRegisterDTO } from 'src/app/models/user-registerDTO';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { UserService } from 'src/app/services/userService';

@Component({
  selector: 'app-application-user-profile',
  templateUrl: './application-user-profile.component.html',
  styleUrls: ['./application-user-profile.component.css']
})
export class ApplicationUserProfileComponent {
  userProfile: UserRegisterDTO = new UserRegisterDTO();
  isEditing: boolean = false;
  isUpdatingPassword: boolean = false;
  newPassword: string = '';


  constructor(private userService: UserService, public authService: AuthService){}
  ngOnInit(): void {
    this.loadUserProfile();
}

// Load the user profile from the server
loadUserProfile(): void {
  const userId = this.authService.userProfile.userLoginDTO.userId;
  this.userService.getUserById(userId).subscribe({
    next: (response) => {
      this.userProfile = response.data;
    },
    error: (err) => {
      console.error('Error loading user profile:', err);
    }
  });
}

// Enable profile editing
editProfile(): void {
  this.isEditing = true;
  this.isUpdatingPassword = false; // Ensure password update is off
}

// Enable password update mode
updatePassword(): void {
  this.isUpdatingPassword = true;
  this.isEditing = true; // Allow profile fields to be editable as well
}

// Save profile or password changes
saveProfile(): void {
  const userId = this.authService.userProfile.userLoginDTO.userId;


// Check if password needs to be updated
    if (this.isUpdatingPassword && this.newPassword) {
      this.userProfile.password = this.newPassword;
    }
 
    this.userService.updateUser(userId, this.userProfile).subscribe({
      next: (response) => {
        this.userProfile = response.data;
        this.isEditing = false;
        this.isUpdatingPassword = false;
        this.newPassword = ''; // Clear the password field
        alert('Profile updated successfully');
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        alert('Error updating profile');
      }
    });
  }

  // Cancel editing or updating password
  cancelEdit(): void {
    this.isEditing = false;
    this.isUpdatingPassword = false;
    this.newPassword = ''; // Clear any password entered
    this.loadUserProfile(); // Reload the original profile data
  }
}



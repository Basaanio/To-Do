import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { TaskService } from 'src/app/services/taskService';

import { BreakpointObserver } from '@angular/cdk/layout';
import {
  ViewChild,
}from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SearchService } from 'src/app/services/searchService';




@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {


  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isMobile= false;
  isCollapsed = false;
  searchTerm: string = ''; 
  isDropdownOpen = false;

  unreadCount = 0;
  notifications: Notification[] = [];
  showNotifications = false;


  constructor(private router: Router, public authService: AuthService, private taskService: TaskService, private observer: BreakpointObserver, private searchService:SearchService) {}

  @Output() toggleForm = new EventEmitter<void>();
  @Output() search: EventEmitter<string> = new EventEmitter<string>();
 

  onAddClick() {
    this.toggleForm.emit();
  }
  logout() {
    this.authService.logout(); 
    this.router.navigate(['/login']);
  }

  isVisible: boolean = false;

  toggleSidebar() {
    this.isVisible = !this.isVisible;
  }
 
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    console.log('Dropdown state:', this.isDropdownOpen);
  }

  
// onSearch(event: KeyboardEvent) {
//   const input = event.target as HTMLInputElement;
//   if (event.key === 'Enter') { // Check if Enter key was pressed
//     const searchTerm = input.value;
//     this.router.navigate(['/list-task'], { queryParams: { search: searchTerm } });
//   }
// }
ngOnInit() {
  this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
    if(screenSize.matches){
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  });
}

// ngOnDestroy() {
//   document.removeEventListener('click', this.onOutsideClick.bind(this));
// }

// onOutsideClick(event: MouseEvent) {
//   const target = event.target as HTMLElement;
//   if (!target.closest('#notificationsDropdown')) {
//     this.isDropdownOpen = false; // Close dropdown if clicking outside
//   }
// }

// loadNotifications(): void {
//   this.notifications = this.notificationService.getNotifications()
//     .filter(notification => notification.userId === this.authService.userProfile.userLoginDTO.userId); // Adjust as necessary
// }


onSearch() {
  this.searchService.UpdatesearchTerm(this.searchTerm);}

toggleMenu() {
  if(this.isMobile){
    this.sidenav.toggle();
    this.isCollapsed = false;
  } else {
    this.sidenav.open();
    this.isCollapsed = !this.isCollapsed;
  }
  
}

navigateToProfile(): void {
  // Navigate to the user's profile page
  this.router.navigate(['/applicationUserProfile']);
}




}





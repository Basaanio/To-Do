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


  constructor(private router: Router, public authService: AuthService, private taskService: TaskService, private observer: BreakpointObserver, private searchService:SearchService) {}

  @Output() toggleForm = new EventEmitter<void>();
  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  onAddClick() {
    this.toggleForm.emit();
  }

  isVisible: boolean = false;

  toggleSidebar() {
    this.isVisible = !this.isVisible;
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



}





import {  EventEmitter, Input, Output } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import {
  Component,
  ViewChild,
}from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  // title = 'material-responsive-sidenav';
  // @ViewChild(MatSidenav)
  // sidenav!: MatSidenav;
  // isMobile= true;
  // isCollapsed = true;


  // constructor(private observer: BreakpointObserver) {}

  // ngOnInit() {
  //   this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
  //     if(screenSize.matches){
  //       this.isMobile = true;
  //     } else {
  //       this.isMobile = false;
  //     }
  //   });
  // }

  // toggleMenu() {
  //   if(this.isMobile){
  //     this.sidenav.toggle();
  //     this.isCollapsed = false;
  //   } else {
  //     this.sidenav.open();
  //     this.isCollapsed = !this.isCollapsed;
  //   }
  // }
}
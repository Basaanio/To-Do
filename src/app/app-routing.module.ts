import { Component, inject, NgModule } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterModule,
  RouterStateSnapshot,
  Routes,
} from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './services/auth-service/auth.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { ListTaskComponent } from './components/list-task/list-task.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { ApplicationUserProfileComponent } from './components/application-user-profile/application-user-profile.component';
import { FooterComponent } from './components/footer/footer.component';
import { InfosectionComponent } from './components/infosection/infosection.component';
import { Infosection2Component } from './components/infosection2/infosection2.component';
export const guard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  // some auth logic
  return inject(AuthService).canActivate();
};

const routes: Routes = [
 
  {
    path: 'signup',
    component: SignupComponent,
 
  },
 
  { path: 'login', component: LoginComponent },
  {path:'',component: HomeComponent}
  ,
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate:[guard]
  },

  {
    path:'task-form',
    component:TaskFormComponent,
    canActivate:[guard]
  },
  {
    path: 'list-task/:viewType', // Capture viewType as a route parameter
    component: ListTaskComponent,
    canActivate: [guard]
  },
  {
    path:'sidebar',
    component:SidebarComponent,
  },
  {
    path:'heroSection',
    component : HeroSectionComponent
  },
  {
  path:'applicationUserProfile',
  component:ApplicationUserProfileComponent,
  canActivate: [guard]
  },
  {
    path: 'footer',
    component: FooterComponent
  },
  {
    path:'infosection',
    component: InfosectionComponent
  },
  {
    path:'infosection2',
    component: Infosection2Component
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

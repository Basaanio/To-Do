import { inject, NgModule } from '@angular/core';
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
import { DemoComponent } from './components/demo/demo.component';
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
    path:'demo',
    component: DemoComponent
  },
  // { path: '', component: HomeComponent },
  // { path: 'list-task/due-today', component: ListTaskComponent }, 
  // { path: 'list-task/due-this-week', component: ListTaskComponent }, 
  // { path: 'list-task/past-due', component: ListTaskComponent }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

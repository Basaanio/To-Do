import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ListTaskComponent } from './components/list-task/list-task.component';
import { TaskEditModalComponent } from './components/task-edit-modal/task-edit-modal.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DemoComponent } from './components/demo/demo.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import {MatIconModule, MatButtonModule, MatToolbarModule, MatSidenavModule,MatListModule}
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { FeaturesComponent } from './components/features/features.component';
import { ToastrModule } from 'ngx-toastr';
import { ApplicationUserProfileComponent } from './components/application-user-profile/application-user-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    NavbarComponent,
    DashboardComponent,
    TaskFormComponent,
    ListTaskComponent,
    TaskEditModalComponent,
    SidebarComponent,
    DemoComponent,
    HeroSectionComponent,
    FeaturesComponent,
    ApplicationUserProfileComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    BrowserAnimationsModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    ToastrModule.forRoot({      positionClass: 'toast-top-right',
      timeOut: 3000,
      preventDuplicates: true,}),
    ],
    
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  title = 'mp-app';

 }

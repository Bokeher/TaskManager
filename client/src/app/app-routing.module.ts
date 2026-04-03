import { NgModule } from '@angular/core';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { RouterModule, Routes } from '@angular/router';
import { ProjectComponent } from './project/project.component';
import { AppComponent } from './app.component';
import { ProjectsComponent } from './projects/projects.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: 'project', component: ProjectComponent },
  { path: 'home', component: AppComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
  ],
})
export class AppRoutingModule {}

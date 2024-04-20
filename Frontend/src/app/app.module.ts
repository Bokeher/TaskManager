import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserSettingsComponent } from './dialogs/user-settings/user-settings.component';
import { ProjectSettingsComponent } from './dialogs/project-settings/project-settings.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectComponent } from './project/project.component';
import { CreateProjectComponent } from './dialogs/create-project/create-project.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddTaskDialogComponent } from './dialogs/add-task-dialog/add-task-dialog.component';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CreateCategoryComponent } from './dialogs/create-category/create-category.component';
import { DeleteProjectComponent } from './dialogs/delete-project/delete-project.component';
import { Validate } from './validate';
import { ManageUsersComponent } from './dialogs/project-settings/manage-users/manage-users.component';
import { CdkDrag, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { EditTaskDialogComponent } from './dialogs/edit-task-dialog/edit-task-dialog.component';
import { FilterDialogComponent } from './dialogs/filter-dialog/filter-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserSettingsComponent,
    ProjectSettingsComponent,
    ProjectsComponent,
    ProjectComponent,
    CreateProjectComponent,
    AddTaskDialogComponent,
    CreateCategoryComponent,
    DeleteProjectComponent,
    ManageUsersComponent,
    EditTaskDialogComponent,
    FilterDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    CdkDrag,
    CdkDropList,
    CdkDropListGroup
  ],
  providers: [
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
    {
      provide: MatDialogRef,
      useValue: {},
    },
    Validate,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

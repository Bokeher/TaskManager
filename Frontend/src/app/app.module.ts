import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserSettingsDialogComponent } from './dialogs/user-settings/user-settings-dialog.component';
import { ProjectSettingsDialogComponent } from './dialogs/project-settings/project-settings-dialog.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectComponent } from './project/project.component';
import { CreateProjectDialogComponent } from './dialogs/create-project/create-project-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateTaskDialogComponent } from './dialogs/create-task/create-task-dialog.component';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CreateCategoryDialogComponent } from './dialogs/create-category/create-category-dialog.component';
import { DeleteProjectDialogComponent } from './dialogs/delete-project/delete-project-dialog.component';
import { Validate } from './validate';
import { ManageUsersComponent } from './dialogs/project-settings/manage-users/manage-users.component';
import { CdkDrag, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { EditTaskDialogComponent } from './dialogs/edit-task/edit-task-dialog.component';
import { FilterDialogComponent } from './dialogs/filter-dialog/filter-dialog.component';
import { EditCategoryComponent } from './dialogs/edit-category/edit-category-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserSettingsDialogComponent,
    ProjectSettingsDialogComponent,
    ProjectsComponent,
    ProjectComponent,
    CreateProjectDialogComponent,
    CreateTaskDialogComponent,
    CreateCategoryDialogComponent,
    DeleteProjectDialogComponent,
    ManageUsersComponent,
    EditTaskDialogComponent,
    EditCategoryComponent,
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

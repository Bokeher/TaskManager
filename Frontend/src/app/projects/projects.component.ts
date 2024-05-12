import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { User } from '../dataModels/user';
import { Project } from '../dataModels/project';
import { SessionService } from '../session.service';
import { concatMap, finalize, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit {
  user?: User;
  projectData: Project[] = [];
  projectNumber: number = 0;
  selectedProjectId?: number;

  constructor(
    private dataService: DataService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.sessionService.getUserObservable().subscribe((user) => {
      if(!user) return;

      this.user = user;
      this.projectNumber = user.projectIds.length;

      this.getAllProjects();
    });

    this.sessionService.getSelectedProjectObservable().subscribe((project) => {
      if(!project || !this.selectedProjectId) return;
      
      this.projectData[this.selectedProjectId] = project;
    })
  }

  getAllProjects() {
    if (!this.user) return;

    this.projectData = [];

    this.user.projectIds.forEach((projectId) => {
      this.getProject(projectId)
        .pipe(
          concatMap((response: Project) => {
            this.projectData.push(response);

            return of(null);
          }),
          finalize(() => {
            this.projectData.sort((a, b) => a.name.localeCompare(b.name));
          })
        )
        .subscribe();
    });
  }

  getProject(id: string) {
    return this.dataService.getProject(id);
  }

  openProject(id: number) {
    this.sessionService.setSelectedProject(this.projectData[id]);

    this.selectedProjectId = id;
    
    this.router.navigate(["/project"]);
  }
}

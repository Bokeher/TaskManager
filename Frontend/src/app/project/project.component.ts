import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { Project } from '../dataModels/project';
import { Task } from '../dataModels/task';
import { DataService } from '../data.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateTaskDialogComponent } from '../dialogs/create-task/create-task-dialog.component';
import { CreateCategoryDialogComponent } from '../dialogs/create-category/create-category-dialog.component';
import { ProjectSettingsDialogComponent } from '../dialogs/project-settings/project-settings-dialog.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { EditTaskDialogComponent } from '../dialogs/edit-task/edit-task-dialog.component';
import { User } from '../dataModels/user';
import { Observable, forkJoin, map, BehaviorSubject, share, Subscription } from 'rxjs';
import { FilterDialogComponent } from '../dialogs/filter-dialog/filter-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
})
export class ProjectComponent implements OnInit {
  project?: Project;
  user?: User;

  tasksByCategories: BehaviorSubject<Map<string, Task[]>> = new BehaviorSubject(new Map<string, Task[]>());
  tasksByCategories$: Observable<Map<string, Task[]>> = this.tasksByCategories.asObservable();

  members: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  members$ = this.members.asObservable();
  private subscriptionMember!: Subscription;

  showOnlyAssigned?: boolean;

  constructor(
    private sessionService: SessionService,
    private dataService: DataService,
    public dialog: MatDialog,
    private router: Router
  ) { }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  ngOnInit(): void {
    this.sessionService
      .getSelectedProjectObservable()
      .pipe(share())
      .subscribe((selectedProject) => {
        
        if(!selectedProject) {
          this.router.navigate(["/"]);
          return;
        }

        this.project = selectedProject;

        const taskMap = new Map<string, Task[]>(); // <category, task[]>

        // add tasks to corresponding categories
        this.project.tasks.forEach((task) => {
          taskMap.set(task.category, (taskMap.get(task.category) || []).concat(task));
        });

        // add empty categories for rendering view
        this.project.categories.forEach((category) => {
          if (!taskMap.has(category)) {
            taskMap.set(category, []);
          }
        });

        // sort to keep order of 'categories'
        this.sortTasksByCategoryOrderAndUpdateBehaviourSubject(taskMap);

        // get all members of any task in project, then delete duplicates
        const usersIds = [...new Set(this.project.tasks.map(e => e.memberIds).flat())];
        
        this.subscriptionMember = forkJoin(
          usersIds.map((id) => this.dataService.getUserById(id))
        ).pipe(
          map(member => this.members.next(member))
        ).subscribe();
      });

    this.sessionService.getShowOnlyAssignedTasksObservable().subscribe((showOnlyAssigned) => {
      this.showOnlyAssigned = showOnlyAssigned;
    })

    this.sessionService.getUserObservable().subscribe((user) => {
      if (user) this.user = user;
    })
  }

  getAvatarUrl(member: User): string {
    if(member.avatarUrl.length == 0) {
      return "https://cdn-icons-png.freepik.com/256/1077/1077114.png";
    }

    return member.avatarUrl;
  }

  isUserMemberOfTask(task: Task): boolean {
    if (!this.user || !this.user._id) return false;

    return task.memberIds.includes(this.user._id); 
  }

  originalOrder(a: any, b: any): number {
    return 0;
  }

  sortTasksByCategoryOrderAndUpdateBehaviourSubject(taskMap: Map<string, Task[]>): void {
    if(!this.project) return;

    const sortedTasksByCategories = new Map<string, Task[]>();

    this.project.categories.forEach((category) => {
      if (taskMap.has(category)) {
        sortedTasksByCategories.set(category, taskMap.get(category)!);
      }
    });

    this.tasksByCategories.next(sortedTasksByCategories);
  }

  isUserTaskMember(member: User, task: Task): boolean {
    return task.memberIds.includes(member._id!);
  }

  // Dialogs
  openProjectSettingsDialog(): void {
    this.closeDialog();
    this.dialog.open(ProjectSettingsDialogComponent, {
      backdropClass: 'blur',
      hasBackdrop: true,
    });
  }

  openFilterDialog(): void {
    this.closeDialog();
    this.dialog.open(FilterDialogComponent, {
      backdropClass: 'blur',
      hasBackdrop: true,
    })
  }

  openAddCategoryDialog(): void {
    this.closeDialog();
    this.dialog.open(CreateCategoryDialogComponent, {
      backdropClass: 'blur',
      hasBackdrop: true,
    });
  }

  openEditTaskDialog(task: Task) {
    this.closeDialog();
    this.dialog.open(EditTaskDialogComponent, {
      backdropClass: 'blur',
      hasBackdrop: true,
      data: task,
    });
  }

  openCreateTaskDialog(category: string): void {
    this.closeDialog();
    this.dialog.open(CreateTaskDialogComponent, {
      backdropClass: 'blur',
      hasBackdrop: true,
      data: category,
    });
  }

  deleteTask(deletingTask: Task) {
    if (!this.project || !this.project._id) return;

    this.project.tasks = this.project.tasks.filter(
      (task) => task !== deletingTask
    );

    this.updateSessionAndDbOfProject();
  }

  deleteCategory(deletingCategory: string) {
    if (!this.project || !this.project._id) return;

    this.project.categories = this.project?.categories.filter(
      (category) => category !== deletingCategory
    );

    this.updateSessionAndDbOfProject();
  }

  trackCategory(index: number, category: string): string {
    return category;
  }

  trackTask(index: number, task: Task): string {
    return task.name + '_' + task.category;
  }

  drop(event: CdkDragDrop<Task[]>, newCategory: string) {
    if(this.showOnlyAssigned) return;

    const previousCategory = event.previousContainer.data[0].category;

    if (!this.project) return;
    if (
      event.previousContainer == event.container &&
      event.previousIndex == event.currentIndex
    ) return;

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {      
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      event.container.data[event.currentIndex].category = newCategory;
    }

    const map = this.tasksByCategories.getValue();
    map.set(previousCategory, event.previousContainer.data);
    map.set(newCategory, event.container.data);

    this.tasksByCategories.next(map);

    const tasks: Task[] = []
    this.project.categories.forEach((category) => {
      const tasksInCategory = map.get(category)
      if(tasksInCategory) {
        tasksInCategory.forEach(task => {
          tasks.push(task);
        });
      }
    });

    this.project.tasks = tasks;
    
    this.updateSessionAndDbOfProject();
  }

  dropList(event: CdkDragDrop<string[]>) {
    if (this.project) {
      moveItemInArray(this.project.categories, event.previousIndex, event.currentIndex);

      this.updateSessionAndDbOfProject();
    }
  }

  updateSessionAndDbOfProject() {
    if(!this.project) return;

    this.sessionService.setSelectedProject(this.project);

    const { _id, ...project } = this.project;
    if (_id) this.dataService.updateProject(_id, project).subscribe();
  }
}

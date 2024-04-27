import {
  Component,
  OnInit,
} from '@angular/core';
import { SessionService } from '../session.service';
import { Project } from '../dataModels/project';
import { Task } from '../dataModels/task';
import { DataService } from '../data.service';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskDialogComponent } from '../dialogs/add-task-dialog/add-task-dialog.component';
import { CreateCategoryComponent } from '../dialogs/create-category/create-category.component';
import { ProjectSettingsComponent } from '../dialogs/project-settings/project-settings.component';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { EditTaskDialogComponent } from '../dialogs/edit-task-dialog/edit-task-dialog.component';
import { User } from '../dataModels/user';
import {
  Observable,
  forkJoin,
  map,
  BehaviorSubject,
  share, Subscription,
} from 'rxjs';
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
  categories: string[] = [];

  tasksByCategories: BehaviorSubject<Map<string, Task[]>> = new BehaviorSubject<
    Map<string, Task[]>
  >(new Map<string, Task[]>());
  tasksByCategories$: Observable<Map<string, Task[]>> =
    this.tasksByCategories.asObservable();

  members: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
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
        this.project = selectedProject!;

        if(!selectedProject) {
          this.router.navigate(["/"]);
        }

        if (selectedProject) {
          const tasksByCategories = new Map();
          this.categories = selectedProject.categories;

          selectedProject.tasks.forEach((task) => {
            if (tasksByCategories.has(task.category)) {
              tasksByCategories.get(task.category)?.push(task);
            } else {
              tasksByCategories.set(task.category, [task]);
            }
          });

          this.categories.forEach((category) => {
            if (!tasksByCategories.has(category)) {
              tasksByCategories.set(category, []);
            }
          });

          // sort to keep order of 'categories'
          this.sortTasksByCategoryOrder(tasksByCategories);
        }

        if(this.project) {
          // get all members of any task in project, then delete duplicates
          const usersIds = [...new Set(this.project!.tasks.map(e => e.memberIds).flat())];
          
          this.subscriptionMember = forkJoin(
            usersIds.map((id) => this.dataService.getUserById(id))
          ).pipe(
            map(member => this.members.next(member))
          ).subscribe();
        }
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

    const memberIdsSet = new Set(task.memberIds);

    return memberIdsSet.has(this.user._id);
  }

  originalOrder(a: any, b: any): number {
    return 0;
  }

  sortTasksByCategoryOrder(taskMap: Map<string, Task[]>): void {
    const sortedTasksByCategories = new Map<string, Task[]>();

    this.categories.forEach((category) => {
      if (taskMap.has(category)) {
        sortedTasksByCategories.set(category, taskMap.get(category)!);
      }
    });

    this.tasksByCategories.next(sortedTasksByCategories);
  }

  checkMember(member: User, task: Task) {
    return task.memberIds.includes(member._id!);
  }

  // Dialogs
  openProjectSettingsDialog(): void {
    this.closeDialog();
    this.dialog.open(ProjectSettingsComponent, {
      backdropClass: 'blur',
      disableClose: false,
      autoFocus: false,
    });
  }

  openFilterDialog(): void {
    this.closeDialog();
    this.dialog.open(FilterDialogComponent, {
      backdropClass: 'blur',
      disableClose: false,
      autoFocus: false,
    })
  }

  openAddCategoryDialog(): void {
    this.closeDialog();
    this.dialog.open(CreateCategoryComponent, {
      backdropClass: 'blur',
      autoFocus: false,
    });
  }

  openEditTaskDialog(task: Task) {
    this.closeDialog();
    this.dialog.open(EditTaskDialogComponent, {
      backdropClass: 'blur',
      autoFocus: false,
      data: task,
    });
  }

  openAddTaskDialog(category: string): void {
    this.closeDialog();
    this.dialog.open(AddTaskDialogComponent, {
      backdropClass: 'blur',
      autoFocus: false,
      data: category,
    });
  }

  deleteTask(deletingTask: Task) {
    if (!this.project || !this.project._id) return;

    this.project.tasks = this.project.tasks.filter(
      (task) => task !== deletingTask
    );

    const { _id, ...project } = this.project;

    this.updateProject(_id, project);
    this.sessionService.setSelectedProject(this.project);
  }

  deleteCategory(deletingCategory: string) {
    if (!this.project || !this.project._id) return;

    this.project.categories = this.project?.categories.filter(
      (category) => category !== deletingCategory
    );

    const { _id, ...project } = this.project;

    this.updateProject(_id, project);
    this.sessionService.setSelectedProject(this.project);
  }

  // dataService
  getProject(id: string): void {
    this.dataService.getProject(id).subscribe(
      (response: Project) => {
        this.project = response;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  updateProject(id: string, newProject: Project): void {
    this.dataService.updateProject(id, newProject).subscribe(
      (response: Project) => {
      },
      (error) => {
        console.error(error);
      }
    );
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

    const categoires = this.project.categories;

    const tasks: Task[] = []
    this.categories.forEach((category) => {
      const tasksInCategory = map.get(category)
      if(tasksInCategory) {
        tasksInCategory.forEach(task => {
          tasks.push(task);
        });
      }
    });

    this.project.tasks = tasks;
    
    // // update session
    this.sessionService.setSelectedProject(this.project);

    // // update database
    const { _id, ...newProject } = this.project;
    if (_id) this.updateProject(_id, newProject);
  }

  dropList(event: CdkDragDrop<string[]>) {
    if (this.project) {
      moveItemInArray(this.project.categories, event.previousIndex, event.currentIndex);
      this.sessionService.setSelectedProject(this.project);
      const { _id, ...newProject } = this.project;
      if (_id) this.updateProject(_id, newProject);
    }
  }
}

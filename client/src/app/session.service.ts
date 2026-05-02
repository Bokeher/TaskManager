import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './dataModels/user';
import { Project } from './dataModels/project';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private userKey = 'userSession';
  private tokenKey = 'authToken';
  private selectedProjectKey = 'selectedProject';
  private showOnlyAssignedTasksKey = 'showOnlyAssignedTasks';

  private userSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private selectedProjectSubject = new BehaviorSubject<Project | null>(null);
  private showOnlyAssignedTasksSubject = new BehaviorSubject<boolean>(false);

  constructor() {
    this.loadAllDataFromStorage();
  }

  // User
  setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.userSubject.next(user);
  }

  getUserObservable(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  private getUser(): User | null {
    return this.userSubject.getValue();
  }

  clearUser(): void {
    localStorage.removeItem(this.userKey);
    this.userSubject.next(null);
  }
  
  // Token
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.tokenSubject.next(token);
  }

  getTokenObservable(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }

  getToken(): string | null {
    return this.tokenSubject.getValue();
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    this.tokenSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser();
  }

  // Only assigned flag
  setShowOnlyAssignedTasks(show: boolean): void {
    localStorage.setItem(this.showOnlyAssignedTasksKey, ""+show);
    this.showOnlyAssignedTasksSubject.next(show);
  }

  getShowOnlyAssignedTasksObservable(): Observable<boolean> {
    return this.showOnlyAssignedTasksSubject.asObservable();
  }

  private getShowOnlyAssignedTasks(): boolean {
    return this.showOnlyAssignedTasksSubject.getValue();
  }

  clearShowOnlyAssignedTasks() {
    localStorage.removeItem(this.showOnlyAssignedTasksKey);
    this.showOnlyAssignedTasksSubject.next(false);
  }

  // Selected project
  setSelectedProject(project: Project | null): void {
    localStorage.setItem(this.selectedProjectKey, JSON.stringify(project));
    this.selectedProjectSubject.next(project);
  }

  getSelectedProjectObservable(): Observable<Project | null> {
    return this.selectedProjectSubject.asObservable();
  }

  private getSelectedProject(): Project | null {
    const selectedProjectJSON = localStorage.getItem(this.selectedProjectKey);
    return selectedProjectJSON ? JSON.parse(selectedProjectJSON) : null;
  }

  clearSelectedProject(): void {
    localStorage.removeItem(this.selectedProjectKey);
    this.selectedProjectSubject.next(null);
  }

  // Loading data
  loadUserDataFromStorage(): void {
    const userDataJSON = localStorage.getItem(this.userKey);
    if (userDataJSON) {
      const userData = JSON.parse(userDataJSON) as User;
      this.userSubject.next(userData);
    }
  }

  loadSelectedProjectData(): void {
    const selectedProjectJSON = localStorage.getItem(this.selectedProjectKey);
    if (selectedProjectJSON) {
      const selectedProject = JSON.parse(selectedProjectJSON) as Project;
      this.selectedProjectSubject.next(selectedProject);
    }
  }

  loadShowOnlyAssignedTasks(): void {
    const showOnly = localStorage.getItem(this.showOnlyAssignedTasksKey);
    if(showOnly) {
      const bool: boolean = JSON.parse(showOnly)
      this.showOnlyAssignedTasksSubject.next(bool);
    }
  }

  logout(): void {
    this.clearToken();
    this.clearUser();
    this.clearSelectedProject();
    this.clearShowOnlyAssignedTasks();
  }

  loadAllDataFromStorage(): void {
    this.loadTokenFromStorage();
    this.loadUserDataFromStorage();
    this.loadSelectedProjectData();
    this.loadShowOnlyAssignedTasks();
  }

  loadTokenFromStorage(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.tokenSubject.next(token);
    }
  }

  userIsAdmin(): boolean {
    const project = this.getSelectedProject();
    const user = this.getUser();

    if (!project || !user || !user._id) return false;

    return project.projectMembers.some((member) => {
      return member.userId == user._id && member.isAdmin;
    });
  }
}

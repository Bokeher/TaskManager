import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './dataModels/user';
import { Project } from './dataModels/project';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) {}

  /**
   * Retrieves user data from the server based on the provided login and password.
   * @param login The user's login.
   * @param password The user's password.
   * @returns An Observable that emits the retrieved User object.
   */
  getUser(email: string, login: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}getUser`, {
      email,
      login,
      password,
    });
  }

  /**
   * Retrieves user data from the server based on the provided id.
   * @param id The user's id.
   * @returns An Observable that emits the retrieved User object.
   */
  getUserById(id: string) {
    return this.http.post<User>(`${this.apiUrl}getUserById`, { id });
  }

  /**
   * Retrieves user data from the server based on the provided login.
   * @param login The user's login.
   * @returns An Observable that emits the retrieved User object.
   */
  getUserByLogin(login: string) {
    return this.http.post<User>(`${this.apiUrl}getUserByLogin`, { login });
  }

  getUserByLoginWithoutPassword(login: string) {
    return this.http.post<User>(`${this.apiUrl}getUserByLoginWithoutPassword`, { login });
  }

  /**
   * Creates new user data on the server with the provided login and password.
   * @param login The user's login.
   * @param password The user's password.
   * @returns An Observable that emits the created User object.
   */
  createUser(login: string, password: string, email: string): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}createUser`, {
      email,
      login,
      password,
    });
  }

  /**
   * Updates user data on the server with the provided user object and ID.
   * @param id The ID of the user to update.
   * @param newUser The updated User object.
   * @returns An Observable that emits the updated User object.
   */
  updateUser(id: string, newUser: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}updateUser`, { id, newUser });
  }

  /**
   * Deletes user data from the server based on the provided login.
   * @param login The login of the user to delete.
   * @returns An Observable that completes when the user data is deleted.
   */
  deleteUser(login: string): Observable<void> {
    const params = new HttpParams().set('login', login);
    return this.http.delete<void>(`${this.apiUrl}deleteUser`, { params });
  }

  /**
   * Retrieves project data from the server based on the provided ID.
   * @param id The ID of the project to retrieve.
   * @returns An Observable that emits the retrieved Project object.
   */
  getProject(id: string): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}getProject`, { id });
  }

  /**
   * Creates new project data on the server with the provided project name and creator ID.
   * @param projectName The name of the project.
   * @param creatorId The ID of the project creator.
   * @returns An Observable that emits the created Project object.
   */
  createProject(projectName: string, creatorId: string): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}createProject`, {
      projectName,
      creatorId,
    });
  }

  /**
   * Updates project data on the server with the provided project object and ID.
   * @param id The ID of the project to update.
   * @param newProject The updated Project object.
   * @returns An Observable that emits the updated Project object.
   */
  updateProject(id: string, newProject: Project): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}updateProject`, {
      id,
      newProject,
    });
  }

  /**
   * Deletes project data from the server based on the provided ID.
   * @param id The ID of the project to delete.
   * @returns An Observable that completes when the project data is deleted.
   */
  deleteProject(id: string): Observable<void> {
    const params = new HttpParams().set('id', id);
    return this.http.delete<void>(`${this.apiUrl}deleteProject`, { params });
  }
}

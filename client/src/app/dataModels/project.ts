import { ProjectMember } from './projectMember';
import { Task } from './task';

export class Project {
  /**
   * Creates a new project.
   * @param name - The name of the project.
   * @param projectMembers - An array of project members.
   * @param tasks - An array of tasks.
   * @param _id - The ID of the project (optional).
   */
  constructor(
    public name: string,
    public projectMembers: ProjectMember[],
    public tasks: Task[],
    public categories: string[],
    public _id?: string
  ) {}
}

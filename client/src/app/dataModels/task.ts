export class Task {
  /**
   * Creates a new instance of the `Task` class.
   * @param name - The name of the task.
   * @param description - The description of the task.
   * @param imageUrl - The URL of the image associated with the task.
   * @param memberIds - An array of member IDs assigned to the task.
   * @param category - The category of the task.
   */
  constructor(
    public name: string,
    public description: string,
    public imageUrl: string,
    public memberIds: string[],
    public category: string
  ) {}
}

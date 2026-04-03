export class User {
  /**
   * Creates a new instance of the `User` class.
   * @param avatarUrl - The URL of the user's avatar.
   * @param email - The user's email.
   * @param login - The user's login.
   * @param password - The user's password.
   * @param projectIds - The IDs of the projects associated with the user.
   * @param _id - The optional ID of the user.
   */
  constructor(
    public avatarUrl: string,
    public email: string,
    public login: string,
    public password: string,
    public projectIds: string[],
    public _id?: string
  ) {}
}

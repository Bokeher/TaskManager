export class ProjectMember {
  /**
   * Creates a new ProjectMember instance.
   * @param userId - The user ID of the member.
   * @param isAdmin - Indicates whether the member is an admin or not.
   */
  constructor(public userId: string, public isAdmin: boolean) {}
}

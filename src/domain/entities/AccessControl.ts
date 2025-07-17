export class AccessControl {
  public id: number | null;
  public userId: number;
  public propertyId: number;
  public role: string;
  public createdAt: Date | null;
  public updatedAt: Date | null;

  constructor(
    id: number | null,
    userId: number,
    propertyId: number,
    role: string,
    createdAt: Date | null,
    updatedAt: Date | null,
  ) {
    this.id = id;
    this.userId = userId;
    this.propertyId = propertyId;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Getters and Setters
  getId(): number | null {
    return this.id;
  }
  getUserId(): number {
    return this.userId;
  }
  setUserId(id: number): void {
    this.userId = id;
  }
  getPropertyId(): number {
    return this.propertyId;
  }
  setPropertyId(id: number) {
    this.propertyId = id;
  }
  getRole(): string {
    return this.role;
  }
  setRole(role: string) {
    this.role = role;
  }
}

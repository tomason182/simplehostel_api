import bcrypt from "bcrypt";
import { UserDTO } from "../../dto/UserDTO";

export class User {
  public id: number | null;
  public username: string;
  public firstName: string;
  public lastName: string | null;
  public avatar: string | null;
  public createdAt: Date | null;
  public updatedAt: Date | null;
  private passwordHash: string;
  private isValidEmail: boolean;
  private lastResendEmail: number;
  private waitingPeriod: number = 5 * 60 * 1000; // Tiempo de espera en milisegundos

  constructor(
    id: number | null,
    username: string,
    firstName: string,
    lastName: string | null,
    passwordHash: string,
    isValidEmail: boolean,
    lastResendEmail: number,
    avatar: string | null,
    createdAt: Date | null,
    updatedAt: Date | null,
  ) {
    this.id = id;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.passwordHash = passwordHash;
    this.isValidEmail = isValidEmail;
    this.lastResendEmail = lastResendEmail;
    this.avatar = avatar;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Metodos de clase
  static async passwordHash(
    password: string,
    saltRounds = 10,
  ): Promise<string> {
    try {
      return await bcrypt.hash(password, saltRounds);
    } catch (err) {
      throw new Error("Error hashing password");
    }
  }

  static async fromDTO(
    data: UserDTO,
    options = { hashPassword: false },
  ): Promise<User> {
    const passwordHash = options.hashPassword
      ? await User.passwordHash(data.password)
      : data.password; // El password ya esta hasheado

    return new User(
      data.id || null,
      data.username,
      data.firstName,
      data.lastName,
      passwordHash,
      data.isValidEmail,
      data.lastResendEmail,
      data.avatar,
      data.createdAt,
      data.updatedAt,
    );
  }

  // Metodos de instancia
  async comparePasswords(password: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, this.passwordHash);
    } catch (err) {
      return false;
    }
  }

  checkPassword(newPass: string, repeatPass: string): boolean {
    if (newPass !== repeatPass) {
      return false;
    }
    return true;
  }

  canResendEmail(): boolean {
    const now = Date.now();
    return now - this.lastResendEmail > this.waitingPeriod;
  }

  // Getter and Setters
  getLastResendEmail(): number {
    return this.lastResendEmail;
  }
  setLastResendEmail(): void {
    this.lastResendEmail = Date.now();
  }

  setIsValidEmail(): void {
    this.isValidEmail = true;
  }
  getIsValidEmail(): boolean {
    return this.isValidEmail;
  }

  getUsername(): string {
    return this.username;
  }

  getFirstName(): string {
    return this.firstName;
  }
}

import { userRepository, UserRepository } from "./user.repository";
import type { NewUser, User } from "./user.schema";
import { ConflictError, NotFoundError } from "../../core/errors";
import type { UpdateUserInput } from "./validator";

export type SafeUser = Omit<User, "password">;

export class UserService {
  constructor(private readonly users: UserRepository = userRepository) {}

  stripPassword(user: User): SafeUser {
    const { password: _ignored, ...safe } = user;
    return safe;
  }

  findByEmail(email: string): Promise<User | null> {
    return this.users.findByEmail(email);
  }

  findByUsername(username: string): Promise<User | null> {
    return this.users.findByUsername(username);
  }

  findById(id: number): Promise<User | null> {
    return this.users.findById(id);
  }

  async listUsers(): Promise<SafeUser[]> {
    const rows = await this.users.findAll();
    return rows.map((u) => this.stripPassword(u));
  }

  async getUserById(id: number): Promise<SafeUser> {
    const user = await this.users.findById(id);
    if (!user) throw new NotFoundError("User not found");
    return this.stripPassword(user);
  }

  async createUser(data: NewUser): Promise<User> {
    const [emailTaken, usernameTaken] = await Promise.all([
      this.users.findByEmail(data.email),
      this.users.findByUsername(data.username),
    ]);
    if (emailTaken || usernameTaken) {
      throw new ConflictError("Email or username already in use");
    }
    return this.users.createUser({
      ...data,
      email: data.email.toLowerCase(),
    });
  }

  async updateUser(id: number, data: UpdateUserInput): Promise<SafeUser> {
    if (data.email) {
      const existing = await this.users.findByEmail(data.email);
      if (existing && existing.id !== id) {
        throw new ConflictError("Email already in use");
      }
    }
    if (data.username) {
      const existing = await this.users.findByUsername(data.username);
      if (existing && existing.id !== id) {
        throw new ConflictError("Username already in use");
      }
    }

    const updated = await this.users.updateUser(id, {
      ...data,
      ...(data.email ? { email: data.email.toLowerCase() } : {}),
    });
    if (!updated) throw new NotFoundError("User not found");
    return this.stripPassword(updated);
  }

  async updatePassword(id: number, hashedPassword: string): Promise<User> {
    const updated = await this.users.updatePassword(id, hashedPassword);
    if (!updated) throw new NotFoundError("User not found");
    return updated;
  }

  async getUsersByTheme(theme: "light" | "dark" | "auto"): Promise<SafeUser[]> {
    const users = await this.users.findByThemePreference(theme);
    return users.map((u) => this.stripPassword(u));
  }

  async getUsersByLanguage(language: string): Promise<SafeUser[]> {
    const users = await this.users.findByLanguagePreference(language);
    return users.map((u) => this.stripPassword(u));
  }

  async getUsersWithEmailNotifications(): Promise<SafeUser[]> {
    const users = await this.users.findWithEmailNotificationsEnabled();
    return users.map((u) => this.stripPassword(u));
  }

  async updateUserPreferences(
    id: number,
    preferences: Partial<NonNullable<User["preferences"]>>,
  ): Promise<SafeUser> {
    const updated = await this.users.updatePreferences(id, preferences);
    if (!updated) throw new NotFoundError("User not found");
    return this.stripPassword(updated);
  }
}

export const userService = new UserService();
export default userService;

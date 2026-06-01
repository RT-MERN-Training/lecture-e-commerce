import { eq, sql } from "drizzle-orm";
import { db } from "../../db";
import { users, type User, type NewUser } from "./user.schema";

export class UserRepository {
  async findAll(): Promise<User[]> {
    return db.select().from(users);
  }

  async findByEmail(email: string): Promise<User | null> {
    const [row] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);
    return row ?? null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const [row] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    return row ?? null;
  }

  async findById(id: number): Promise<User | null> {
    const [row] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return row ?? null;
  }

  async createUser(userData: NewUser): Promise<User> {
    const [row] = await db.insert(users).values(userData).returning();
    return row;
  }

  async updateUser(
    id: number,
    data: Partial<Omit<NewUser, "id">>,
  ): Promise<User | null> {
    const [row] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return row ?? null;
  }

  async updatePassword(
    id: number,
    hashedPassword: string,
  ): Promise<User | null> {
    const [row] = await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, id))
      .returning();
    return row ?? null;
  }

  async findByThemePreference(
    theme: "light" | "dark" | "auto",
  ): Promise<User[]> {
    return db
      .select()
      .from(users)
      .where(sql`${users.preferences}->>'theme' = ${theme}`);
  }

  async findByLanguagePreference(language: string): Promise<User[]> {
    return db
      .select()
      .from(users)
      .where(sql`${users.preferences}->>'language' = ${language}`);
  }

  async findWithEmailNotificationsEnabled(): Promise<User[]> {
    return db
      .select()
      .from(users)
      .where(
        sql`(${users.preferences}->>'emailNotifications')::boolean = true`,
      );
  }

  async updatePreferences(
    id: number,
    preferences: Partial<NonNullable<User["preferences"]>>,
  ): Promise<User | null> {
    const [row] = await db
      .update(users)
      .set({
        preferences: sql`${users.preferences} || ${JSON.stringify(preferences)}::jsonb`,
      })
      .where(eq(users.id, id))
      .returning();
    return row ?? null;
  }
}

export const userRepository = new UserRepository();
export default userRepository;

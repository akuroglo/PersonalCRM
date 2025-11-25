import { type Contact, type InsertContact, contacts } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getContacts(userId: string): Promise<Contact[]>;
  getContact(id: string, userId: string): Promise<Contact | undefined>;
  createContact(contact: InsertContact, userId: string): Promise<Contact>;
  updateContact(id: string, contact: InsertContact, userId: string): Promise<Contact | undefined>;
  deleteContact(id: string, userId: string): Promise<boolean>;
}

export class DbStorage implements IStorage {
  async getContacts(userId: string): Promise<Contact[]> {
    return await db.select().from(contacts).where(eq(contacts.userId, userId));
  }

  async getContact(id: string, userId: string): Promise<Contact | undefined> {
    const result = await db.select().from(contacts).where(
      and(eq(contacts.id, id), eq(contacts.userId, userId))
    );
    return result[0];
  }

  async createContact(insertContact: InsertContact, userId: string): Promise<Contact> {
    const result = await db.insert(contacts).values({
      ...insertContact,
      userId,
    }).returning();
    return result[0];
  }

  async updateContact(id: string, insertContact: InsertContact, userId: string): Promise<Contact | undefined> {
    const result = await db.update(contacts)
      .set(insertContact)
      .where(and(eq(contacts.id, id), eq(contacts.userId, userId)))
      .returning();
    return result[0];
  }

  async deleteContact(id: string, userId: string): Promise<boolean> {
    const result = await db.delete(contacts)
      .where(and(eq(contacts.id, id), eq(contacts.userId, userId)))
      .returning();
    return result.length > 0;
  }
}

export const storage = new DbStorage();

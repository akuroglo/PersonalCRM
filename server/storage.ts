import { type Contact, type InsertContact } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getContacts(): Promise<Contact[]>;
  getContact(id: string): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: string, contact: InsertContact): Promise<Contact | undefined>;
  deleteContact(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private contacts: Map<string, Contact>;

  constructor() {
    this.contacts = new Map();
  }

  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  async getContact(id: string): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = {
      id,
      name: insertContact.name,
      birthday: insertContact.birthday ?? null,
      lastContact: insertContact.lastContact,
      reminderInterval: insertContact.reminderInterval,
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async updateContact(id: string, insertContact: InsertContact): Promise<Contact | undefined> {
    const existing = this.contacts.get(id);
    if (!existing) return undefined;
    const updated: Contact = {
      id,
      name: insertContact.name,
      birthday: insertContact.birthday ?? null,
      lastContact: insertContact.lastContact,
      reminderInterval: insertContact.reminderInterval,
    };
    this.contacts.set(id, updated);
    return updated;
  }

  async deleteContact(id: string): Promise<boolean> {
    return this.contacts.delete(id);
  }
}

export const storage = new MemStorage();

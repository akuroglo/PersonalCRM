import { 
  type Contact, type InsertContact, contacts,
  type Chat, type InsertChat, chats,
  type Message, type InsertMessage, messages
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface UserAnalytics {
  totalCostUsd: number;
  totalMessages: number;
  totalTokens: number;
  webSearchCount: number;
  chatCount: number;
  costByModel: Record<string, number>;
}

export interface IStorage {
  getContacts(userId: string): Promise<Contact[]>;
  getContact(id: string, userId: string): Promise<Contact | undefined>;
  createContact(contact: InsertContact, userId: string): Promise<Contact>;
  updateContact(id: string, contact: InsertContact, userId: string): Promise<Contact | undefined>;
  deleteContact(id: string, userId: string): Promise<boolean>;
  
  getChats(userId: string): Promise<Chat[]>;
  getChat(id: string, userId: string): Promise<Chat | undefined>;
  createChat(chat: InsertChat, userId: string): Promise<Chat>;
  updateChat(id: string, title: string, userId: string): Promise<Chat | undefined>;
  deleteChat(id: string, userId: string): Promise<boolean>;
  
  getMessages(chatId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  getUserAnalytics(userId: string): Promise<UserAnalytics>;
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

  async getChats(userId: string): Promise<Chat[]> {
    return await db.select().from(chats)
      .where(eq(chats.userId, userId))
      .orderBy(desc(chats.updatedAt));
  }

  async getChat(id: string, userId: string): Promise<Chat | undefined> {
    const result = await db.select().from(chats).where(
      and(eq(chats.id, id), eq(chats.userId, userId))
    );
    return result[0];
  }

  async createChat(insertChat: InsertChat, userId: string): Promise<Chat> {
    const result = await db.insert(chats).values({
      ...insertChat,
      userId,
    }).returning();
    return result[0];
  }

  async updateChat(id: string, title: string, userId: string): Promise<Chat | undefined> {
    const result = await db.update(chats)
      .set({ title, updatedAt: new Date() })
      .where(and(eq(chats.id, id), eq(chats.userId, userId)))
      .returning();
    return result[0];
  }

  async deleteChat(id: string, userId: string): Promise<boolean> {
    await db.delete(messages).where(eq(messages.chatId, id));
    const result = await db.delete(chats)
      .where(and(eq(chats.id, id), eq(chats.userId, userId)))
      .returning();
    return result.length > 0;
  }

  async getMessages(chatId: string): Promise<Message[]> {
    return await db.select().from(messages)
      .where(eq(messages.chatId, chatId))
      .orderBy(messages.createdAt);
  }

  async createMessage(message: InsertMessage & { costUsd?: number | string }): Promise<Message> {
    const { costUsd, ...messageData } = message;
    const result = await db.insert(messages).values({
      ...messageData,
      costUsd: costUsd ? costUsd.toString() : "0"
    } as any).returning();
    await db.update(chats)
      .set({ updatedAt: new Date() })
      .where(eq(chats.id, messageData.chatId));
    return result[0];
  }

  async getUserAnalytics(userId: string): Promise<UserAnalytics> {
    // Get all chats for user
    const userChats = await db.select().from(chats).where(eq(chats.userId, userId));
    const chatIds = userChats.map(c => c.id);

    if (chatIds.length === 0) {
      return {
        totalCostUsd: 0,
        totalMessages: 0,
        totalTokens: 0,
        webSearchCount: 0,
        chatCount: 0,
        costByModel: {},
      };
    }

    // Get all messages for these chats (excluding user messages which have no cost)
    const userMessages = await db.select().from(messages)
      .where(eq(messages.role, "assistant"));

    // Aggregate analytics
    let totalCostUsd = 0;
    let totalTokens = 0;
    let webSearchCount = 0;
    const costByModel: Record<string, number> = {};

    for (const chat of userChats) {
      const chatMessages = userMessages.filter(m => m.chatId === chat.id);
      for (const msg of chatMessages) {
        if (msg.costUsd) {
          totalCostUsd += parseFloat(msg.costUsd.toString());
        }
        totalTokens += (msg.inputTokens || 0) + (msg.outputTokens || 0);
        if (msg.webSearchUsed) {
          webSearchCount++;
        }
        if (!costByModel[chat.model]) {
          costByModel[chat.model] = 0;
        }
        if (msg.costUsd) {
          costByModel[chat.model] += parseFloat(msg.costUsd.toString());
        }
      }
    }

    return {
      totalCostUsd: Math.round(totalCostUsd * 10000) / 10000, // Round to 4 decimals
      totalMessages: userMessages.length,
      totalTokens,
      webSearchCount,
      chatCount: userChats.length,
      costByModel: Object.fromEntries(
        Object.entries(costByModel).map(([k, v]) => [
          k,
          Math.round(v * 10000) / 10000
        ])
      ),
    };
  }
}

export const storage = new DbStorage();

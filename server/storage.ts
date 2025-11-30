import { 
  type Contact, type InsertContact, contacts,
  type Chat, type InsertChat, chats,
  type Message, type InsertMessage, messages
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, inArray } from "drizzle-orm";

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
    const costValue = costUsd ? parseFloat(costUsd.toString()) : 0;
    const tokenCount = (messageData.inputTokens || 0) + (messageData.outputTokens || 0);
    
    const result = await db.insert(messages).values({
      ...messageData,
      costUsd: costValue.toString()
    } as any).returning();
    
    // Update chat totals for assistant messages (which have cost)
    if (messageData.role === "assistant") {
      const chat = await db.select().from(chats).where(eq(chats.id, messageData.chatId));
      if (chat[0]) {
        const currentCost = parseFloat(chat[0].totalCost?.toString() || "0");
        const currentTokens = chat[0].totalTokens || 0;
        const currentCount = chat[0].messageCount || 0;
        
        await db.update(chats)
          .set({ 
            updatedAt: new Date(),
            totalCost: (currentCost + costValue).toString(),
            totalTokens: currentTokens + tokenCount,
            messageCount: currentCount + 1,
          })
          .where(eq(chats.id, messageData.chatId));
      }
    } else {
      await db.update(chats)
        .set({ updatedAt: new Date() })
        .where(eq(chats.id, messageData.chatId));
    }
    
    return result[0];
  }

  async getUserAnalytics(userId: string): Promise<UserAnalytics> {
    const emptyResult: UserAnalytics = {
      totalCostUsd: 0,
      totalMessages: 0,
      totalTokens: 0,
      webSearchCount: 0,
      chatCount: 0,
      costByModel: {},
    };

    // Return empty if no userId
    if (!userId) {
      return emptyResult;
    }

    // Get all chats for user with their accumulated totals
    const userChats = await db.select().from(chats).where(eq(chats.userId, userId));

    if (userChats.length === 0) {
      return emptyResult;
    }

    // Aggregate from chat totals (faster than querying all messages)
    let totalCostUsd = 0;
    let totalTokens = 0;
    let totalMessages = 0;
    const costByModel: Record<string, number> = {};

    for (const chat of userChats) {
      const chatCost = parseFloat(chat.totalCost?.toString() || "0");
      totalCostUsd += chatCost;
      totalTokens += chat.totalTokens || 0;
      totalMessages += chat.messageCount || 0;

      if (!costByModel[chat.model]) {
        costByModel[chat.model] = 0;
      }
      costByModel[chat.model] += chatCost;
    }

    // Count web search usage from messages (single efficient query)
    const chatIds = userChats.map(c => c.id).filter(Boolean);
    let webSearchCount = 0;
    
    if (chatIds.length > 0) {
      const webSearchMessages = await db.select().from(messages)
        .where(and(
          eq(messages.role, "assistant"),
          eq(messages.webSearchUsed, true),
          inArray(messages.chatId, chatIds as [string, ...string[]])
        ));
      webSearchCount = webSearchMessages.length;
    }

    return {
      totalCostUsd: Math.round(totalCostUsd * 1000000) / 1000000,
      totalMessages,
      totalTokens,
      webSearchCount,
      chatCount: userChats.length,
      costByModel: Object.fromEntries(
        Object.entries(costByModel)
          .filter(([, v]) => v > 0)
          .map(([k, v]) => [k, Math.round(v * 1000000) / 1000000])
      ),
    };
  }
}

export const storage = new DbStorage();

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertChatSchema, insertMessageSchema } from "@shared/schema";
import { authMiddleware } from "./middleware/auth";
import { z } from "zod";
import { generateChatResponse, AVAILABLE_MODELS } from "./openrouter";

export async function registerRoutes(app: Express): Promise<Server> {
  // Config endpoint - returns Supabase configuration
  app.get("/api/config", (_req, res) => {
    res.json({
      supabaseUrl: process.env.VITE_SUPABASE_URL,
      supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY,
    });
  });

  // Apply auth middleware to all /api/contacts routes
  app.use("/api/contacts", authMiddleware);

  // Get all contacts
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts(req.userId!);
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  // Get single contact
  app.get("/api/contacts/:id", async (req, res) => {
    try {
      const contact = await storage.getContact(req.params.id, req.userId!);
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contact" });
    }
  });

  // Create contact
  app.post("/api/contacts", async (req, res) => {
    try {
      const data = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(data, req.userId!);
      res.status(201).json(contact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating contact:", error);
      res.status(500).json({ error: "Failed to create contact" });
    }
  });

  // Update contact
  app.put("/api/contacts/:id", async (req, res) => {
    try {
      const data = insertContactSchema.parse(req.body);
      const contact = await storage.updateContact(req.params.id, data, req.userId!);
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update contact" });
    }
  });

  // Delete contact
  app.delete("/api/contacts/:id", async (req, res) => {
    try {
      const success = await storage.deleteContact(req.params.id, req.userId!);
      if (!success) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete contact" });
    }
  });

  // Chat routes
  app.use("/api/chats", authMiddleware);

  // Get available models with pricing and capabilities
  app.get("/api/models", (_req, res) => {
    res.json(AVAILABLE_MODELS.map(model => ({
      id: model.id,
      name: model.name,
      provider: model.provider,
      pricing: model.pricing,
      supportsWebSearch: model.supportsWebSearch,
      description: model.description,
      contextWindow: model.contextWindow,
    })));
  });

  // Get all chats
  app.get("/api/chats", async (req, res) => {
    try {
      const userChats = await storage.getChats(req.userId!);
      res.json(userChats);
    } catch (error) {
      console.error("Error fetching chats:", error);
      res.status(500).json({ error: "Failed to fetch chats" });
    }
  });

  // Get single chat with messages
  app.get("/api/chats/:id", async (req, res) => {
    try {
      const chat = await storage.getChat(req.params.id, req.userId!);
      if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
      }
      const chatMessages = await storage.getMessages(req.params.id);
      res.json({ ...chat, messages: chatMessages });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat" });
    }
  });

  // Create chat
  app.post("/api/chats", async (req, res) => {
    try {
      const data = insertChatSchema.parse(req.body);
      const chat = await storage.createChat(data, req.userId!);
      res.status(201).json(chat);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating chat:", error);
      res.status(500).json({ error: "Failed to create chat" });
    }
  });

  // Update chat title
  app.put("/api/chats/:id", async (req, res) => {
    try {
      const { title } = req.body;
      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }
      const chat = await storage.updateChat(req.params.id, title, req.userId!);
      if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
      }
      res.json(chat);
    } catch (error) {
      res.status(500).json({ error: "Failed to update chat" });
    }
  });

  // Delete chat
  app.delete("/api/chats/:id", async (req, res) => {
    try {
      const success = await storage.deleteChat(req.params.id, req.userId!);
      if (!success) {
        return res.status(404).json({ error: "Chat not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete chat" });
    }
  });

  // Send message and get AI response
  app.post("/api/chats/:id/messages", async (req, res) => {
    try {
      const chat = await storage.getChat(req.params.id, req.userId!);
      if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
      }

      const { content } = req.body;
      if (!content) {
        return res.status(400).json({ error: "Content is required" });
      }

      // Save user message
      const userMessage = await storage.createMessage({
        chatId: req.params.id,
        role: "user",
        content,
      });

      // Get chat history for context
      const chatMessages = await storage.getMessages(req.params.id);
      const messagesForAI = chatMessages.map(m => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
      }));

      // Generate AI response
      const aiResponse = await generateChatResponse(messagesForAI, chat.model);

      // Save AI response
      const assistantMessage = await storage.createMessage({
        chatId: req.params.id,
        role: "assistant",
        content: aiResponse,
      });

      res.json({ userMessage, assistantMessage });
    } catch (error: any) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: error.message || "Failed to send message" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

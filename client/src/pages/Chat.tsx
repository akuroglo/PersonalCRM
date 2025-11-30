import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { 
  Plus, 
  Send, 
  MessageSquare, 
  Trash2, 
  ArrowLeft,
  Loader2,
  Bot,
  User,
  Globe,
} from "lucide-react";
import type { Chat, Message } from "@shared/schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

interface Model {
  id: string;
  name: string;
  provider: string;
  pricing: { input: number; output: number };
  supportsWebSearch: boolean;
  description: string;
  contextWindow?: number;
}

interface ChatWithMessages extends Chat {
  messages: Message[];
}

export default function ChatPage() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");
  const [newChatModel, setNewChatModel] = useState("openai/gpt-4o-mini");
  const [enableWebSearch, setEnableWebSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: models = [] } = useQuery<Model[]>({
    queryKey: ["/api/models"],
  });

  const { data: chats = [], isLoading: chatsLoading } = useQuery<Chat[]>({
    queryKey: ["/api/chats"],
  });

  const { data: currentChat, isLoading: chatLoading } = useQuery<ChatWithMessages>({
    queryKey: ["/api/chats", selectedChatId],
    enabled: !!selectedChatId,
  });

  const createChatMutation = useMutation({
    mutationFn: (data: { title: string; model: string; enableWebSearch: boolean }) =>
      apiRequest("POST", "/api/chats", data),
    onSuccess: async (response) => {
      const newChat = await response.json();
      queryClient.invalidateQueries({ queryKey: ["/api/chats"] });
      setSelectedChatId(newChat.id);
      setIsNewChatOpen(false);
      setNewChatTitle("");
      toast({
        title: "Чат создан",
        description: "Новый чат успешно создан",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось создать чат",
        variant: "destructive",
      });
    },
  });

  const deleteChatMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/chats/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chats"] });
      if (selectedChatId) {
        setSelectedChatId(null);
      }
      toast({
        title: "Чат удален",
        description: "Чат успешно удален",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить чат",
        variant: "destructive",
      });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: ({ chatId, content }: { chatId: string; content: string }) =>
      apiRequest("POST", `/api/chats/${chatId}/messages`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chats", selectedChatId] });
      setMessageInput("");
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось отправить сообщение",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages]);

  const handleCreateChat = () => {
    if (!newChatTitle.trim()) return;
    createChatMutation.mutate({ title: newChatTitle, model: newChatModel, enableWebSearch });
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChatId) return;
    sendMessageMutation.mutate({ chatId: selectedChatId, content: messageInput });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getModelName = (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    return model?.name || modelId;
  };

  const getCurrentModel = () => {
    return models.find(m => m.id === newChatModel);
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    if (price < 1) return `$${(price * 1000).toFixed(2)}/1K`;
    return `$${price.toFixed(2)}/1M`;
  };

  const sidebarStyle = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "3rem",
  };

  if (chatsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <Link href="/">
                <Button variant="ghost" size="sm" data-testid="link-back-home">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад
                </Button>
              </Link>
            </div>
            <Button 
              className="w-full" 
              onClick={() => setIsNewChatOpen(true)}
              data-testid="button-new-chat"
            >
              <Plus className="w-4 h-4 mr-2" />
              Новый чат
            </Button>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <div className="space-y-1">
                  {chats.length === 0 ? (
                    <div className="text-center py-8 px-4 text-muted-foreground text-sm">
                      Нет чатов. Создайте первый!
                    </div>
                  ) : (
                    chats.map((chat) => {
                      const chatCost = parseFloat(chat.totalCost?.toString() || "0");
                      return (
                        <div
                          key={chat.id}
                          className="group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors hover-elevate"
                          onClick={() => setSelectedChatId(chat.id)}
                          data-testid={`chat-item-${chat.id}`}
                        >
                          <MessageSquare
                            className={cn(
                              "w-4 h-4 flex-shrink-0",
                              selectedChatId === chat.id ? "text-primary" : "text-muted-foreground"
                            )}
                          />
                          <div
                            className={cn(
                              "flex-1 min-w-0",
                              selectedChatId === chat.id ? "text-primary" : ""
                            )}
                          >
                            <p className="text-sm font-medium truncate">{chat.title}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="truncate">{getModelName(chat.model)}</span>
                              {chatCost > 0 && (
                                <span className="flex-shrink-0 text-primary/70">
                                  ${chatCost.toFixed(4)}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteChatMutation.mutate(chat.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover-elevate rounded transition-opacity"
                            data-testid={`button-delete-chat-${chat.id}`}
                            title="Удалить чат"
                          >
                            <Trash2 className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t">
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col flex-1">
          <header className="h-14 border-b flex items-center px-4 gap-4">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            {selectedChatId && currentChat && (
              <>
                <h1 className="text-lg font-semibold" data-testid="text-chat-title">
                  {currentChat.title}
                </h1>
                <span className="text-sm text-muted-foreground">
                  {getModelName(currentChat.model)}
                </span>
                {currentChat.enableWebSearch && (
                  <span className="flex items-center gap-1 text-xs text-primary/70">
                    <Globe className="w-3 h-3" />
                    Web
                  </span>
                )}
                {parseFloat(currentChat.totalCost?.toString() || "0") > 0 && (
                  <span className="text-sm font-medium text-primary" data-testid="text-chat-cost">
                    ${parseFloat(currentChat.totalCost?.toString() || "0").toFixed(4)}
                  </span>
                )}
              </>
            )}
          </header>

          <main className="flex-1 overflow-hidden flex flex-col">
            {!selectedChatId ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4 max-w-md px-6">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                    <Bot className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold">AI Ассистент</h2>
                  <p className="text-muted-foreground">
                    Начните общение с искусственным интеллектом. Выберите существующий чат из списка слева или создайте новый.
                  </p>
                  <Button 
                    size="lg"
                    onClick={() => setIsNewChatOpen(true)} 
                    data-testid="button-create-first-chat"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Создать чат
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <ScrollArea className="flex-1 p-6">
                  {chatLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : currentChat?.messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-muted-foreground max-w-sm">
                        <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">Начните диалог</p>
                        <p className="text-sm">Введите сообщение ниже, чтобы начать общение с AI ассистентом</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6 max-w-3xl mx-auto">
                      {currentChat?.messages.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            "flex gap-4",
                            message.role === "assistant" ? "items-start" : "items-start flex-row-reverse"
                          )}
                          data-testid={`message-${message.id}`}
                        >
                          <div
                            className={cn(
                              "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
                              message.role === "assistant"
                                ? "bg-primary/10 text-primary"
                                : "bg-muted"
                            )}
                          >
                            {message.role === "assistant" ? (
                              <Bot className="w-5 h-5" />
                            ) : (
                              <User className="w-5 h-5" />
                            )}
                          </div>
                          <div
                            className={cn(
                              "flex-1 rounded-xl p-4 max-w-[80%]",
                              message.role === "assistant"
                                ? "bg-muted"
                                : "bg-primary text-primary-foreground ml-auto"
                            )}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          </div>
                        </div>
                      ))}
                      {sendMessageMutation.isPending && (
                        <div className="flex gap-4 items-start">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-primary/10 text-primary">
                            <Bot className="w-5 h-5" />
                          </div>
                          <div className="bg-muted rounded-xl p-4">
                            <Loader2 className="w-5 h-5 animate-spin" />
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>

                <div className="border-t p-4">
                  <div className="max-w-3xl mx-auto flex gap-3">
                    <Input
                      placeholder="Введите сообщение..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={sendMessageMutation.isPending}
                      className="flex-1"
                      data-testid="input-message"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim() || sendMessageMutation.isPending}
                      data-testid="button-send-message"
                    >
                      {sendMessageMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Новый чат</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Название чата</label>
              <Input
                placeholder="Например: Помощь с кодом"
                value={newChatTitle}
                onChange={(e) => setNewChatTitle(e.target.value)}
                data-testid="input-new-chat-title"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Модель</label>
              <Select value={newChatModel} onValueChange={setNewChatModel}>
                <SelectTrigger data-testid="select-model">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-96">
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex items-center gap-2">
                        <span>{model.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({formatPrice(model.pricing.input)})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getCurrentModel() && (
                <div className="p-3 bg-muted rounded-lg border border-border text-sm space-y-2">
                  <p><strong>{getCurrentModel()?.provider}</strong> • {getCurrentModel()?.description}</p>
                  <div className="flex gap-3 flex-wrap text-xs">
                    <div>
                      <p className="text-muted-foreground">Input</p>
                      <p className="font-medium">{formatPrice(getCurrentModel()?.pricing.input || 0)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Output</p>
                      <p className="font-medium">{formatPrice(getCurrentModel()?.pricing.output || 0)}</p>
                    </div>
                    {getCurrentModel()?.contextWindow && (
                      <div>
                        <p className="text-muted-foreground">Context</p>
                        <p className="font-medium">{(getCurrentModel()?.contextWindow || 0) / 1000}K</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {getCurrentModel()?.supportsWebSearch && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg border border-border">
                <input
                  type="checkbox"
                  id="web-search"
                  checked={enableWebSearch}
                  onChange={(e) => setEnableWebSearch(e.target.checked)}
                  className="rounded"
                  data-testid="checkbox-web-search"
                />
                <label htmlFor="web-search" className="text-sm font-medium flex-1 cursor-pointer flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  Включить веб-поиск
                  <span className="text-xs text-muted-foreground">(+$0.02/запрос)</span>
                </label>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewChatOpen(false)}
              data-testid="button-cancel-new-chat"
            >
              Отмена
            </Button>
            <Button
              onClick={handleCreateChat}
              disabled={!newChatTitle.trim() || createChatMutation.isPending}
              data-testid="button-create-chat"
            >
              {createChatMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Создать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}

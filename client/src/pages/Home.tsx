import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContactCard } from "@/components/ContactCard";
import { ContactForm } from "@/components/ContactForm";
import { EmptyState } from "@/components/EmptyState";
import { Plus, Search, LogOut, MessageSquare, Settings, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import type { Contact, InsertContact } from "@shared/schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "lastContact" | "reminder">("reminder");
  const { toast } = useToast();
  const { signOut, user } = useAuth();

  const { data: contacts = [], isLoading } = useQuery<Contact[]>({
    queryKey: ["/api/contacts"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertContact) => 
      apiRequest("POST", "/api/contacts", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      setIsFormOpen(false);
      toast({
        title: "Контакт добавлен",
        description: "Контакт успешно добавлен в список",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить контакт",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: InsertContact }) =>
      apiRequest("PUT", `/api/contacts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      setIsFormOpen(false);
      setEditingContact(undefined);
      toast({
        title: "Контакт обновлен",
        description: "Изменения успешно сохранены",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить контакт",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest("DELETE", `/api/contacts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      toast({
        title: "Контакт удален",
        description: "Контакт успешно удален из списка",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить контакт",
        variant: "destructive",
      });
    },
  });

  const handleAddContact = (data: InsertContact) => {
    createMutation.mutate(data);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setIsFormOpen(true);
  };

  const handleUpdateContact = (data: InsertContact) => {
    if (editingContact) {
      updateMutation.mutate({ id: editingContact.id, data });
    }
  };

  const handleDeleteContact = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingContact(undefined);
  };

  const filteredAndSortedContacts = contacts
    .filter((contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "lastContact") {
        return new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime();
      } else {
        const aNextReminder = new Date(a.lastContact).getTime() + a.reminderInterval * 24 * 60 * 60 * 1000;
        const bNextReminder = new Date(b.lastContact).getTime() + b.reminderInterval * 24 * 60 * 60 * 1000;
        return aNextReminder - bNextReminder;
      }
    });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold" data-testid="text-app-title">Личная CRM</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block" data-testid="text-user-email">
              {user?.email}
            </span>
            <Link href="/analytics">
              <Button variant="ghost" size="icon" data-testid="link-analytics" title="Аналитика">
                <TrendingUp className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" size="icon" data-testid="link-settings" title="Настройки">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="outline" data-testid="link-chat">
                <MessageSquare className="w-4 h-4 mr-2" />
                AI Чат
              </Button>
            </Link>
            <Button onClick={() => setIsFormOpen(true)} data-testid="button-add-contact">
              <Plus className="w-4 h-4 mr-2" />
              Добавить
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => signOut()}
              data-testid="button-logout"
              title="Выйти"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {contacts.length === 0 ? (
          <EmptyState onAddContact={() => setIsFormOpen(true)} />
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск контактов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="input-search"
                />
              </div>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-full sm:w-48" data-testid="select-sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reminder">По напоминаниям</SelectItem>
                  <SelectItem value="name">По имени</SelectItem>
                  <SelectItem value="lastContact">По дате контакта</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAndSortedContacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onEdit={handleEditContact}
                  onDelete={handleDeleteContact}
                />
              ))}
            </div>

            {filteredAndSortedContacts.length === 0 && searchQuery && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Контакты не найдены</p>
              </div>
            )}
          </div>
        )}
      </main>

      <ContactForm
        open={isFormOpen}
        onOpenChange={handleCloseForm}
        onSubmit={editingContact ? handleUpdateContact : handleAddContact}
        contact={editingContact}
      />
    </div>
  );
}

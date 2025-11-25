import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContactCard } from "@/components/ContactCard";
import { ContactForm } from "@/components/ContactForm";
import { EmptyState } from "@/components/EmptyState";
import { Plus, Search } from "lucide-react";
import type { Contact, InsertContact } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  // TODO: remove mock functionality - replace with API calls
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Анна Иванова",
      birthday: "1990-05-15",
      lastContact: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      reminderInterval: 7,
    },
    {
      id: "2",
      name: "Петр Сидоров",
      birthday: "1985-08-22",
      lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      reminderInterval: 14,
    },
    {
      id: "3",
      name: "Мария Петрова",
      birthday: null,
      lastContact: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      reminderInterval: 5,
    },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "lastContact" | "reminder">("reminder");

  const handleAddContact = (data: InsertContact) => {
    // TODO: remove mock functionality - replace with API call
    const newContact: Contact = {
      id: Math.random().toString(),
      name: data.name,
      birthday: data.birthday ?? null,
      lastContact: data.lastContact,
      reminderInterval: data.reminderInterval,
    };
    setContacts([...contacts, newContact]);
    setIsFormOpen(false);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setIsFormOpen(true);
  };

  const handleUpdateContact = (data: InsertContact) => {
    // TODO: remove mock functionality - replace with API call
    if (editingContact) {
      setContacts(
        contacts.map((c) =>
          c.id === editingContact.id ? { ...c, ...data } : c
        )
      );
      setIsFormOpen(false);
      setEditingContact(undefined);
    }
  };

  const handleDeleteContact = (id: string) => {
    // TODO: remove mock functionality - replace with API call
    setContacts(contacts.filter((c) => c.id !== id));
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

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold" data-testid="text-app-title">Личная CRM</h1>
          <Button onClick={() => setIsFormOpen(true)} data-testid="button-add-contact">
            <Plus className="w-4 h-4 mr-2" />
            Добавить
          </Button>
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

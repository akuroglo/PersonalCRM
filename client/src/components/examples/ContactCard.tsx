import { ContactCard } from "../ContactCard";
import type { Contact } from "@shared/schema";

export default function ContactCardExample() {
  const contact: Contact = {
    id: "1",
    name: "Анна Иванова",
    birthday: "1990-05-15",
    lastContact: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    reminderInterval: 7,
  };

  return (
    <div className="p-6 bg-background">
      <div className="max-w-sm">
        <ContactCard
          contact={contact}
          onEdit={(contact) => console.log("Edit", contact)}
          onDelete={(id) => console.log("Delete", id)}
        />
      </div>
    </div>
  );
}

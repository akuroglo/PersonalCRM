import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Pencil, Trash2 } from "lucide-react";
import { formatDistanceToNow, differenceInDays, format } from "date-fns";
import { ru } from "date-fns/locale";
import type { Contact } from "@shared/schema";

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

export function ContactCard({ contact, onEdit, onDelete }: ContactCardProps) {
  const lastContactDate = new Date(contact.lastContact);
  const nextReminderDate = new Date(lastContactDate);
  nextReminderDate.setDate(nextReminderDate.getDate() + contact.reminderInterval);
  
  const daysUntilReminder = differenceInDays(nextReminderDate, new Date());
  const isOverdue = daysUntilReminder < 0;
  const isSoon = daysUntilReminder >= 0 && daysUntilReminder <= 3;

  const getBirthdayInfo = () => {
    if (!contact.birthday) return null;
    const birthday = new Date(contact.birthday);
    const today = new Date();
    const age = today.getFullYear() - birthday.getFullYear();
    return { age, date: format(birthday, "d MMMM", { locale: ru }) };
  };

  const birthdayInfo = getBirthdayInfo();

  return (
    <Card className="p-6 hover-elevate active-elevate-2 transition-all">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold truncate" data-testid={`text-name-${contact.id}`}>
                {contact.name}
              </h3>
            </div>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onEdit(contact)}
              data-testid={`button-edit-${contact.id}`}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(contact.id)}
              data-testid={`button-delete-${contact.id}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {birthdayInfo && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span className="truncate" data-testid={`text-birthday-${contact.id}`}>
                {birthdayInfo.date} ({birthdayInfo.age} лет)
              </span>
            </div>
          )}
          
          <div className="text-sm text-muted-foreground" data-testid={`text-last-contact-${contact.id}`}>
            Последний контакт:{" "}
            <span className="text-foreground">
              {formatDistanceToNow(lastContactDate, { addSuffix: true, locale: ru })}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Напомнить:</span>
            {isOverdue ? (
              <Badge variant="destructive" data-testid={`badge-reminder-${contact.id}`}>
                Просрочено на {Math.abs(daysUntilReminder)} дн.
              </Badge>
            ) : isSoon ? (
              <Badge className="bg-amber-500 text-white" data-testid={`badge-reminder-${contact.id}`}>
                Через {daysUntilReminder} дн.
              </Badge>
            ) : (
              <Badge variant="secondary" data-testid={`badge-reminder-${contact.id}`}>
                Через {daysUntilReminder} дн.
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

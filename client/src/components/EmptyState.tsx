import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface EmptyStateProps {
  onAddContact: () => void;
}

export function EmptyState({ onAddContact }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
        <UserPlus className="w-8 h-8 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">Нет контактов</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Начните управлять своими контактами. Добавьте первый контакт и настройте напоминания.
      </p>
      <Button onClick={onAddContact} data-testid="button-add-first-contact">
        <UserPlus className="w-4 h-4 mr-2" />
        Добавить первый контакт
      </Button>
    </div>
  );
}

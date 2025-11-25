import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactSchema, type Contact, type InsertContact } from "@shared/schema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useEffect } from "react";

const formSchema = insertContactSchema.extend({
  name: z.string().min(1, "Имя обязательно"),
  lastContact: z.string().min(1, "Дата последнего контакта обязательна"),
  reminderInterval: z.coerce.number().min(1, "Интервал должен быть больше 0"),
  birthday: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ContactFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InsertContact) => void;
  contact?: Contact;
}

export function ContactForm({ open, onOpenChange, onSubmit, contact }: ContactFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: contact?.name || "",
      birthday: contact?.birthday || "",
      lastContact: contact?.lastContact || new Date().toISOString().split('T')[0],
      reminderInterval: contact?.reminderInterval || 7,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: contact?.name || "",
        birthday: contact?.birthday || "",
        lastContact: contact?.lastContact || new Date().toISOString().split('T')[0],
        reminderInterval: contact?.reminderInterval || 7,
      });
    }
  }, [open, contact, form]);

  const handleSubmit = (data: FormValues) => {
    onSubmit({
      ...data,
      birthday: data.birthday || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="dialog-contact-form">
        <DialogHeader>
          <DialogTitle>{contact ? "Редактировать контакт" : "Добавить контакт"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя *</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите имя" {...field} data-testid="input-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthday"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дата рождения</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} data-testid="input-birthday" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Последний контакт *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} data-testid="input-last-contact" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reminderInterval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Напомнить через (дней) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      placeholder="7" 
                      {...field} 
                      data-testid="input-reminder-interval"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel"
              >
                Отмена
              </Button>
              <Button type="submit" data-testid="button-submit">
                {contact ? "Сохранить" : "Добавить"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ForgotPassword() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?type=recovery`,
      });

      if (error) {
        toast({
          title: "Ошибка",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setSent(true);
        toast({
          title: "Письмо отправлено",
          description: "Проверьте вашу почту для восстановления пароля",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">Письмо отправлено</CardTitle>
            <CardDescription>
              Мы отправили ссылку для восстановления пароля на {email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Проверьте папку со спамом, если вы не видите письмо.
            </p>
            <Button
              onClick={() => setLocation("/auth")}
              variant="outline"
              className="w-full"
              data-testid="button-back-to-login"
            >
              Вернуться на вход
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Восстановление пароля</CardTitle>
          <CardDescription>
            Введите email для получения ссылки восстановления
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="input-recovery-email"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              data-testid="button-send-recovery"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Отправить ссылку
            </Button>
          </form>

          <div className="mt-4">
            <Button
              variant="ghost"
              onClick={() => setLocation("/auth")}
              className="w-full flex items-center justify-center gap-2"
              data-testid="button-back-to-auth"
            >
              <ArrowLeft className="w-4 h-4" />
              Вернуться на вход
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

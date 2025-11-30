import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="link-back-settings">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Настройки</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Профиль */}
          <section>
            <h2 className="text-lg font-semibold mb-4" data-testid="text-section-profile">
              Профиль
            </h2>
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="font-medium" data-testid="text-user-email-settings">
                    {user?.email}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">ID пользователя</p>
                  <p className="font-mono text-sm break-all" data-testid="text-user-id">
                    {user?.id}
                  </p>
                </div>
              </div>
            </Card>
          </section>

          {/* Интеграции */}
          <section>
            <h2 className="text-lg font-semibold mb-4" data-testid="text-section-integrations">
              Интеграции
            </h2>
            <Card className="p-6">
              <div className="space-y-4">
                {/* OpenRouter */}
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <CheckCircle2 className="w-5 h-5 text-green-600" data-testid="icon-openrouter-status" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold" data-testid="text-openrouter-title">
                      OpenRouter AI (Multi-Model)
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Доступ к множеству моделей ИИ (GPT-4, Claude, Llama и другие)
                    </p>
                    <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        ✓ Интеграция настроена автоматически
                      </p>
                      <div className="text-xs text-green-800 dark:text-green-200 mt-2 space-y-1">
                        <p><strong>API ключ:</strong> Управляется Replit AI Integrations</p>
                        <p><strong>Бильинг:</strong> Через Replit credits (не требует ввода ключа)</p>
                        <p><strong>Статус:</strong> Готов к использованию</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Supabase */}
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <CheckCircle2 className="w-5 h-5 text-green-600" data-testid="icon-supabase-status" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold" data-testid="text-supabase-title">
                      Supabase Auth & Database
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Безопасная аутентификация и хранение данных
                    </p>
                    <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        ✓ Подключено
                      </p>
                      <div className="text-xs text-green-800 dark:text-green-200 mt-2 space-y-1">
                        <p><strong>Хранилище:</strong> PostgreSQL (Supabase)</p>
                        <p><strong>Аутентификация:</strong> Email + пароль через Supabase Auth</p>
                        <p><strong>Данные:</strong> Все контакты, чаты и сообщения в защищённой БД</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Информация */}
          <section>
            <h2 className="text-lg font-semibold mb-4" data-testid="text-section-info">
              Информация
            </h2>
            <Card className="p-6">
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Версия приложения</p>
                  <p className="font-medium">1.0.0</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Язык интерфейса</p>
                  <p className="font-medium">Русский</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Дизайн</p>
                  <p className="font-medium">Apple Human Interface Guidelines</p>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}

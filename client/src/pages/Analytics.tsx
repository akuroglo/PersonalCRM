import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, MessageSquare, Zap, Search } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface UserAnalytics {
  totalCostUsd: number;
  totalMessages: number;
  totalTokens: number;
  webSearchCount: number;
  chatCount: number;
  costByModel: Record<string, number>;
}

const MODEL_NAMES: Record<string, string> = {
  "openai/gpt-4o": "GPT-4o",
  "anthropic/claude-3.5-sonnet": "Claude 3.5 Sonnet",
  "openai/gpt-4o-mini": "GPT-4o Mini",
  "google/gemini-2.0-flash-001": "Gemini 2.0 Flash",
  "anthropic/claude-3-haiku": "Claude 3 Haiku",
  "meta-llama/llama-3.3-70b-instruct": "Llama 3.3 70B",
  "mistralai/mistral-large-2411": "Mistral Large",
  "deepseek/deepseek-chat": "DeepSeek Chat",
  "qwen/qwen-2.5-72b-instruct": "Qwen 2.5 72B",
  "google/gemini-1.5-flash": "Gemini 1.5 Flash",
};

export default function AnalyticsPage() {
  const { data: analytics, isLoading } = useQuery<UserAnalytics>({
    queryKey: ["/api/analytics"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const sortedModels = analytics
    ? Object.entries(analytics.costByModel)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
    : [];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="link-back-analytics">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Аналитика расходов</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Total Cost */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Всего потрачено</p>
                <p className="text-3xl font-bold" data-testid="text-total-cost">
                  ${analytics?.totalCostUsd.toFixed(4) || "0.0000"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          {/* Total Messages */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Всего сообщений</p>
                <p className="text-3xl font-bold" data-testid="text-total-messages">
                  {analytics?.totalMessages || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          {/* Total Tokens */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Всего токенов</p>
                <p className="text-3xl font-bold" data-testid="text-total-tokens">
                  {(analytics?.totalTokens || 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          {/* Web Search Count */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Используется веб-поиск</p>
                <p className="text-3xl font-bold" data-testid="text-web-search-count">
                  {analytics?.webSearchCount || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Search className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>
        </div>

        {/* Cost by Model */}
        {sortedModels.length > 0 && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4" data-testid="text-cost-by-model">
              Расходы по моделям
            </h2>
            <div className="space-y-3">
              {sortedModels.map(([modelId, cost]) => (
                <div key={modelId} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium" data-testid={`text-model-${modelId}`}>
                    {MODEL_NAMES[modelId] || modelId}
                  </span>
                  <span className="text-sm font-semibold text-primary">
                    ${(cost as number).toFixed(4)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Summary */}
        <Card className="p-6 mt-8 bg-muted/50">
          <h2 className="text-lg font-semibold mb-3">Сводка</h2>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>Активных чатов: <strong>{analytics?.chatCount || 0}</strong></p>
            <p>Среднее сообщение: <strong>${((analytics?.totalCostUsd || 0) / (analytics?.totalMessages || 1)).toFixed(6)}</strong></p>
            <p>Средний запрос: <strong>${((analytics?.totalCostUsd || 0) / Math.max((analytics?.webSearchCount || 0), 1)).toFixed(4)}</strong> (с учётом веб-поиска)</p>
          </div>
        </Card>
      </main>
    </div>
  );
}

import OpenAI from "openai";

const openrouter = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENROUTER_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENROUTER_API_KEY
});

export interface ModelInfo {
  id: string;
  name: string;
  pricing: {
    input: number;  // $ per 1M tokens
    output: number; // $ per 1M tokens
  };
  provider: string;
  supportsWebSearch: boolean;
  description: string;
  contextWindow?: number;
}

// Top 10 popular OpenRouter models with pricing (2025)
export const AVAILABLE_MODELS: ModelInfo[] = [
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    pricing: { input: 5, output: 15 },
    supportsWebSearch: true,
    description: "Most capable model, ideal for complex tasks",
    contextWindow: 128000,
  },
  {
    id: "anthropic/claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    pricing: { input: 3, output: 15 },
    supportsWebSearch: true,
    description: "Excellent reasoning and analysis, very popular",
    contextWindow: 200000,
  },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "OpenAI",
    pricing: { input: 0.15, output: 0.6 },
    supportsWebSearch: true,
    description: "Fast and efficient, great for most tasks",
    contextWindow: 128000,
  },
  {
    id: "google/gemini-2.0-flash-001",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    pricing: { input: 0.075, output: 0.3 },
    supportsWebSearch: true,
    description: "Very fast and cost-effective",
    contextWindow: 1000000,
  },
  {
    id: "anthropic/claude-3-haiku",
    name: "Claude 3 Haiku",
    provider: "Anthropic",
    pricing: { input: 0.25, output: 1.25 },
    supportsWebSearch: true,
    description: "Fast and budget-friendly Claude variant",
    contextWindow: 200000,
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct",
    name: "Llama 3.3 70B",
    provider: "Meta",
    pricing: { input: 0.65, output: 2.6 },
    supportsWebSearch: true,
    description: "Open-source, high-quality reasoning",
    contextWindow: 8000,
  },
  {
    id: "mistralai/mistral-large-2411",
    name: "Mistral Large",
    provider: "Mistral AI",
    pricing: { input: 2.7, output: 8.1 },
    supportsWebSearch: true,
    description: "Strong reasoning and multi-language support",
    contextWindow: 32000,
  },
  {
    id: "deepseek/deepseek-chat",
    name: "DeepSeek Chat",
    provider: "DeepSeek",
    pricing: { input: 0, output: 0 },
    supportsWebSearch: true,
    description: "Free model, good quality for cost",
    contextWindow: 4000,
  },
  {
    id: "qwen/qwen-2.5-72b-instruct",
    name: "Qwen 2.5 72B",
    provider: "Alibaba",
    pricing: { input: 0.65, output: 2.6 },
    supportsWebSearch: true,
    description: "Strong Chinese and multilingual support",
    contextWindow: 32768,
  },
  {
    id: "google/gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    provider: "Google",
    pricing: { input: 0.075, output: 0.3 },
    supportsWebSearch: true,
    description: "Cost-effective with large context window",
    contextWindow: 1000000,
  },
];

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function generateChatResponse(
  messages: ChatMessage[],
  model: string = "openai/gpt-4o-mini",
  enableWebSearch: boolean = false
): Promise<string> {
  try {
    const modelId = enableWebSearch && model.includes(":") === false 
      ? `${model}:online` 
      : model;

    const response = await openrouter.chat.completions.create({
      model: modelId,
      messages: messages,
      max_tokens: 8192,
    } as any);

    return response.choices[0]?.message?.content || "";
  } catch (error: any) {
    console.error("OpenRouter API error:", error);
    throw new Error(`Failed to generate response: ${error.message}`);
  }
}

export async function generateStreamingResponse(
  messages: ChatMessage[],
  model: string = "openai/gpt-4o-mini",
  enableWebSearch: boolean = false
) {
  const modelId = enableWebSearch && model.includes(":") === false 
    ? `${model}:online` 
    : model;

  return await openrouter.chat.completions.create({
    model: modelId,
    messages: messages,
    max_tokens: 8192,
    stream: true,
  } as any);
}

// Calculate cost per message
export function calculateMessageCost(
  model: string,
  inputTokens: number,
  outputTokens: number,
  enableWebSearch: boolean = false
): number {
  const modelInfo = AVAILABLE_MODELS.find(m => m.id === model);
  if (!modelInfo) return 0;

  let cost = (inputTokens / 1000000) * modelInfo.pricing.input +
    (outputTokens / 1000000) * modelInfo.pricing.output;

  // Add web search cost: $4 per 1000 results, default 5 results per request
  if (enableWebSearch) {
    cost += 0.02; // Approximate: 5 results * ($4 / 1000) = $0.02
  }

  return cost;
}

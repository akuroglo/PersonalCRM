import OpenAI from "openai";

const openrouter = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENROUTER_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENROUTER_API_KEY
});

export const AVAILABLE_MODELS = [
  { id: "openai/gpt-4o", name: "GPT-4o" },
  { id: "openai/gpt-4o-mini", name: "GPT-4o Mini" },
  { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet" },
  { id: "anthropic/claude-3-haiku", name: "Claude 3 Haiku" },
  { id: "google/gemini-2.0-flash-001", name: "Gemini 2.0 Flash" },
  { id: "meta-llama/llama-3.3-70b-instruct", name: "Llama 3.3 70B" },
  { id: "mistralai/mistral-large-2411", name: "Mistral Large" },
  { id: "deepseek/deepseek-chat", name: "DeepSeek Chat" },
  { id: "qwen/qwen-2.5-72b-instruct", name: "Qwen 2.5 72B" },
];

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function generateChatResponse(
  messages: ChatMessage[],
  model: string = "openai/gpt-4o-mini"
): Promise<string> {
  try {
    const response = await openrouter.chat.completions.create({
      model: model,
      messages: messages,
      max_tokens: 8192,
    });
    return response.choices[0]?.message?.content || "";
  } catch (error: any) {
    console.error("OpenRouter API error:", error);
    throw new Error(`Failed to generate response: ${error.message}`);
  }
}

export async function generateStreamingResponse(
  messages: ChatMessage[],
  model: string = "openai/gpt-4o-mini"
) {
  return await openrouter.chat.completions.create({
    model: model,
    messages: messages,
    max_tokens: 8192,
    stream: true,
  });
}

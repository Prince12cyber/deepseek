// Curated list of OpenAI models
export const DEFAULT_CHAT_MODEL = "gpt-5.4-nano";

export type ChatModel = {
  id: string;
  name: string;
  provider: string;
  description: string;
};

export function normalizeModelId(modelId: string) {
  return modelId.startsWith("openai/")
    ? modelId.slice("openai/".length)
    : modelId;
}

export const chatModels: ChatModel[] = [
  {
    id: "gpt-5.4",
    name: "GPT-5.4",
    provider: "openai",
    description: "Most capable OpenAI model for complex reasoning",
  },
  {
    id: "gpt-5.4-mini",
    name: "GPT-5.4 Mini",
    provider: "openai",
    description: "Strong for agentic tasks, coding and computer use",
  },
  {
    id: "gpt-5.4-nano",
    name: "GPT-5.4 Nano",
    provider: "openai",
    description:
      "High throughput, ideal for classification and instruction tasks",
  },
  {
    id: "gpt-5.2",
    name: "GPT-5.2",
    provider: "openai",
    description: "Advanced reasoning and problem-solving",
  },
  {
    id: "gpt-5-mini",
    name: "GPT-5 Mini",
    provider: "openai",
    description: "Fast and capable for most tasks",
  },
  {
    id: "gpt-4.1",
    name: "GPT-4.1",
    provider: "openai",
    description: "Powerful for complex multi-step tasks",
  },
  {
    id: "gpt-4.1-mini",
    name: "GPT-4.1 Mini",
    provider: "openai",
    description: "Fast and cost-effective for simple tasks",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    description: "Multimodal model with vision and audio support",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    description: "Fast and affordable multimodal",
  },
  {
    id: "o4-mini",
    name: "o4 Mini",
    provider: "openai",
    description: "Optimized for coding and reasoning",
  },
  {
    id: "o3-mini",
    name: "o3 Mini",
    provider: "openai",
    description: "Reasoning model for complex problems",
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "openai",
    description: "Fast and economical for simple tasks",
  },
];

// Group models by provider for UI
export const allowedModelIds = new Set(
  chatModels.map((m) => normalizeModelId(m.id))
);

export const modelsByProvider = chatModels.reduce(
  (acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  },
  {} as Record<string, ChatModel[]>
);

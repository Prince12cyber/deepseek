import type { Dispatch, SetStateAction } from "react";
import type { z } from "zod";

export interface WidgetDefinition<Payload = any, State = any> {
  kind: string;
  version: string;
  /** Priority for intent resolution (higher wins). Defaults to 0. */
  priority?: number;
  /**
   * Intent matcher: returns a confidence score between 0 and 1, or null if no match.
   * The input is the user's message text.
   */
  intentMatcher: (input: string) => number | null;
  /** Payload schema for validating the widget data from the assistant */
  payloadSchema: z.ZodType<Payload>;
  /** Initial state creator */
  createInitialState: (payload: Payload) => State;
  /** Render component */
  render: React.FC<{ state: State; setState: Dispatch<SetStateAction<State>> }>;
  /** Optional action handlers for handling user interactions */
  actionHandlers?: Record<
    string,
    (
      state: State,
      setState: Dispatch<SetStateAction<State>>,
      action: any
    ) => void
  >;
}

/**
 * Registry for widget definitions.
 */
export class WidgetRegistry {
  private static instance: WidgetRegistry;
  private readonly definitions: Map<string, WidgetDefinition>;

  private constructor() {
    this.definitions = new Map();
  }

  static getInstance(): WidgetRegistry {
    if (!WidgetRegistry.instance) {
      WidgetRegistry.instance = new WidgetRegistry();
    }
    return WidgetRegistry.instance;
  }

  /**
   * Register a widget definition.
   * @param definition The widget definition to register
   */
  register(definition: WidgetDefinition): void {
    this.definitions.set(definition.kind, definition);
  }

  /**
   * Get a widget definition by kind.
   * @param kind The widget kind
   * @returns The widget definition or undefined if not found
   */
  get(kind: string): WidgetDefinition | undefined {
    return this.definitions.get(kind);
  }

  /**
   * Get all registered widget definitions.
   * @returns An array of all widget definitions
   */
  getAll(): WidgetDefinition[] {
    return Array.from(this.definitions.values());
  }

  /**
   * Resolve a widget kind based on user intent.
   * @param input The user's message text
   * @returns The widget kind with the highest (priority * score) above a threshold, or undefined if none
   */
  resolveByIntent(input: string, threshold = 0.5): string | undefined {
    let bestKind: string | undefined;
    let bestScore = 0;

    for (const [kind, definition] of this.definitions) {
      const score = definition.intentMatcher(input);
      if (score === null) {
        continue;
      }
      const priority = definition.priority ?? 0;
      const weightedScore = priority * score;
      if (weightedScore > bestScore && weightedScore >= threshold) {
        bestScore = weightedScore;
        bestKind = kind;
      }
    }

    return bestKind;
  }
}

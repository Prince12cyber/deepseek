"use client";

import { useEffect, useState } from "react";
import { WidgetRegistry } from "./types";

interface WidgetHostProps {
  /** Array of widgets to render */
  widgets: { kind: string; payload: unknown }[];
}

export function WidgetHost({ widgets }: WidgetHostProps) {
  const [states, setStates] = useState<any[]>([]);

  useEffect(() => {
    const initialStates = widgets.map((widget) => {
      const definition = WidgetRegistry.getInstance().get(widget.kind);
      if (definition) {
        return definition.createInitialState(widget.payload);
      }
      console.warn(`Widget definition not found for kind: ${widget.kind}`);
      return null;
    });
    setStates(initialStates);
  }, [widgets]);

  const setState = (index: number, newState: any) => {
    setStates((prev) => {
      const copy = [...prev];
      copy[index] = newState;
      return copy;
    });
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {widgets.map((widget, index) => {
        const definition = WidgetRegistry.getInstance().get(widget.kind);
        const state = states[index];

        if (!definition) {
          return null;
        }

        // If state is null (definition not found at effect time, but we already checked), skip
        if (state === null) {
          return null;
        }

        return (
          <div
            className="border rounded-lg p-4 bg-background"
            key={`${widget.kind}-${index}`}
          >
            <definition.render
              setState={(newState: any) => setState(index, newState)}
              state={state}
            />
          </div>
        );
      })}
    </div>
  );
}

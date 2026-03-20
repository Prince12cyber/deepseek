"use client";

import { useEffect } from "react";
import { z } from "zod";
import { type WidgetDefinition, WidgetRegistry } from "./types";

// Timer payload schema
const timerPayloadSchema = z.object({
  // Initial time in seconds (optional)
  initialTime: z.number().optional(),
  // Whether to start as a countdown timer or stopwatch
  mode: z.enum(["countdown", "stopwatch"]).optional(),
  // Target time for countdown (in seconds)
  targetTime: z.number().optional(),
});

// Timer state shape
interface TimerWidgetState {
  time: number; // Current time in seconds
  isRunning: boolean;
  mode: "countdown" | "stopwatch";
  targetTime: number | null; // For countdown mode
  laps: number[]; // For stopwatch mode
}

// Timer widget definition
const timerWidget: WidgetDefinition<
  {
    initialTime?: number;
    mode?: "countdown" | "stopwatch";
    targetTime?: number;
  },
  TimerWidgetState
> = {
  kind: "timer",
  version: "1.0.0",
  priority: 7, // Medium priority
  intentMatcher: (input: string) => {
    const lower = input.toLowerCase();
    // Check for timer-related keywords
    const timerKeywords = [
      "timer",
      "stopwatch",
      "countdown",
      "clock",
      "time",
      "second",
      "minute",
      "hour",
      "start",
      "stop",
      "pause",
      "reset",
      "lap",
    ];
    let score = 0;
    for (const keyword of timerKeywords) {
      if (lower.includes(keyword)) {
        score += 0.1;
      }
    }
    // Check for time patterns
    if (/\d+\s*(s|sec|second|m|min|minute|h|hr|hour)/.test(lower)) {
      score += 0.3;
    }
    return Math.min(score, 1.0);
  },
  payloadSchema: timerPayloadSchema,
  createInitialState: (payload) => {
    const { initialTime = 0, mode = "stopwatch", targetTime } = payload;
    return {
      time: mode === "countdown" ? (targetTime ?? initialTime) : initialTime,
      isRunning: false,
      mode,
      targetTime: mode === "countdown" ? (targetTime ?? null) : null,
      laps: [],
    };
  },
  render: ({ state, setState }) => {
    const { time, isRunning, mode, targetTime, laps } = state;

    // Format time as HH:MM:SS
    const formatTime = (totalSeconds: number): string => {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = Math.floor(totalSeconds % 60);
      return [
        hours.toString().padStart(2, "0"),
        minutes.toString().padStart(2, "0"),
        seconds.toString().padStart(2, "0"),
      ].join(":");
    };

    // Timer tick effect
    useEffect(() => {
      let intervalId: NodeJS.Timeout | null = null;
      if (isRunning) {
        intervalId = setInterval(() => {
          setState((prev) => {
            let newTime = prev.time;
            if (prev.mode === "stopwatch") {
              newTime += 0.1; // Increment by 0.1 seconds for smooth display
            } else if (prev.mode === "countdown") {
              newTime -= 0.1; // Decrement by 0.1 seconds
              if (newTime <= 0) {
                newTime = 0;
                // Stop when countdown reaches zero
                return {
                  ...prev,
                  time: newTime,
                  isRunning: false,
                };
              }
            }
            return { ...prev, time: newTime };
          });
        }, 100); // Update every 100ms for smooth display
      }
      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    }, [isRunning, mode]);

    return (
      <div className="space-y-4">
        <div className="border rounded-lg p-4 bg-background">
          <h3 className="font-semibold mb-2">
            {mode === "countdown" ? "Countdown Timer" : "Stopwatch"}
          </h3>

          {/* Display */}
          <div className="mb-4 p-4 bg-muted rounded text-2xl font-mono text-center">
            {formatTime(time)}
          </div>

          {/* Controls */}
          <div className="grid grid-cols-2 gap-2">
            {/* Start/Pause Button */}
            <button
              className={`btn btn-${isRunning ? "outline" : "primary"} w-full`}
              onClick={() =>
                setState((prev) => ({ ...prev, isRunning: !prev.isRunning }))
              }
              type="button"
            >
              {isRunning ? "Pause" : "Start"}
            </button>

            {/* Reset/Lap Button */}
            <button
              className="btn btn-outline w-full"
              onClick={() => {
                if (mode === "stopwatch") {
                  // Record lap
                  setState((prev) => ({
                    ...prev,
                    laps: [...prev.laps, prev.time],
                  }));
                } else {
                  // Reset countdown
                  setState((prev) => ({
                    ...prev,
                    time: prev.targetTime ?? 0,
                    isRunning: false,
                  }));
                }
              }}
              type="button"
            >
              {mode === "stopwatch" ? "Lap" : "Reset"}
            </button>
          </div>

          {/* Mode selector */}
          <div className="mt-2">
            <div className="flex items-center space-x-2 text-sm">
              <input
                checked={mode === "stopwatch"}
                className="form-radio"
                id="timer-mode-stopwatch"
                name="timer-mode"
                onChange={() =>
                  setState((prev) => ({
                    ...prev,
                    mode: "stopwatch",
                    time: 0,
                    isRunning: false,
                    laps: [],
                  }))
                }
                type="radio"
              />
              <label className="cursor-pointer" htmlFor="timer-mode-stopwatch">
                Stopwatch
              </label>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <input
                checked={mode === "countdown"}
                className="form-radio"
                id="timer-mode-countdown"
                name="timer-mode"
                onChange={() =>
                  setState((prev) => ({
                    ...prev,
                    mode: "countdown",
                    time: prev.targetTime ?? 60,
                    isRunning: false,
                    laps: [],
                  }))
                }
                type="radio"
              />
              <label className="cursor-pointer" htmlFor="timer-mode-countdown">
                Countdown
              </label>
            </div>
          </div>

          {/* Target time input for countdown */}
          {mode === "countdown" && (
            <div className="mt-2">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="countdown-target-time"
              >
                Target Time (seconds):
              </label>
              <input
                className="input input-bordered w-full max-w-xs"
                id="countdown-target-time"
                min="1"
                onChange={(e) => {
                  const value = Number.parseInt(e.target.value, 10) || 60;
                  setState((prev) => ({
                    ...prev,
                    targetTime: value,
                    // If not running, update current time too
                    ...(!prev.isRunning && { time: value }),
                  }));
                }}
                type="number"
                value={targetTime ?? 60}
              />
            </div>
          )}

          {/* Laps display for stopwatch */}
          {mode === "stopwatch" && laps.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Laps</h4>
              <div className="max-h-24 overflow-y-auto border rounded p-2 bg-muted text-sm">
                {laps
                  .map((lap, index) => ({ index, lap }))
                  .reverse()
                  .map(({ index, lap }) => (
                    <div className="mb-1 flex justify-between" key={index}>
                      <span>Lap {laps.length - index}</span>
                      <span>{formatTime(lap)}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
  actionHandlers: {},
};

// Register the widget
WidgetRegistry.getInstance().register(timerWidget);

export default timerWidget;

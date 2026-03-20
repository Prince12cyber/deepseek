"use client";

import { z } from "zod";
import { type WidgetDefinition, WidgetRegistry } from "./types";

// Calculator payload schema
const calculatorPayloadSchema = z.object({
  // Initial expression or value (optional)
  initialValue: z.string().optional(),
});

// Calculator state shape
interface CalculatorWidgetState {
  display: string;
  expression: string;
  history: string[];
  isError: boolean;
}

// Calculator widget definition
const calculatorWidget: WidgetDefinition<
  { initialValue?: string },
  CalculatorWidgetState
> = {
  kind: "calculator",
  version: "1.0.0",
  priority: 8, // High priority for math expressions
  intentMatcher: (input: string) => {
    const lower = input.toLowerCase();
    // Check for calculator-related keywords
    const calcKeywords = [
      "calculate",
      "compute",
      "eval",
      "+",
      "-",
      "*",
      "/",
      "=",
      "sin",
      "cos",
      "tan",
      "log",
      "ln",
      "sqrt",
      "sqrt",
      "^",
      "pi",
      "e",
    ];
    let score = 0;
    for (const keyword of calcKeywords) {
      if (lower.includes(keyword)) {
        score += 0.1;
      }
    }
    // Check for mathematical expressions
    if (/[0-9+\-*/().^]/.test(lower)) {
      score += 0.3;
    }
    // Check for equals sign
    if (/=/.test(lower)) {
      score += 0.2;
    }
    return Math.min(score, 1.0);
  },
  payloadSchema: calculatorPayloadSchema,
  createInitialState: (payload) => {
    const { initialValue = "" } = payload;
    return {
      display: initialValue,
      expression: initialValue,
      history: [],
      isError: false,
    };
  },
  render: ({ state, setState }) => {
    const { display, expression, history, isError } = state;

    // Handle button clicks
    const handleButtonPress = (value: string) => {
      if (isError) {
        // Clear error state on new input
        setState({
          display: value,
          expression: value,
          history: [...history],
          isError: false,
        });
        return;
      }

      if (value === "=") {
        try {
          // Evaluate the expression
          const result = evaluateExpression(expression);
          setState({
            display: String(result),
            expression: String(result),
            history: [...history, `${expression} = ${result}`],
            isError: false,
          });
        } catch (_) {
          setState({
            display: "Error",
            expression,
            history: [...history],
            isError: true,
          });
        }
      } else if (value === "C") {
        // Clear
        setState({
          display: "",
          expression: "",
          history: [...history],
          isError: false,
        });
      } else if (value === "⌫") {
        // Backspace
        const newExpr = expression.slice(0, -1);
        setState({
          display: newExpr,
          expression: newExpr,
          history: [...history],
          isError: false,
        });
      } else {
        // Append value
        setState({
          display: display + value,
          expression: expression + value,
          history: [...history],
          isError: false,
        });
      }
    };

    // Safe expression evaluation
    function evaluateExpression(expr: string): number {
      // Replace common math functions
      let processedExpr = expr
        .replace(/sin/g, "Math.sin")
        .replace(/cos/g, "Math.cos")
        .replace(/tan/g, "Math.tan")
        .replace(/log/g, "Math.log10")
        .replace(/ln/g, "Math.log")
        .replace(/sqrt/g, "Math.sqrt")
        .replace(/pi/g, "Math.PI")
        .replace(/e/g, "Math.E")
        .replace(/^(\d+)\.(\d+)$/, "$1.$2"); // Ensure decimal format

      // Replace ^ with ** for exponentiation
      processedExpr = processedExpr.replace(/\^/g, "**");

      // Validate allowed characters
      if (!/^[0-9+\-*/().\sMath.PIMath.E]*$/.test(processedExpr)) {
        throw new Error("Invalid characters in expression");
      }

      // Use Function constructor for evaluation (in production, use a safe evaluator)
      // eslint-disable-next-line no-new-func
      return new Function(`return ${processedExpr}`)();
    }

    return (
      <div className="space-y-4">
        <div className="border rounded-lg p-4 bg-background">
          <h3 className="font-semibold mb-2">Calculator</h3>

          {/* Display */}
          <div className="mb-4 p-3 bg-muted rounded text-right text-lg font-mono">
            {display || "0"}
          </div>

          {/* Error state */}
          {isError && (
            <div className="mb-2 text-sm text-destructive text-center">
              Error in calculation
            </div>
          )}

          {/* Buttons grid */}
          <div className="grid grid-cols-4 gap-2">
            {/* Row 1: Clear, Backspace, (), / */}
            <button
              className="btn btn-outline"
              onClick={() => handleButtonPress("C")}
              type="button"
            >
              C
            </button>
            <button
              className="btn btn-outline"
              onClick={() => handleButtonPress("⌫")}
              type="button"
            >
              ⌫
            </button>
            <button
              className="btn btn-outline"
              onClick={() => handleButtonPress("(")}
              type="button"
            >
              (
            </button>
            <button
              className="btn btn-outline"
              onClick={() => handleButtonPress(")")}
              type="button"
            >
              )
            </button>

            {/* Row 2: 7, 8, 9, * */}
            <button
              className="btn btn-outline"
              onClick={() => handleButtonPress("7")}
              type="button"
            >
              7
            </button>
            <button
              className="btn btn-outline"
              onClick={() => handleButtonPress("8")}
              type="button"
            >
              8
            </button>
            <button
              className="btn btn-outline"
              onClick={() => handleButtonPress("9")}
              type="button"
            >
              9
            </button>
            <button
              className="btn btn-outline"
              onClick={() => handleButtonPress("*")}
              type="button"
            >
              ×
            </button>

            {/* Row 3: 4, 5, 6, - */}
            <button
              className="btn btn-outline"
              onClick={() => handleButtonPress("4")}
              type="button"
            >
              4
            </button>
            <button
              className="btn btn-outline"
              onClick={() => handleButtonPress("5")}
              type="button"
            >
              5
            </button>
            <button
              className="btn btn-outline"
              onClick={() => handleButtonPress("6")}
              type="button"
            >
              6
            </button>
            <button
              className="btn btn-outline"
              onClick={() => handleButtonPress("-")}
              type="button"
            >
              −
            </button>

            {/* Row 4: 1, 2, 3, + */}
            <button
              className="btn btn-outline"
              onClick={() => handleButtonPress("1")}
              type="button"
            >
              1
            </button>
            <button
              className="btn btn-outline"
              onClick={() => handleButtonPress("2")}
              type="button"
            >
              2
            </button>
            <button
              className="btn btn-outline"
              onClick={() => handleButtonPress("3")}
              type="button"
            >
              3
            </button>
            <button
              className="btn btn-outline"
              onClick={() => handleButtonPress("+")}
              type="button"
            >
              +
            </button>

            {/* Row 5: 0, ., =, ÷ */}
            <button
              className="btn btn-outline col-span-2"
              onClick={() => handleButtonPress("0")}
              type="button"
            >
              0
            </button>
            <button
              className="btn btn-outline"
              onClick={() => handleButtonPress(".")}
              type="button"
            >
              .
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handleButtonPress("=")}
              type="button"
            >
              =
            </button>
            <button
              className="btn btn-outline"
              onClick={() => handleButtonPress("/")}
              type="button"
            >
              ÷
            </button>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">History</h4>
              <div className="max-h-24 overflow-y-auto border rounded p-2 bg-muted text-sm">
                {history
                  .slice()
                  .reverse()
                  .map((item) => (
                    <div className="mb-1" key={item}>
                      {item}
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
WidgetRegistry.getInstance().register(calculatorWidget);

export default calculatorWidget;

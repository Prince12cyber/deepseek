"use client";

import { useEffect } from "react";
import { z } from "zod";
import { type WidgetDefinition, WidgetRegistry } from "./types";

// Simple expression evaluator for linear and quadratic equations in x
// We'll parse expressions of the form: a*x^2 + b*x + c
// We'll support: numbers, x, +, -, *, /, ^ (only ^2 for now)
// We'll not handle parentheses for simplicity in this example.

// In a real implementation, you would use a proper parser or mathjs.

// For demonstration, we'll assume the expression is already simplified and we can extract coefficients.
// This is a placeholder for a real math solver.

// We'll create a simple solver that can handle:
//   - Linear: 2x + 3 = 7
//   - Quadratic: x^2 - 5x + 6 = 0
//   - Also: y = x^2 (we'll treat as x^2 - y = 0, but y is known? We'll assume y is the variable to plot)

// We'll split the widget into two modes: equation solving and plotting.

// We'll define the payload schema: the assistant should provide an expression string.
const mathPayloadSchema = z.object({
  expression: z.string(),
});

// We'll define the state shape.
interface MathWidgetState {
  expression: string;
  steps: string[];
  graphData: { x: number[]; y: number[] } | null;
  currentStep: number;
  status: "idle" | "solving" | "plotting" | "error";
}

// Helper function to parse a simple expression and return coefficients for ax^2 + bx + c
// This is a very simplified parser for demonstration.
function parseExpression(
  expr: string
): { a: number; b: number; c: number } | null {
  // Remove spaces
  const exprNoSpaces = expr.replace(/\s/g, "");
  // We'll look for the pattern: [number]x^2 [+/-] [number]x [+/-] [number]
  // But we'll do a very basic version: assume the expression is a polynomial in x of degree at most 2.
  // We'll evaluate the expression at three points to solve for a, b, c.
  // f(x) = a*x^2 + b*x + c
  // We'll pick x = 0, 1, 2 and solve the system.
  try {
    const f0 = evaluateExpression(exprNoSpaces, 0);
    const f1 = evaluateExpression(exprNoSpaces, 1);
    const f2 = evaluateExpression(exprNoSpaces, 2);
    // Solve:
    // c = f0
    // a + b + c = f1  => a + b = f1 - f0
    // 4a + 2b + c = f2 => 4a + 2b = f2 - f0
    // From first: b = (f1 - f0) - a
    // Second: 4a + 2((f1 - f0) - a) = f2 - f0
    // => 4a + 2f1 - 2f0 - 2a = f2 - f0
    // => 2a + 2f1 - 2f0 = f2 - f0
    // => 2a = f2 - f0 - 2f1 + 2f0 = f2 + f0 - 2f1
    // => a = (f2 + f0 - 2f1) / 2
    const a = (f2 + f0 - 2 * f1) / 2;
    const b = f1 - f0 - a;
    const c = f0;
    return { a, b, c };
  } catch (e) {
    return null;
  }
}

// Helper to evaluate the expression at a given x value.
// We'll replace 'x' with the value and then evaluate the expression.
// We'll only support basic arithmetic and ^2.
function evaluateExpression(expr: string, xValue: number): number {
  // Replace x with the value
  let exprWithX = expr.replace(/x/g, `(${xValue})`);
  // We'll evaluate the expression using Function constructor (be cautious, but we control the input)
  // In a real app, use a safe evaluator.
  // We'll only allow numbers, +, -, *, /, ^, and parentheses.
  // We'll check for any invalid characters.
  if (!/^[0-9+\-*/().^ ]+$/.test(exprWithX)) {
    throw new Error("Invalid expression");
  }
  // Replace ^ with ** for exponentiation (but note: we only support ^2 for simplicity)
  exprWithX = exprWithX.replace(/\^/g, "**");
  // Use eval (in a real app, use a safe evaluator like mathjs)
  // eslint-disable-next-line no-new-func
  return new Function(`return ${exprWithX}`)();
}

// Function to solve linear equation: a*x + b = 0 -> x = -b/a (if a != 0)
function solveLinear(a: number, b: number): string | null {
  if (Math.abs(a) < 1e-10) {
    if (Math.abs(b) < 1e-10) {
      return "Infinite solutions (0 = 0)";
    }
    return "No solution";
  }
  const x = -b / a;
  return `x = ${x}`;
}

// Intent matcher: returns a confidence score between 0 and 1 for math-related input.
function mathIntentMatcher(input: string): number | null {
  const lower = input.toLowerCase();
  // Check for math-related keywords
  const mathKeywords = [
    "solve",
    "equation",
    "plot",
    "graph",
    "y=",
    "x^2",
    "x²",
    "quadratic",
    "linear",
    "=",
    "x",
    "+",
    "-",
    "*",
    "/",
    "^",
  ];
  let score = 0;
  for (const keyword of mathKeywords) {
    if (lower.includes(keyword)) {
      score += 0.1;
    }
  }
  // Also check for patterns like "2x+3=7" or "x^2-5x+6=0"
  if (/[0-9]+\s*x\s*[+\-*/^]/.test(lower) || /x\s*[+\-*/^]/.test(lower)) {
    score += 0.3;
  }
  if (/=/.test(lower)) {
    score += 0.2;
  }
  // Cap at 1.0
  return Math.min(score, 1.0);
}

// Create the widget definition
const mathWidget: WidgetDefinition<MathWidgetState> = {
  kind: 'math',
  version: '1.0.0',
  priority: 10, // High priority for math expressions
  intentMatcher: mathIntentMatcher,
  payloadSchema: mathPayloadSchema,
  createInitialState: (payload) => {
    const { expression } = payload;
    return {
      expression,
      steps: [],
      graphData: null,
      currentStep: 0,
      status: 'idle',
    };
  },
  render: ({ state, setState }) => {
    const { expression, steps, graphData, currentStep, status } = state;

    // Solve or plot when expression changes
    useEffect(() => {
      if (!expression) {
        setState(prev => ({ ...prev, steps: [], graphData: null, status: 'idle' }));
        return;
      }

      setState(prev => ({ ...prev, status: 'solving' }));

      // Try to parse the expression as an equation (left = right)
      const parts = expression.split('=');
      let leftExpr = '';
      let rightExpr = '';
      if (parts.length === 2) {
        leftExpr = parts[0].trim();
        rightExpr = parts[1].trim();
      } else {
        // Assume it's an expression equal to 0, or just an expression to plot
        leftExpr = expression.trim();
        rightExpr = '0';
      }

      // We'll try to parse leftExpr and rightExpr as expressions in x
      // We'll form: leftExpr - rightExpr = 0
      // But for simplicity, we'll assume the expression is already in the form we can parse.
      // We'll use the parseExpression function on the leftExpr and rightExpr separately? 
      // Instead, we'll evaluate the expression as a function of x and then try to solve.

      // We'll attempt to parse the entire expression as a polynomial in x.
      // We'll move everything to one side: expression = 0
      // But if there's an '=', we already split.

      // We'll create a function f(x) = (leftExpr) - (rightExpr)
      // We'll then try to express f(x) as a*x^2 + b*x + c.

      // We'll use the parseExpression on a string that represents f(x)
      // We'll create a string: `(${leftExpr}) - (${rightExpr})`
      const fExpr = `(${leftExpr}) - (${rightExpr})`;
      const coeffs = parseExpression(fExpr);
      if (!coeffs) {
        setState(prev => ({
          ...prev,
          steps: ['Could not parse expression as a polynomial.'],
          graphData: null,
          status: 'error',
        }));
        return;
      }

      const { a, b, c } = coeffs;

      // Generate steps
      const steps: string[] = [];
      steps.push(`Given: ${leftExpr} = ${rightExpr}`);
      steps.push(`Rewrite as: ${leftExpr} - (${rightExpr}) = 0`);
      steps.push(`Which is: ${a}x² + ${b}x + ${c} = 0`);

      // Solve
      if (Math.abs(a) < 1e-10) {
        // Linear equation: b*x + c = 0
        steps.push(`Since a = 0, this is a linear equation: ${b}x + ${c} = 0`);
        const solution = solveLinear(b, c);
        steps.push(`Solution: ${solution}`);
      } else {
        // Quadratic equation
        steps.push(`This is a quadratic equation: ${a}x² + ${b}x + ${c} = 0`);
        const discriminant = b * b - 4 * a * c;
        steps.push(`Discriminant: b² - 4ac = ${b}² - 4*${a}*${c} = ${discriminant}`);
        if (discriminant < 0) {
          steps.push("Since discriminant < 0, there are no real solutions.");
        } else {
          const sqrtD = Math.sqrt(discriminant);
          steps.push(`√(discriminant) = √${discriminant} = ${sqrtD}`);
          const x1 = (-b + sqrtD) / (2 * a);
          const x2 = (-b - sqrtD) / (2 * a);
          if (Math.abs(x1 - x2) < 1e-10) {
            steps.push(`x = (-b ± √D) / (2a) = (${-b} ± ${sqrtD}) / (2 * ${a}) = ${x1}`);
          } else {
            steps.push(`x₁ = (-b + √D) / (2a) = (${-b} + ${sqrtD}) / (2 * ${a}) = ${x1}`);
            steps.push(`x₂ = (-b - √D) / (2a) = (${-b} - ${sqrtD}) / (2 * ${a}) = ${x2}`);
          }
        }
      }

      // Generate graph data for y = a*x^2 + b*x + c (if we are plotting)
      // We'll always generate the graph for the quadratic expression.
      const graphData = generateGraphData(a, b, c);

      setState(prev => ({
        ...prev,
        steps,
        graphData,
        currentStep: 0,
        status: 'idle',
      }));
    }, [expression, setState]);

    // Render the widget
    return (
      <div className="space-y-4">
        <div className="border rounded-lg p-4 bg-background">
          <h3 className=Math<"font-semibold mb-2" Widget</h3>
          <div className=<strong>Expression<
            "mb-2" :</strong> <code>expression</code>
          </div>status === 'solving' && (
            <div className=Solving<"text-sm text-muted-foreground" ...</div>
          )status === 'error' && (
            <div className=Error<"text-sm text-destructive" : Could not parse expression.</div>
          )steps.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => setState(prev => ({ ...prev, currentStep: Math.max(0, prev.currentStep - 1) }))
                  disabled={currentStep === 0}
                  className=Previous
                <
                  "btn btn-sm btn-outline" Step
                </button>
                <span className=Step<
                  "text-xs text-muted-foreground" currentStep + 1of steps.length
                </span>
                <button
                  onClick={() => setState(prev => ({ ...prev, currentStep: Math.min(steps.length - 1, prev.currentStep + 1) }))}
                  disabled={currentStep >= steps.length - 1}
                  className=Next
                <
                  "btn btn-sm btn-outline" Step
                </button>
              </div>
              <div className="border rounded p-3 bg-muted">
                <p className="text-sm whitespace-pre-wrap">{steps[currentStep]}</p>
              </div>
            </>
)}
{
  graphData && (
            <div className="mt-4">
              <h4 className=Graph<"font-semibold mb-2" </h4>
  <div
  className = "aspect-square border rounded bg-muted">
                <div className =
    Graph <
    "flex h-full items-center justify-center text-sm text-muted-foreground";
  of;
  y = {graphData.y[0]}
  x;
  ² + ... (placeholder)
                </div>
              </div>
            </div>
          )
}
</div>
      </div>
)
},
  actionHandlers:
{
  // Example action handler for solving
  solve: (state, setState) => {
      // Trigger a re-solve
      setState(prev => ({ ...prev, status: 'solving' }));
      // The useEffect will re-run because expression hasn't changed, but we can force by adding a timestamp or something.
      // For simplicity, we'll just re-run the effect by changing a dummy state.
      // We'll add a dummy field to state to trigger re-render, but we don't have one.
      // Instead, we'll just call the same logic as in useEffect.
      // We'll leave this as a placeholder.
    },
}
,
}

// Register the widget
WidgetRegistry.getInstance().register(mathWidget)

export default mathWidget;

// Helper function to generate graph data for y = a*x^2 + b*x + c
function generateGraphData(
  a: number,
  b: number,
  c: number
): { x: number[]; y: number[] } {
  const xValues: number[] = [];
  const yValues: number[] = [];
  // Generate points from -10 to 10 in steps of 0.5
  for (let x = -10; x <= 10; x += 0.5) {
    const y = a * x * x + b * x + c;
    xValues.push(x);
    yValues.push(y);
  }
  return { x: xValues, y: yValues };
}

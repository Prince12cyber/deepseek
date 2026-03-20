"use client";

import { useEffect } from "react";
import { z } from "zod";
import { type WidgetDefinition, WidgetRegistry } from "./types";

// Rich text payload schema
const richTextPayloadSchema = z.object({
  // Markdown content to render
  content: z.string(),
  // Optional title
  title: z.string().optional(),
});

// Rich text state shape
interface RichTextWidgetState {
  content: string;
  title: string | null;
  processedContent: string; // HTML processed content
}

// Rich text widget definition
const richTextWidget: WidgetDefinition<
  { content: string; title?: string },
  RichTextWidgetState
> = {
  kind: "richText",
  version: "1.0.0",
  priority: 6, // Medium-low priority
  intentMatcher: (input: string) => {
    const lower = input.toLowerCase();
    // Check for rich text/markdown-related keywords
    const richTextKeywords = [
      "markdown",
      "format",
      "render",
      "display",
      "show",
      "```",
      "|",
      "- [ ]",
      "- [x]",
      "# ",
      "## ",
      "### ",
      "**",
      "__",
      "*",
      "_",
      "`",
      "[",
      "]",
      "(",
      ")",
      "![",
      "|",
      "---",
      "===",
    ];
    let score = 0;
    for (const keyword of richTextKeywords) {
      if (lower.includes(keyword)) {
        score += 0.05;
      }
    }
    // Check for markdown patterns
    if (/^#{1,6}\s/.test(lower) || /```/.test(lower) || /\|.*\|/.test(lower)) {
      score += 0.4;
    }
    return Math.min(score, 1.0);
  },
  payloadSchema: richTextPayloadSchema,
  createInitialState: (payload) => {
    const { content, title = null } = payload;
    return {
      content,
      title,
      processedContent: "", // Will be processed in useEffect
    };
  },
  render: ({ state, setState }) => {
    const { content, title, processedContent } = state;

    // Process markdown to HTML (simplified implementation)
    useEffect(() => {
      if (!content) {
        setState((prev) => ({ ...prev, processedContent: "" }));
        return;
      }

      // Simple markdown to HTML conversion (for demonstration)
      // In a real implementation, you would use a library like marked or remark
      let html = content;

      // Escape HTML first
      html = html
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

      // Process headers
      html = html
        .replace(/^### (.*$)/gm, "<h3>$1</h3>")
        .replace(/^## (.*$)/gm, "<h2>$1</h2>")
        .replace(/^# (.*$)/gm, "<h1>$1</h1>");

      // Process bold and italic
      html = html
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/__(.*?)__/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/_(.*?)_/g, "<em>$1</em>");

      // Process inline code
      html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

      // Process code blocks
      html = html.replace(/```([^`]*)```/g, (_match, p1) => {
        // Simple syntax highlighting simulation
        const lines = p1.split("\n");
        const highlightedLines = lines.map((line: string) => {
          // Very basic keyword highlighting
          const highlighted = line
            .replace(
              /\b(function|return|var|let|const|if|else|for|while|class|extends)\b/g,
              '<span class="keyword">$1</span>'
            )
            .replace(/\b(".*?")/g, '<span class="string">$1</span>')
            .replace(/\b(\d+)/g, '<span class="number">$1</span>');
          return highlighted;
        });
        return `<pre><code>${highlightedLines.join("\n")}</code></pre>`;
      });

      // Process blockquotes
      html = html.replace(/^> (.*$)/gm, "<blockquote>$1</blockquote>");

      // Process lists
      html = html
        .replace(/^\* (.*$)/gm, "<ul><li>$1</li></ul>")
        .replace(/^- (.*$)/gm, "<ul><li>$1</li></ul>")
        .replace(/^\d+\. (.*$)/gm, "<ol><li>$1</li></ol>");

      // Process links
      html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

      // Process images
      html = html.replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        '<img src="$2" alt="$1" />'
      );

      // Process horizontal rules
      html = html.replace(/^---$/gm, "<hr />");

      // Process tables (simplified)
      html = html.replace(/^\|(.*)\|$/gm, (_match, p1) => {
        const cells = p1.split("|").map((cell: string) => cell.trim());
        if (
          cells.length > 1 &&
          cells[0] !== "" &&
          cells[cells.length - 1] === ""
        ) {
          cells.pop(); // Remove trailing empty cell
        }
        if (cells.length > 0) {
          return `<tr>${cells.map((cell: string) => `<td>${cell}</td>`).join("")}</tr>`;
        }
        return _match;
      });

      // Wrap table rows in table tags
      html = html.replace(
        /(<tr>.*<\/tr>)/g,
        '<table class="min-w-full divide-y divide-gray-200">$1</table>'
      );

      // Add table headers if first row looks like a header
      html = html.replace(
        /<table>(<tr>.*<\/tr>)/,
        "<table><thead>$1</thead><tbody>"
      );
      html = html.replace(/(<\/tbody>)/, "$1</table>");

      setState((prev) => ({ ...prev, processedContent: html }));
    }, [content, setState]);

    return (
      <div className="space-y-4">
        <div className="border rounded-lg p-4 bg-background">
          {title && (
            <div className="mb-4">
              <h3 className="font-semibold text-lg">{title}</h3>
            </div>
          )}
          <div className="prose prose-sm max-w-none">
            {/* Using dangerouslySetInnerHTML for simplicity in this demo.
                In production, use a proper sanitizer like DOMPurify. */}
            <div
              className="markdown-content"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
          </div>
        </div>
      </div>
    );
  },
  actionHandlers: {},
};

// Register the widget
WidgetRegistry.getInstance().register(richTextWidget);

export default richTextWidget;

import OpenAI from "openai";
import { createDocumentHandler } from "@/lib/artifacts/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const imageDocumentHandler = createDocumentHandler<"image">({
  kind: "image",
  onCreateDocument: async ({ title, dataStream }) => {
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: title,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json",
      });

      const base64Image = response.data?.[0]?.b64_json || "";

      dataStream.write({
        type: "data-imageDelta",
        data: base64Image,
        transient: true,
      });

      return base64Image;
    } catch (error) {
      console.error("Image generation failed:", error);
      // Fallback to SVG if DALL-E fails
      const svgContent = generateSvgFromTitle(title);
      const base64Image = Buffer.from(svgContent).toString("base64");

      dataStream.write({
        type: "data-imageDelta",
        data: base64Image,
        transient: true,
      });

      return base64Image;
    }
  },
  onUpdateDocument: async ({ document, description, dataStream }) => {
    try {
      const prompt = description || document.title;
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json",
      });

      const base64Image = response.data?.[0]?.b64_json || "";

      dataStream.write({
        type: "data-imageDelta",
        data: base64Image,
        transient: true,
      });

      return base64Image;
    } catch (error) {
      console.error("Image generation failed:", error);
      // Fallback to SVG if DALL-E fails
      const svgContent = generateSvgFromTitle(description || document.title);
      const base64Image = Buffer.from(svgContent).toString("base64");

      dataStream.write({
        type: "data-imageDelta",
        data: base64Image,
        transient: true,
      });

      return base64Image;
    }
  },
});

function generateSvgFromTitle(title: string): string {
  // Generate a simple SVG based on the title
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
  ];

  const hash = title
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const color1 = colors[hash % colors.length];
  const color2 = colors[(hash + 3) % colors.length];
  const color3 = colors[(hash + 7) % colors.length];

  // Create different patterns based on title length
  const patternType = hash % 4;

  let pattern = "";

  switch (patternType) {
    case 0:
      // Circles pattern
      pattern = `
        <circle cx="50" cy="50" r="40" fill="${color1}" opacity="0.8"/>
        <circle cx="150" cy="80" r="30" fill="${color2}" opacity="0.7"/>
        <circle cx="100" cy="150" r="35" fill="${color3}" opacity="0.6"/>
        <circle cx="200" cy="120" r="25" fill="${color1}" opacity="0.5"/>
      `;
      break;
    case 1:
      // Rectangles pattern
      pattern = `
        <rect x="20" y="20" width="80" height="80" fill="${color1}" opacity="0.8" rx="10"/>
        <rect x="120" y="50" width="60" height="100" fill="${color2}" opacity="0.7" rx="5"/>
        <rect x="200" y="30" width="70" height="70" fill="${color3}" opacity="0.6" rx="8"/>
      `;
      break;
    case 2:
      // Stars pattern
      pattern = `
        <polygon points="50,10 61,35 90,35 67,55 78,85 50,67 22,85 33,55 10,35 39,35" fill="${color1}" opacity="0.8"/>
        <polygon points="150,40 161,65 190,65 167,85 178,115 150,97 122,115 133,85 110,65 139,65" fill="${color2}" opacity="0.7"/>
        <polygon points="250,70 261,95 290,95 267,115 278,145 250,127 222,145 233,115 210,95 239,95" fill="${color3}" opacity="0.6"/>
      `;
      break;
    default:
      // Abstract shapes
      pattern = `
        <ellipse cx="60" cy="80" rx="50" ry="30" fill="${color1}" opacity="0.8"/>
        <path d="M120 20 Q180 80 120 140 Q60 80 120 20" fill="${color2}" opacity="0.7"/>
        <path d="M200 60 L240 100 L200 140 L160 100 Z" fill="${color3}" opacity="0.6"/>
      `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 180" width="300" height="180">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)"/>
    ${pattern}
    <text x="150" y="170" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle" opacity="0.7">${title.substring(0, 30)}${title.length > 30 ? "..." : ""}</text>
  </svg>`;

  return svg;
}

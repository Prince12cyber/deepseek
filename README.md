<div align="center">
  <h1>🌌 Deep AI</h1>
  <p><strong>Next-Generation AI Interface & Workspace Built with Next.js</strong></p>
  <p>
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" /></a>
    <a href="https://reactjs.org"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="https://pnpm.io"><img src="https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm" /></a>
  </p>
</div>

---

## 📖 Table of Contents
- [About the Project](#about-the-project)
- [✨ Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Development](#development)
- [📦 Project Structure](#-project-structure)
- [📜 Available Scripts](#-available-scripts)
- [📄 License](#-license)

---

## About the Project
**Deep AI** is a highly interactive, modern web application designed as a fully-featured AI interface. Built with performance and developer experience in mind, it utilizes the latest capabilities of **Next.js 16** and the **Vercel AI SDK** to provide seamless AI model streaming, rich text editing, and intelligent workflow management. 

Whether you are editing code, chatting with an AI agent, or organizing complex workflows, Deep AI offers an aesthetic and highly responsive environment powered by the latest modern web technologies.

---

## ✨ Features
- **🤖 Intelligent Chat & AI Integration**: First-class support for OpenAI and other models via `@ai-sdk`.
- **📝 Advanced Rich Text Editor**: Integrated ProseMirror for robust document editing and formatting.
- **⚡ Real-time Data Mapping**: Ultra-fast state management with Zustand and SWR.
- **🎨 Beautiful UI & Animations**: Built using Tailwind CSS, Radix UI primitives, and Framer Motion for buttery smooth visuals.
- **🔒 Authentication Ready**: Secure user authentication workflows powered by NextAuth.js.
- **🗄️ Robust Database & ORM**: PostgreSQL integration made simple, typed, and scalable using Drizzle ORM.
- **🚀 Turbocharged Development**: Ultra-fast build times using Turbopack and pnpm.

---

## 🛠 Tech Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Framer Motion, Radix UI
- **AI Integration:** Vercel AI SDK
- **Database ORM:** Drizzle ORM
- **Database Provider:** PostgreSQL
- **Caching/State:** Redis, Zustand, SWR
- **Editor:** ProseMirror, CodeMirror
- **Authentication:** NextAuth.js
- **Package Manager:** pnpm

---

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites
Before you begin, ensure you have the following installed:
- Node.js (v18 or higher recommended)
- [pnpm](https://pnpm.io/) (v9+)
- PostgreSQL (Local or Cloud-managed like Supabase or Neon)
- Redis Server (For caching and state)

### Installation
1. Clone the repository and navigate to the project directory:
   ```bash
   git clone <your-repo-url>
   cd deepseek
   ```
2. Install dependencies using pnpm:
   ```bash
   pnpm install
   ```

### Environment Variables
Copy the `.env.example` file to create your local environment configuration. Ensure that your database URLs, Redis configurations, and AI API keys are correctly entered.

```bash
cp .env.example .env.local
```

### Database Setup
The app uses Drizzle ORM to map onto a PostgreSQL database. Run the following to configure the database schema:

```bash
# Push the schema state to your database
pnpm run db:push

# (Optional) Open Drizzle Studio to explore your database
pnpm run db:studio
```

### Development
Once everything is configured, start the Next.js development server with Turbopack:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📦 Project Structure
A brief look into how the project is organized:

```
deepseek/
├── app/               # Next.js App Router structure (Pages, API Routes, Layouts)
├── components/        # Reusable React components (UI elements, Layout pieces)
├── hooks/             # Custom React hooks (e.g., use-search-results.ts)
├── lib/               # Utility functions, Database configuraton, AI model configs
├── public/            # Static assets like images and generic files
├── tests/             # Playwright E2E and unit test configurations
└── package.json       # Project dependencies and workspace scripts
```

---

## 📜 Available Scripts

Here are the most commonly used commands:

| Command | Description |
| ------- | ----------- |
| `pnpm run dev` | Starts the development server with Next.js Turbopack |
| `pnpm run build` | Builds the application for production |
| `pnpm run start` | Starts the production server |
| `pnpm run check` | Runs linters to identify formatting and stylistic issues |
| `pnpm run fix` | Automatically fixes style and lint errors |
| `pnpm run db:push` | Pushes Drizzle schema changes to your database |
| `pnpm run db:generate`| Generates migration files for Drizzle ORM |
| `pnpm run test`  | Runs end-to-end testing with Playwright |

---

## 📄 License
This project is subject to the conditions listed in the `LICENSE` file. Open the file to review the specific legal agreements and usage rights configuration.

<div align="center">
  <br />
  <p>Built with ❤️ by Prince12cyber.</p>
</div>

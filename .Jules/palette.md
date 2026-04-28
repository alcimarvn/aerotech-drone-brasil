## 2024-04-28 - Turbopack Panic in Next.js Dev Server
**Learning:** In this specific Next.js 16 environment, running `pnpm dev` with the default Turbopack enabled (`next dev`) causes an immediate fatal panic ("Next.js package not found") and crashes the server.
**Action:** When starting the local development server for visual verification, explicitly disable Turbopack by prepending the environment variable `TURBOPACK=0` (e.g., `TURBOPACK=0 pnpm dev`) to ensure a stable server instance.

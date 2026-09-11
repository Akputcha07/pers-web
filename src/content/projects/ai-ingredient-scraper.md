---
title: AI-Powered Product Ingredient Scraper
summary: A cross-platform desktop app (Tauri + React/TypeScript frontend, Python/FastAPI backend) that automates ingredient-list extraction from cosmetics/chemical product pages, replacing analysts' manual copy-paste workflow.
domain: software
tech:
  - Tauri
  - React
  - TypeScript
  - Python
  - FastAPI
  - Anthropic Claude API
  - Playwright
  - SQLite
highlights:
  - Architected a 5-tier extraction cascade (structured data parsing → CSS heuristics → LLM extraction → agentic browser automation → AI web search) that escalates cost only on failure, minimizing per-product API spend.
  - Integrated the Anthropic Claude API (Sonnet agent with constrained tool-use, Haiku for cheap extraction) with Playwright browser automation, including prompt caching and hard cost/turn budgets to control per-job spend.
  - Implemented a human-in-the-loop review UI (approve/edit/reject extracted data, live SSE job progress, cost tracking) and Excel export/analytics dashboard, backed by a local SQLite store.
featured: true
weight: 30
---

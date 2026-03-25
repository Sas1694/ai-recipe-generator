# 🤖 AGENTS.md — AI Recipe Generator

This file defines how AI coding assistants (GitHub Copilot, ChatGPT, etc.)
must understand, extend, and generate code for this project.

It is CRITICAL that all generated code follows these rules.

---

# 🧠 PROJECT CONTEXT

This project is an AI-powered web application that generates cooking recipes
based on user-provided ingredients.

Core flow:

1. User uploads image
2. AI detects ingredients
3. User confirms ingredients (Human-in-the-Loop)
4. AI generates recipe
5. Recipe is stored
6. User can generate dish image
7. Image is stored and displayed

The system integrates multiple AI services:
- Vision model → ingredient detection
- LLM → recipe generation
- Image model → dish image generation

---

# 🏗️ ARCHITECTURE (MANDATORY)

The project follows a **modular, domain-oriented architecture** on top of Next.js App Router.

## Layers:

- `app/` → Presentation layer (UI, pages, components)
- `modules/` → Business logic (domain-driven modules)
- `shared/` → Shared infrastructure (DB, AI clients, utils)

---

## 🔁 REQUIRED FLOW (STRICT)

ALL business logic MUST follow this pattern:

UI (React)
→ Server Action
→ Use Case
→ Service (AI / external)
→ Repository (DB)

---

## ❌ FORBIDDEN

- Do NOT call AI services directly from UI
- Do NOT access database from UI
- Do NOT skip use-case layer
- Do NOT mix responsibilities between layers
- Do NOT place business logic inside components

---

# 🧩 MODULE STRUCTURE (STRICT)

Each domain module MUST follow this structure:

module-name/

  actions/
  use-cases/
  services/
  repositories/   (if persistence needed)
  domain/
  types/

---

## Responsibilities:

### actions/
- Entry point from UI
- Validate input
- Call use-cases
- Return result

### use-cases/
- Orchestrate business logic
- No framework-specific code
- No direct external API calls

### services/
- External integrations (AI, APIs)
- No business logic

### repositories/
- Database access (Prisma)
- No business logic

### domain/
- Core entities

---

# 🤖 AI INTEGRATION RULES

This project uses an **AI-as-a-Service architecture**.

## General rules:

- NEVER call OpenAI directly outside `services/`
- ALWAYS go through shared clients (`shared/ai/`)
- ALWAYS return structured data (JSON)

---

## Recipe Generation

- Model: `gpt-4o-mini` (default)
- Must return STRICT JSON
- Must follow predefined schema

### Critical:

- No free text responses
- No explanations outside JSON
- Must be parseable

---

## Ingredient Detection

- Model: `gpt-4o-mini`
- Must return:
["ingredient1", "ingredient2"]

Rules:
- lowercase
- singular
- no duplicates
- high confidence only

---

## Image Generation

- Model: `gpt-image-1-mini`
- Use `visual_description` from recipe
- Do NOT invent new data
- Focus on realism

---

# 🧠 HUMAN-IN-THE-LOOP (CRITICAL)

AI output is NOT final.

User MUST:

- review ingredients
- edit ingredient list
- confirm before recipe generation

NEVER skip this step.

---

# 💾 DATA RULES

## Uploaded Images
- MUST NOT be stored permanently
- Used only for processing

## Generated Content
- Recipes MUST be stored before returning
- Images MUST be stored with reference in DB

---

# 🧪 TESTING STRATEGY

- Focus on testing:
  - use-cases
  - business logic

- Do NOT test:
  - UI components

---

# 🧱 NAMING CONVENTIONS

Use explicit, descriptive names:

- `generateRecipeAction`
- `generateRecipe`
- `recipeGeneratorService`
- `recipeRepository`

---

# ⚠️ COMMON MISTAKES (AVOID)

- Mixing UI + business logic
- Skipping use-case layer
- Calling OpenAI from wrong layer
- Returning unstructured AI responses
- Not validating inputs in actions
- Duplicating logic across modules

---

# 🎯 GOAL

Generate code that is:

- Modular
- Scalable
- Maintainable
- Consistent with architecture
- AI-cost aware

---

# 🧠 FINAL RULE

When in doubt:

👉 FOLLOW THE ARCHITECTURE, NOT SHORTCUTS

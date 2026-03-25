# 🤖 AI_RULES.md

## 🎯 Purpose

This file defines the **rules and constraints** that any AI assistant (GitHub Copilot, ChatGPT, etc.) MUST follow when generating code for this project.

The goal is to ensure:

* Architectural consistency
* Maintainability
* Predictability of generated code
* Alignment with project design decisions

---

# 🧠 General Principles

## 1. Follow the Architecture STRICTLY

The project uses a **modular domain-driven architecture**:

* `app/` → Presentation layer
* `modules/` → Business logic (domain-based)
* `shared/` → Shared infrastructure

AI MUST:

* NEVER mix layers
* NEVER place business logic inside UI components
* NEVER bypass use-cases

---

## 2. Respect Separation of Concerns

Each layer has a single responsibility:

| Layer        | Responsibility      |
| ------------ | ------------------- |
| app          | UI / interaction    |
| actions      | Entry point from UI |
| use-cases    | Business logic      |
| services     | External APIs       |
| repositories | Database access     |

AI MUST:

* Use **actions → use-cases → services/repositories**
* NEVER call services directly from UI
* NEVER access DB outside repositories

---

## 3. Use Server Actions as Entry Points

* All client interactions MUST go through **Server Actions**
* Actions must be thin (no logic)

✅ Correct:
action → use-case → service

❌ Incorrect:
component → service

---

## 4. AI Integration Rules

The system follows an **AI-as-a-Service architecture**.

AI MUST:

* NEVER implement custom ML models
* ALWAYS call services (e.g., `recipeGeneratorService`)
* NEVER embed prompts in UI or components

Prompts MUST live in:

* service layer

---

## 5. Strict Type Safety

* ALWAYS use TypeScript
* NEVER use `any`
* ALWAYS define types in `/types`

AI MUST:

* Return strongly typed objects
* Respect DTO structures

---

## 6. Do NOT Break Domain Boundaries

Each module is independent:

Example:

* `recipe` module MUST NOT access `ingredient-detection` internals

Communication ONLY through:

* use-cases
* shared types (if needed)

---

## 7. Database Access Rules

* ONLY repositories can access Prisma
* NEVER access Prisma directly from:

  * use-cases
  * services
  * actions

---

## 8. Naming Conventions

### Files

* actions → `*Action.ts`
* use-cases → verb-based (`generateRecipe.ts`)
* services → `*Service.ts`
* repositories → `*Repository.ts`

### Variables

* clear, explicit names
* no abbreviations

---

## 9. No Business Logic in UI

React components MUST:

* Only handle rendering and user interaction

AI MUST NOT:

* Add logic inside components
* Add data transformations in UI

---

## 10. Error Handling

* Use consistent error handling
* NEVER throw raw errors to UI

---

## 11. Keep Functions Small

* One responsibility per function
* Prefer composition over large functions

---

## 12. Follow Existing Patterns First

Before generating new code, AI MUST:

1. Look for similar implementations
2. Reuse patterns
3. Stay consistent

---

# 🚫 Forbidden Practices

AI MUST NEVER:

* Mix layers (e.g., UI + business logic)
* Call external APIs directly from UI
* Access database outside repositories
* Hardcode prompts in random files
* Use `any` type
* Create unnecessary abstractions
* Ignore existing project structure

---

# ✅ Expected Behavior from AI

When generating code, AI SHOULD:

1. Identify the correct module
2. Place files in the correct folder
3. Follow naming conventions
4. Respect architecture flow
5. Generate clean, production-ready code

---

# 🧠 Mental Model for AI

When solving a feature, always think:

UI → Action → Use Case → Service → Repository → DB

---

# 📌 Final Rule

If unsure:
👉 Follow existing code patterns
👉 Do NOT invent new architecture

Consistency > Creativity

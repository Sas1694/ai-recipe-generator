# 🏗️ ARCHITECTURE.md

## 📌 Overview

This document describes the architecture of the **AI Recipe Generator** application, including system design, architectural principles, module organization, and integration with AI services.

The system is designed as a modern, scalable web application that integrates AI capabilities while maintaining clean separation of concerns and modularity.

The architecture follows a **domain-oriented modular approach** built on top of **Next.js App Router**. 

---

# 🧠 High-Level Architecture

The system is composed of the following main layers:

```
Client (Browser)
   ↓
Next.js Frontend (App Router)
   ↓
Server Actions / API Routes
   ↓
Application Layer (Use Cases)
   ↓
Domain Layer (Entities)
   ↓
Infrastructure Layer (Repositories, AI Services, DB)
```

---

# 🧱 Architectural Principles

## 1. Separation of Concerns

Each layer has a clearly defined responsibility:

* **Presentation Layer** → UI and user interaction
* **Application Layer** → Orchestration of use cases
* **Domain Layer** → Business entities and rules
* **Infrastructure Layer** → External systems (DB, AI, Auth)

---

## 2. Modular Architecture (Feature-Based)

The system is organized into **independent modules per domain**:

* ingredient-detection
* recipe
* image-generation
* auth

Each module encapsulates:

* actions
* use-cases
* services
* repositories
* domain entities
* types

---

## 3. AI-as-a-Service

The system **does not train models locally**.

Instead, it integrates external AI providers for:

* ingredient detection (vision model)
* recipe generation (LLM)
* image generation

This reduces infrastructure complexity and improves scalability. 

---

## 4. Human-in-the-Loop

AI outputs are **validated by the user before being used**:

* Ingredient detection is editable
* Only confirmed data is used downstream

This improves reliability without increasing AI cost.

---

## 5. Stateless Backend

* Uses **JWT sessions**
* No session persistence in database
* Scales easily across serverless environments

---

# 🧩 Project Structure

```
src/

app/              → Presentation layer (Next.js App Router)
modules/          → Domain modules (business logic)
shared/           → Shared infrastructure and utilities
```

---

## 🖥️ Presentation Layer (`app/`)

Responsible for:

* Pages
* Layouts
* UI components
* User interactions

Examples:

* `/generate` → upload image + edit ingredients
* `/recipes` → list of recipes
* `/recipes/[id]` → recipe detail

---

## ⚙️ Domain Modules (`modules/`)

Each module represents a **bounded context**.

---

### 🥕 ingredient-detection

Handles:

* Image analysis
* Ingredient extraction
* User confirmation

Flow:

```
Image → Vision Model → Ingredient List → User Edit → Confirm
```

---

### 🍳 recipe

Core business domain.

Handles:

* Recipe generation via LLM
* Recipe persistence
* Recipe retrieval

---

### 🖼️ image-generation

Handles:

* AI image generation
* Storage of generated images
* Linking images to recipes

---

### 🔐 auth

Handles:

* User authentication
* Login / Register / Logout
* Session management

---

## 🔗 Shared Layer (`shared/`)

Reusable infrastructure:

* Database (Prisma + PostgreSQL)
* AI clients
* Auth configuration
* Utilities
* Global types

---

# 🔄 Core System Flows

## 1. Ingredient Detection Flow

```
User uploads image
   ↓
Vision model analyzes image
   ↓
System returns detected ingredients
   ↓
User edits list
   ↓
User confirms ingredients
```

---

## 2. Recipe Generation Flow

```
Confirmed ingredients
   ↓
Backend builds prompt
   ↓
LLM generates recipe
   ↓
Recipe stored in DB
   ↓
Recipe returned to UI
```

---

## 3. Image Generation Flow

```
User requests image
   ↓
Backend builds visual prompt
   ↓
Image model generates image
   ↓
Image stored in storage
   ↓
Reference saved in DB
```

---

# 🗄️ Data Architecture

## Main Entities

* **User**
* **Recipe**
* **RecipeIngredient**
* **RecipeStep**
* **RecipeImage**

Key decisions:

* Ingredients are stored per recipe (no global catalog)
* Images stored externally, only references in DB
* Uploaded images are NOT persisted

---

# 🤖 AI Integration Architecture

```
Frontend
   ↓
Server Action
   ↓
Use Case
   ↓
AI Service
   ↓
OpenAI API
   ↓
Usage Logger
   ↓
Database
```

---

## AI Services

* Vision Model → ingredient detection
* LLM → recipe generation
* Image Model → dish visualization

---

## Cost Control Strategies

* Model tiering (free vs premium)
* Request limits per user
* Response caching
* Usage logging
* Pre-request cost estimation

---

# 🔐 Authentication Architecture

* Auth.js (NextAuth)
* Credentials provider
* JWT-based sessions

Key characteristics:

* No session table
* No account table
* Only `User` persisted

---

# ☁️ Deployment Architecture

* Platform: **Vercel**
* Frontend + Backend unified (Next.js)
* Serverless functions
* Automatic previews per branch

---

# 🔄 CI/CD & Development Workflow

* GitHub Actions (CI)
* Pull Request workflow
* Branching strategy:

```
feature → develop → main
```

* Automated checks:

  * TypeScript
  * Lint
  * Build

---

# 🧠 Key Architectural Decisions

## Do Not Store Uploaded Images

* Improves privacy
* Reduces storage cost
* Simplifies system

---

## Persist Before Display

* Guarantees data consistency
* Avoids UI showing non-persisted data

---

## Domain-Oriented Design

* Scalable
* Maintainable
* Easy to extend

---

# 🚀 Future Scalability

The architecture allows easy extension with:

* Meal planning
* Shopping lists
* Nutritional analysis
* Personalization
* Subscription plans

---

# 🧾 Conclusion

This architecture provides:

* Clear separation of concerns
* Scalable AI integration
* Modular domain structure
* Cost-controlled AI usage
* Production-ready foundation

It is designed to balance **practical implementation**, **AI capabilities**, and **software engineering best practices**.

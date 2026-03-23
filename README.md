# 🍳 AI Recipe Generator

An AI-powered web application that generates cooking recipes based on ingredients provided by the user.

Users can upload an image of their fridge or pantry, and the system uses a vision model to detect possible ingredients. After a human validation step, a language model generates a complete, structured recipe. The application can also generate a realistic AI image of the final dish.

## 🚀 Features

- 📸 Ingredient detection from images (AI vision model)
- ✍️ Human-in-the-loop ingredient validation
- 🍲 Recipe generation using LLMs
- 🧾 Structured recipe output (ingredients, steps, description)
- 🖼️ AI-generated dish visualization
- 🔐 User authentication system
- 💾 Persistent storage of recipes and generated images

## 🧠 Tech Stack

- **Frontend:** Next.js (App Router), React, TailwindCSS
- **Backend:** Next.js Server Actions / API Routes
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** Auth.js (NextAuth)
- **AI Services:**
  - Vision model for ingredient detection
  - LLM for recipe generation
  - Image generation model for dish visualization

## 🧩 Architecture

The project follows a modular, domain-oriented architecture:

- `app/` → Presentation layer (UI)
- `modules/` → Domain-based modules (ingredient detection, recipes, image generation, auth)
- `shared/` → Shared infrastructure (AI clients, database, config)

## 🔄 Main Flow

1. Upload image
2. AI detects ingredients
3. User validates ingredients
4. Generate recipe
5. Store and display recipe
6. Generate dish image
7. Store and display image

## 🎯 Goal

This project demonstrates how to integrate AI services into a modern web architecture while maintaining scalability, usability, and clean system design.

## 📄 License

MIT License

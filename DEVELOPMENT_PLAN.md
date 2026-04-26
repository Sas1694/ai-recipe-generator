# 📋 Plan de Desarrollo — AI Recipe Generator

> **Metodología: TDD (Test-Driven Development)**
>
> Cada módulo sigue estrictamente el ciclo **Red → Green → Refactor**:
> 1. Definir el use-case y sus contratos (tipos, interfaces)
> 2. Escribir los tests (🔴 RED — los tests fallan porque no hay implementación)
> 3. Implementar el código mínimo para pasar los tests (🟢 GREEN)
> 4. Refactorizar manteniendo los tests en verde (🔵 REFACTOR)
> 5. Conectar con la capa de presentación (UI)
>
> **Scope de testing**: Solo use-cases, mockeando servicios y repositorios.
> **No se testea**: UI, componentes, páginas.

---

## Estado Actual

| Componente | Estado |
|---|---|
| Next.js 16 + TypeScript + Tailwind 4 | ✅ Listo |
| Prisma 7.5 + esquema completo | ✅ Listo |
| PostgreSQL en Neon + migración aplicada | ✅ Listo |
| Cliente Prisma singleton (`lib/prisma.ts`) | ✅ Listo |
| Documentación del proyecto | ✅ Listo |
| Infraestructura compartida (Fase 1) | ✅ Listo |
| Autenticación (Fase 2) | ✅ Listo |
| Detección de ingredientes (Fase 3) | ✅ Listo |
| Generación de recetas (Fase 4) | ✅ Listo |
| Generación de imágenes (Fase 5) | ✅ Listo |
| Polish y producción (Fase 6) | ❌ No implementado |

**Progreso actual:** Fase 5 completada. 25 tests pasando. Listo para Fase 6.

---

## Fase 1 — Infraestructura Compartida

> **Objetivo**: Establecer la base técnica que todos los módulos necesitan.
> Esta fase no incluye lógica de negocio, por lo que no aplica el ciclo TDD.
> Sin embargo, es **crítico** que Vitest quede configurado aquí para que el TDD
> funcione desde la Fase 2.

### 1.1 Instalar dependencias

```bash
# Producción
npm install openai zod next-auth@beta @auth/prisma-adapter bcryptjs @vercel/blob

# Desarrollo
npm install -D vitest @types/bcryptjs
```

### 1.2 Crear `.env.example`

```
DATABASE_URL=
AUTH_SECRET=
OPENAI_API_KEY=
BLOB_READ_WRITE_TOKEN=
```

### 1.3 Configurar Vitest (PRIORITARIO)

```
vitest.config.ts
```

- Path aliases alineados con `tsconfig.json` (`@/*` → `./*`)
- Scripts en `package.json`:
  - `test` → modo watch (desarrollo TDD)
  - `test:run` → ejecución única (CI)

> ⚠️ Vitest debe estar operativo antes de cualquier otra cosa.
> Todo el desarrollo posterior depende de poder ejecutar `npm run test` en modo watch.

### 1.4 Validación de entorno

```
shared/config/env.ts
```

- Usar Zod para validar todas las variables de entorno al arrancar
- Exportar objeto tipado con las variables validadas
- Fail-fast si falta alguna variable requerida

### 1.5 Cliente OpenAI

```
shared/ai/openaiClient.ts
```

- Singleton del cliente OpenAI usando `OPENAI_API_KEY`
- Único punto de acceso al SDK de OpenAI en todo el proyecto

### 1.6 Tipos compartidos

```
shared/types/common.ts
```

- `ActionResponse<T>` — tipo genérico para respuestas de Server Actions (`{ success, data?, error? }`)

### 1.7 Activar CI pipeline

- Descomentar pasos en `.github/workflows/ci.yml`: install, lint, build, test

### Verificación

- [x] `npm run test` arranca Vitest en modo watch ✅
- [x] `npm run test:run` ejecuta (aunque 0 tests) ✅
- [x] `npm run build` compila sin errores ✅
- [x] La validación de env lanza error si falta `OPENAI_API_KEY` ✅

---

## Fase 2 — Módulo de Autenticación

> **Objetivo**: Registro, login y protección de rutas. Requisito previo para cualquier feature que necesite `userId`.
>
> **Depende de**: Fase 1 (Vitest configurado, Zod, bcryptjs)

### Ciclo TDD

#### Paso 1 — Definir contratos (tipos e interfaces)

Definir las interfaces que los use-cases necesitan **antes de implementar nada**.
Esto permite escribir tests contra contratos, no contra implementaciones concretas.

```
modules/auth/types/index.ts
```

- Interfaces para `UserRepository` y `AuthService`
- Tipos de entrada/salida de los use-cases

#### Paso 2 — 🔴 Escribir tests (RED)

```
modules/auth/use-cases/__tests__/registerUser.test.ts
modules/auth/use-cases/__tests__/loginUser.test.ts
```

Escribir tests con mocks de las interfaces definidas. **Los tests fallan.**

**Tests para `registerUser`:**
- ✅ Registro exitoso: crea usuario y retorna datos
- ❌ Email duplicado: lanza error si el email ya existe
- ❌ Datos inválidos: lanza error con campos vacíos

**Tests para `loginUser`:**
- ✅ Login correcto: retorna usuario con credenciales válidas
- ❌ Email no encontrado: lanza error
- ❌ Password incorrecto: lanza error

#### Paso 3 — 🟢 Implementar (GREEN)

Implementar el código mínimo para que los tests pasen, en este orden:

```
modules/auth/services/authService.ts         → hashPassword, verifyPassword
modules/auth/repositories/userRepository.ts  → createUser, findByEmail
modules/auth/use-cases/registerUser.ts       → orquesta registro
modules/auth/use-cases/loginUser.ts          → orquesta login
```

**Ejecutar `npm run test` después de cada fichero. Los tests deben ir pasando progresivamente.**

#### Paso 4 — 🔵 Refactorizar (REFACTOR)

- Revisar duplicación
- Mejorar naming si es necesario
- **Los tests deben seguir en verde**

#### Paso 5 — Capas de integración (fuera del ciclo TDD)

Estas capas conectan los use-cases con el framework. No se testean.

```
shared/auth/authConfig.ts                    → Auth.js v5, Credentials provider, JWT
modules/auth/actions/registerAction.ts       → Validación Zod + registerUser
modules/auth/actions/loginAction.ts          → Validación Zod + loginUser
modules/auth/actions/logoutAction.ts         → signOut de Auth.js
```

#### Paso 6 — UI

```
app/auth/login/page.tsx
app/auth/register/page.tsx
```

#### Paso 7 — Proxy (protección de rutas)

```
proxy.ts
```

- Proteger rutas `/generate`, `/recipes` — redirigir a `/auth/login` si no autenticado
- Next.js 16 recomienda `proxy.ts` en lugar de `middleware.ts`

### Verificación

- [x] **Tests pasan**: `npm run test:run` → todos en verde ✅ (registerUser.test.ts, loginUser.test.ts)
- [x] Registro de usuario funciona y se persiste en BD ✅
- [x] Login devuelve sesión JWT válida ✅
- [x] Rutas protegidas redirigen a login ✅

---

## Fase 3 — Módulo de Detección de Ingredientes

> **Objetivo**: Upload de imagen → IA detecta ingredientes → usuario revisa y edita lista (Human-in-the-Loop).
>
> **Depende de**: Fase 1 (OpenAI client), Fase 2 (auth)

### Ciclo TDD

#### Paso 1 — Definir contratos

```
modules/ingredient-detection/types/index.ts
```

- Interface `VisionModelService` con método `detectIngredients(imageBase64: string): Promise<string[]>`
- Tipos de entrada/salida

#### Paso 2 — 🔴 Escribir tests (RED)

```
modules/ingredient-detection/use-cases/__tests__/detectIngredients.test.ts
```

**Tests para `detectIngredients`:**
- ✅ Detección exitosa: retorna array de ingredientes normalizados
- ❌ Imagen vacía/inválida: lanza error
- ❌ Respuesta malformada del modelo: maneja error gracefully

#### Paso 3 — 🟢 Implementar (GREEN)

```
shared/ai/visionClient.ts                                    → Wrapper vision gpt-4o-mini
modules/ingredient-detection/services/visionModelService.ts   → Envía imagen + prompt, parsea JSON
modules/ingredient-detection/use-cases/detectIngredients.ts   → Orquesta detección
```

**`npm run test` después de cada fichero.**

#### Paso 4 — 🔵 Refactorizar (REFACTOR)

- Verificar normalización (lowercase, singular, sin duplicados)
- **Tests en verde**

#### Paso 5 — Capas de integración

```
modules/ingredient-detection/actions/detectIngredientsAction.ts
```

- Validar imagen (Zod): formato válido, tamaño máximo
- Llamar a use-case
- Retornar `ActionResponse<string[]>`

#### Paso 6 — UI

```
app/generate/page.tsx
app/generate/components/ImageUploader.tsx
app/generate/components/IngredientListEditor.tsx
```

- **ImageUploader**: subir foto, preview, enviar a action
- **IngredientListEditor**: mostrar ingredientes detectados, permitir añadir/eliminar/editar, botón de confirmar
- Flujo en la página: upload → loading → editar lista → confirmar

### Verificación

- [x] **Tests pasan**: `npm run test:run` → todos en verde ✅ (detectIngredients.test.ts)
- [x] Subir imagen muestra ingredientes detectados ✅
- [x] Se pueden editar, añadir y eliminar ingredientes ✅
- [x] El botón de confirmar envía la lista final ✅

---

## Fase 4 — Módulo de Generación de Recetas

> **Objetivo**: Ingredientes confirmados → IA genera receta → almacenada en BD → mostrada al usuario.
>
> **Depende de**: Fase 3

### Ciclo TDD

#### Paso 1 — Definir contratos

```
modules/recipe/types/GeneratedRecipe.ts   → Estructura retornada por el LLM
modules/recipe/types/RecipeDTO.ts         → DTO para transporte a UI
modules/recipe/types/index.ts             → Interfaces: RecipeRepository, RecipeGeneratorService
```

#### Paso 2 — 🔴 Escribir tests (RED)

```
modules/recipe/use-cases/__tests__/generateRecipe.test.ts
```

**Tests para `generateRecipe`:**
- ✅ Generación exitosa: nueva receta creada, vinculada al usuario
- ✅ Caché: mismos ingredientes → retorna receta existente **sin llamar al LLM**
- ❌ Límite diario: rechaza si ≥ 5 recetas hoy
- ❌ Ingredientes vacíos: lanza error
- ✅ Vinculación: receta cacheada se vincula al nuevo usuario vía UserRecipe

> Este es el use-case con más lógica de negocio del proyecto.
> Los tests documentan el comportamiento esperado del caché y el límite diario.

#### Paso 3 — 🟢 Implementar (GREEN)

```
shared/ai/recipeClient.ts                                → Wrapper chat completion gpt-4o-mini
modules/recipe/repositories/recipeRepository.ts           → CRUD + findByIngredientHash + countUserRecipesToday
modules/recipe/services/recipeGeneratorService.ts         → Construir prompt, llamar LLM, parsear + validar con Zod
modules/recipe/use-cases/generateRecipe.ts                → Orquesta: hash → caché → LLM → guardar → vincular
modules/recipe/use-cases/getRecipe.ts                     → Obtener receta por ID
modules/recipe/use-cases/listUserRecipes.ts               → Listar recetas del usuario
```

**`npm run test` después de cada fichero.**

#### Paso 4 — 🔵 Refactorizar (REFACTOR)

- Verificar lógica de hash (sort + normalize + hash determinista)
- Revisar manejo de transacciones en repository
- **Tests en verde**

#### Paso 5 — Capas de integración

```
modules/recipe/actions/generateRecipeAction.ts      → Validar ingredients (Zod), userId de sesión, llamar use-case
modules/recipe/actions/getRecipeAction.ts            → Validar UUID, llamar use-case
modules/recipe/actions/listUserRecipesAction.ts      → userId de sesión, llamar use-case
```

#### Paso 6 — UI

```
app/generate/page.tsx                → Actualizar: añadir paso de generación tras confirmar ingredientes
app/recipes/page.tsx                 → Lista de recetas del usuario
app/recipes/[id]/page.tsx            → Detalle de receta (título, descripción, ingredientes, pasos)
```

### Verificación

- [x] **Tests pasan**: `npm run test:run` → todos en verde ✅ (generateRecipe.test.ts, getRecipe.test.ts, listUserRecipes.test.ts)
- [x] Confirmar ingredientes genera receta y la muestra ✅
- [x] La receta se persiste en BD con ingredientes y pasos ✅
- [x] Mismos ingredientes reusan receta cacheada (no llaman al LLM) ✅
- [x] Se rechaza al usuario si supera 5 recetas/día ✅
- [x] Lista de recetas muestra todas las del usuario ✅
- [x] Detalle de receta muestra toda la información ✅

---

## Fase 5 — Módulo de Generación de Imágenes

> **Objetivo**: Generar imagen IA del plato usando `visual_description` de la receta.
>
> **Depende de**: Fase 4

### Ciclo TDD

#### Paso 1 — Definir contratos

```
modules/image-generation/types/index.ts
```

- Interfaces: `ImageGenerationService`, `RecipeImageRepository`

#### Paso 2 — 🔴 Escribir tests (RED)

```
modules/image-generation/use-cases/__tests__/generateDishImage.test.ts
```

**Tests para `generateDishImage`:**
- ✅ Generación exitosa: imagen creada, subida a Blob, referencia guardada en BD
- ❌ Receta no encontrada: lanza error
- ❌ Receta sin `visualDescription`: lanza error
- ❌ Fallo del modelo de imágenes: maneja error gracefully

#### Paso 3 — 🟢 Implementar (GREEN)

```
shared/ai/imageClient.ts                                       → Wrapper gpt-image-1-mini
modules/image-generation/services/imageGenerationService.ts     → Construir prompt, llamar modelo
modules/image-generation/repositories/recipeImageRepository.ts  → saveImage, findByRecipeId
modules/image-generation/use-cases/generateDishImage.ts         → Orquesta: receta → generar → Blob → BD
```

**`npm run test` después de cada fichero.**

#### Paso 4 — 🔵 Refactorizar (REFACTOR)

- **Tests en verde**

#### Paso 5 — Capas de integración

```
modules/image-generation/actions/generateDishImageAction.ts
```

- Validar `recipeId` (Zod, UUID)
- Obtener userId de sesión
- Llamar use-case
- Retornar `ActionResponse<{ imageUrl: string }>`

#### Paso 6 — UI

Actualizar `app/recipes/[id]/page.tsx`:
- Botón "Generar Imagen del Plato"
- Estado de carga durante generación
- Mostrar imagen generada

### Verificación

- [x] **Tests pasan**: `npm run test:run` → todos en verde ✅ (generateDishImage.test.ts)
- [x] Botón genera imagen y la muestra en la receta ✅
- [x] Imagen se almacena en Vercel Blob ✅
- [x] Referencia se guarda en BD (RecipeImage) ✅

---

## Fase 6 — Polish y Producción

> **Objetivo**: Landing page, UX, consistencia visual y deploy.
>
> **Depende de**: Todas las fases anteriores.
> No aplica TDD (no hay lógica de negocio nueva).

### 6.1 Landing Page

```
app/page.tsx
```

**Comportamiento según autenticación:**
- Usuario no autenticado → muestra la landing page
- Usuario autenticado → redirige automáticamente a `/generate` (server-side redirect)

**Estructura de la landing:**
1. **Hero Section** — Propuesta de valor: "Cocina con lo que ya tienes en casa". CTA principal: "Empezar" → `/auth/register`. CTA secundario: "Iniciar sesión" → `/auth/login`
2. **Cómo funciona** — Flujo visual: subir imagen → editar ingredientes → generar receta → visualizar plato
3. **Propuesta de valor** — Beneficios clave: usa ingredientes que ya tienes, reduce desperdicio, IA, experiencia rápida
4. **CTA final** — Refuerzo de conversión con botón hacia el flujo principal

### 6.2 Componentes shadcn/ui

- Instalar librería de componentes
- Refinar formularios, botones, cards, toasts
- Consistencia visual en todas las páginas

### 6.3 UX

- Loading states (Suspense boundaries)
- Error boundaries
- Mensajes de error amigables
- Responsive / mobile-first

### 6.4 Deploy

- Configurar variables de entorno en Vercel
- Verificar que Prisma genera correctamente en build
- Deploy a producción

### 6.5 CI completo

- Verificar que `ci.yml` ejecuta: install → lint → type-check → test → build

### Verificación

- [ ] **Todos los tests pasan**: `npm run test:run` → suite completa en verde
- [ ] Flujo completo E2E funciona: register → login → upload → editar ingredientes → generar receta → generar imagen → ver recetas
- [ ] Deploy en Vercel operativo
- [ ] CI pipeline pasa en verde

---

## Resumen Visual

```
Fase 1: Infraestructura    shared/config, shared/ai, VITEST, .env.example
   │
   ▼
Fase 2: Autenticación      🔴 tests → 🟢 impl → 🔵 refactor → actions → UI
   │
   ▼
Fase 3: Detección           🔴 tests → 🟢 impl → 🔵 refactor → actions → UI
   │
   ▼
Fase 4: Recetas             🔴 tests → 🟢 impl → 🔵 refactor → actions → UI
   │
   ▼
Fase 5: Imágenes            🔴 tests → 🟢 impl → 🔵 refactor → actions → UI
   │
   ▼
Fase 6: Polish              Landing page, shadcn/ui, deploy Vercel
```

---

## Flujo TDD por Módulo (Resumen)

Cada módulo de las fases 2–5 sigue este flujo estricto:

```
1. Definir contratos        → types/ (interfaces + tipos de entrada/salida)
2. 🔴 Escribir tests        → use-cases/__tests__/*.test.ts (FALLAN)
3. 🟢 Implementar código    → services/ → repositories/ → use-cases/ (tests PASAN)
4. 🔵 Refactorizar          → mejorar código sin romper tests
5. Conectar actions          → actions/*.ts (validación Zod + llamada a use-case)
6. Construir UI              → app/**/ (páginas y componentes)
```

> **Regla de oro**: Nunca se implementa un use-case sin que exista primero un test que lo valide.

---

## Principios de Desarrollo

| Principio | Detalle |
|---|---|
| **TDD estricto** | Tests primero (Red), implementación después (Green), refactor al final (Refactor) |
| **Vertical slices** | Cada fase entrega funcionalidad completa (tests + backend + UI) |
| **Tests → Implementación → UI** | Dentro de cada fase: tests 🔴 → código 🟢 → refactor 🔵 → actions → UI |
| **Solo se testean use-cases** | Mock de servicios y repositorios. No se testea UI |
| **Sin `src/`** | Todo en la raíz del proyecto según convenciones |
| **Auth primero** | Todas las features necesitan `userId` |
| **Arquitectura estricta** | UI → Action → Use Case → Service → Repository |

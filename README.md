# 🍳 AI Recipe Generator

> **Trabajo de Fin de Máster**  
> Generador de recetas inteligente mediante Inteligencia Artificial

Aplicación web que genera recetas de cocina personalizadas a partir de imágenes de ingredientes, utilizando modelos de IA para visión, generación de texto e imágenes.

---

## 📋 Descripción General del Proyecto

**AI Recipe Generator** es una aplicación web moderna que permite a los usuarios generar recetas de cocina completas a partir de fotografías de sus ingredientes disponibles. El sistema integra múltiples servicios de Inteligencia Artificial siguiendo una arquitectura modular y escalable.

### Contexto

Este proyecto forma parte de un Trabajo de Fin de Máster y tiene como objetivo demostrar:

- Integración práctica de múltiples servicios de IA en una aplicación web real
- Arquitectura orientada a dominios en aplicaciones Next.js modernas
- Implementación de patrones de diseño y buenas prácticas en desarrollo web
- Validación humana en flujos de trabajo de IA (Human-in-the-Loop)
- Sistema de autenticación y persistencia de datos

### Flujo Principal

1. **Carga de imagen**: El usuario sube una fotografía de ingredientes
2. **Detección de ingredientes**: Un modelo de visión identifica los ingredientes
3. **Validación humana**: El usuario revisa y confirma los ingredientes detectados
4. **Generación de receta**: Un modelo de lenguaje genera la receta completa
5. **Almacenamiento**: La receta se guarda en la base de datos
6. **Generación de imagen**: Opcionalmente, se genera una imagen del plato final
7. **Visualización**: El usuario puede consultar sus recetas guardadas

### Principios de Diseño

- **Human-in-the-Loop**: Las salidas de la IA son validadas por el usuario
- **IA como Servicio**: No se entrenan modelos localmente, se utilizan APIs externas
- **Arquitectura Modular**: Separación clara por dominios de negocio
- **Escalabilidad**: Backend sin estado, preparado para entornos serverless
- **Seguridad**: Autenticación robusta y validación de datos

---

## 🛠️ Stack Tecnológico

### Frontend

- **[Next.js 16](https://nextjs.org/)** - Framework de React con App Router
- **[React 19](https://react.dev/)** - Biblioteca de UI
- **[TypeScript 6](https://www.typescriptlang.org/)** - Tipado estático
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework de utilidades CSS
- **[next-intl](https://next-intl-docs.vercel.app/)** - Internacionalización (i18n)
- **[Lucide React](https://lucide.dev/)** - Iconos
- **[Radix UI](https://www.radix-ui.com/)** - Componentes accesibles

### Backend

- **Next.js Server Actions** - Lógica del servidor
- **[Prisma 7](https://www.prisma.io/)** - ORM para base de datos
- **[PostgreSQL](https://www.postgresql.org/)** - Base de datos relacional
- **[Auth.js (NextAuth)](https://authjs.dev/)** - Sistema de autenticación
- **[Zod](https://zod.dev/)** - Validación de esquemas

### Servicios de IA

- **[OpenAI GPT-4o-mini](https://openai.com/)** - Generación de recetas y detección de ingredientes
- **[OpenAI GPT-image-1-mini](https://openai.com/)** - Generación de imágenes de platos

### Infraestructura y DevOps

- **[Vercel](https://vercel.com/)** - Hosting y despliegue
- **[Neon](https://neon.tech/)** - Base de datos PostgreSQL serverless
- **[Sentry](https://sentry.io/)** - Monitorización de errores
- **[Vercel Analytics](https://vercel.com/analytics)** - Analíticas de rendimiento
- **[pnpm](https://pnpm.io/)** - Gestor de paquetes
- **[Vitest](https://vitest.dev/)** - Framework de testing
- **[ESLint](https://eslint.org/)** - Linter de código
- **[Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob)** - Almacenamiento de imágenes

---

## 📦 Instalación y Ejecución

### Requisitos Previos

- **Node.js** 18.x o superior
- **pnpm** 8.x o superior
- **PostgreSQL** 14.x o superior (o cuenta en Neon)
- **Cuenta de OpenAI** con API Key
- **Cuenta de Vercel** (para Blob Storage)

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/ai-recipe-generator.git
cd ai-recipe-generator
```

### 2. Instalar Dependencias

```bash
pnpm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
# Base de datos PostgreSQL
DATABASE_URL="postgresql://usuario:contraseña@host:5432/database"

# Secreto para NextAuth (genera uno con: openssl rand -base64 32)
AUTH_SECRET="tu-secreto-generado-aqui"

# API Key de OpenAI
OPENAI_API_KEY="sk-..."

# Token de Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="vercel_blob_..."

# Opcional: Modo desarrollo sin IA real (usa mocks)
MOCK_AI="false"

# Opcional: URL pública de la aplicación
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Opcional: Configuración de Sentry
NEXT_PUBLIC_SENTRY_DSN="https://..."
SENTRY_SEND_PII="false"
```

### 4. Configurar Base de Datos

Ejecuta las migraciones de Prisma:

```bash
pnpm prisma migrate dev
```

Genera el cliente de Prisma:

```bash
pnpm prisma generate
```

### 5. Ejecutar en Desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### 6. Ejecutar Tests

```bash
# Ejecutar tests en modo watch
pnpm test

# Ejecutar tests una vez
pnpm test:run
```

### 7. Compilar para Producción

```bash
# Compilar la aplicación
pnpm build

# Ejecutar en modo producción
pnpm start
```

### Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `pnpm dev` | Inicia el servidor de desarrollo |
| `pnpm build` | Compila la aplicación para producción |
| `pnpm start` | Ejecuta la aplicación compilada |
| `pnpm lint` | Ejecuta el linter de código |
| `pnpm test` | Ejecuta los tests en modo watch |
| `pnpm test:run` | Ejecuta los tests una vez |
| `pnpm prisma studio` | Abre Prisma Studio para gestionar la BD |
| `pnpm prisma migrate dev` | Crea y aplica migraciones |

---

## 🏗️ Estructura del Proyecto

El proyecto sigue una **arquitectura modular orientada a dominios**, organizando el código en capas claramente definidas:

```
ai-recipe-generator/
│
├── app/                          # Capa de presentación (Next.js App Router)
│   ├── [locale]/                 # Rutas internacionalizadas
│   │   ├── page.tsx              # Página principal
│   │   ├── generate/             # Generación de recetas
│   │   │   ├── page.tsx
│   │   │   └── components/
│   │   ├── recipes/              # Lista y detalle de recetas
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   └── components/
│   │   ├── auth/                 # Autenticación (login/registro)
│   │   ├── settings/             # Configuración de usuario
│   │   └── legal/                # Páginas legales
│   ├── api/                      # API Routes
│   └── globals.css               # Estilos globales
│
├── modules/                      # Módulos de dominio (lógica de negocio)
│   ├── auth/                     # Autenticación
│   │   ├── actions/              # Server Actions
│   │   ├── use-cases/            # Casos de uso
│   │   ├── services/             # Servicios externos
│   │   ├── repositories/         # Acceso a datos
│   │   └── types/                # Tipos y esquemas
│   ├── ingredient-detection/     # Detección de ingredientes
│   ├── recipe/                   # Gestión de recetas
│   └── image-generation/         # Generación de imágenes
│
├── shared/                       # Infraestructura compartida
│   ├── ai/                       # Clientes de IA
│   │   ├── openaiClient.ts
│   │   ├── visionClient.ts
│   │   ├── recipeClient.ts
│   │   ├── imageClient.ts
│   │   └── mocks/                # Mocks para testing
│   ├── auth/                     # Configuración de Auth.js
│   ├── config/                   # Configuración y variables de entorno
│   └── types/                    # Tipos compartidos
│
├── components/                   # Componentes UI reutilizables
│   └── ui/                       # Componentes base (shadcn/ui)
│
├── lib/                          # Utilidades y helpers
│   ├── prisma.ts                 # Cliente singleton de Prisma
│   └── utils.ts                  # Funciones de utilidad
│
├── prisma/                       # Esquema y migraciones de base de datos
│   ├── schema.prisma
│   └── migrations/
│
├── messages/                     # Traducciones i18n
│   ├── es.json
│   └── en.json
│
├── public/                       # Archivos estáticos
│
├── .env                          # Variables de entorno (no commitear)
├── .env.example                  # Plantilla de variables de entorno
├── package.json                  # Dependencias del proyecto
├── tsconfig.json                 # Configuración de TypeScript
├── tailwind.config.ts            # Configuración de Tailwind CSS
├── next.config.ts                # Configuración de Next.js
├── vitest.config.ts              # Configuración de tests
└── prisma.config.ts              # Configuración de Prisma
```

### Organización por Capas

#### 1. Capa de Presentación (`app/`)

Contiene toda la interfaz de usuario:
- Páginas y rutas
- Componentes de UI específicos de cada página
- Layouts y estructuras de navegación

#### 2. Capa de Aplicación (`modules/*/actions/` y `modules/*/use-cases/`)

Orquesta la lógica de negocio:
- **Actions**: Puntos de entrada desde el frontend (Server Actions)
- **Use Cases**: Implementación de casos de uso del negocio
- Validación de entrada y manejo de errores

#### 3. Capa de Dominio (`modules/*/domain/`)

Define las entidades y reglas de negocio:
- Modelos de dominio
- Lógica de negocio pura
- Interfaces y contratos

#### 4. Capa de Infraestructura (`modules/*/services/` y `modules/*/repositories/`)

Interactúa con sistemas externos:
- **Services**: Comunicación con APIs externas (OpenAI, Vercel Blob)
- **Repositories**: Acceso a la base de datos (Prisma)
- Implementación de interfaces definidas en el dominio

### Flujo de Datos

```
Usuario → UI (React)
        ↓
  Server Action
        ↓
    Use Case
        ↓
  Service / Repository
        ↓
  API Externa / Base de Datos
```

---

## ⚡ Funcionalidades Principales

### 1. 🔐 Sistema de Autenticación

- **Registro de usuarios** con email y contraseña
- **Login seguro** con contraseñas hasheadas (bcrypt)
- **Sesiones JWT** gestionadas con Auth.js
- **Protección de rutas** automática
- **Gestión de cuenta** (actualización de perfil, eliminación de cuenta)

**Tecnologías**: Auth.js, Prisma Adapter, bcrypt

### 2. 📸 Detección de Ingredientes mediante IA

- **Carga de imágenes** desde dispositivo o cámara
- **Análisis de imagen** con GPT-4o-mini (Vision)
- **Extracción automática** de ingredientes visibles
- **Lista editable** de ingredientes detectados
- **Validación humana** antes de generar receta

**Flujo**:
```
Imagen → Modelo de Visión → Lista de Ingredientes → Validación Usuario → Confirmación
```

**Tecnologías**: OpenAI GPT-4o-mini, Vision API, Next.js File Upload

### 3. 🍳 Generación de Recetas con LLM

- **Generación automática** de recetas basadas en ingredientes confirmados
- **Recetas estructuradas** con:
  - Título y descripción
  - Lista de ingredientes con cantidades
  - Pasos detallados de preparación
  - Número de porciones
  - Descripción visual para generación de imagen
- **Respuestas en JSON estructurado** para fiabilidad

**Tecnologías**: OpenAI GPT-4o-mini, Zod para validación de esquemas

### 4. 🖼️ Generación de Imágenes del Plato

- **Generación de imagen** del plato final usando GPT-image-1-mini
- **Almacenamiento en la nube** con Vercel Blob
- **Vinculación automática** con la receta
- **Visualización** en la página de detalle de receta
- **Optimización** de prompts para realismo

**Tecnologías**: OpenAI GPT-image-1-mini, Vercel Blob Storage

### 5. 💾 Gestión de Recetas

- **Almacenamiento persistente** de todas las recetas generadas
- **Listado de recetas** del usuario con paginación
- **Vista detallada** de cada receta
- **Metadatos automáticos**: fecha de creación, usuario, ingredientes

**Tecnologías**: PostgreSQL, Prisma ORM

### 6. 🌍 Internacionalización (i18n)

- **Soporte multiidioma**: Español e Inglés
- **Traducción automática** de toda la interfaz
- **Páginas legales** en ambos idiomas

**Tecnologías**: next-intl

### 7. 📊 Monitorización y Analytics

- **Seguimiento de errores** en producción con Sentry
- **Métricas de rendimiento** con Vercel Speed Insights
- **Analíticas de uso** con Vercel Analytics
- **Logs estructurados** para debugging

**Tecnologías**: Sentry, Vercel Analytics, Vercel Speed Insights

### 8. ⚙️ Características Técnicas Avanzadas

- **Server Components** de React para mejor rendimiento
- **Server Actions** para mutaciones sin API Routes
- **Sistema de caché** inteligente
- **Modo Mock** para desarrollo sin consumir APIs
- **Testing automatizado** con Vitest
- **CI/CD** con GitHub Actions y Vercel

---

## 🧪 Testing

El proyecto implementa testing de casos de uso siguiendo **TDD (Test-Driven Development)**:

- 🎯 **Cobertura** de casos de uso críticos
- 🔄 **Mocks** de servicios externos (IA, Base de datos)
- ⚡ **Ejecución rápida** con Vitest

### Ejecutar Tests

```bash
# Modo watch (recomendado para desarrollo)
pnpm test

# Ejecutar una vez
pnpm test:run

# Con cobertura
pnpm test:run --coverage
```

---

## 📚 Documentación Adicional

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Arquitectura detallada del sistema
- **[DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md)** - Plan de desarrollo y fases
- **[AGENTS.md](AGENTS.md)** - Guía para asistentes de IA
- **Prisma Schema** - `prisma/schema.prisma` - Esquema de base de datos

---

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Validación de entrada con Zod
- ✅ Protección CSRF en formularios
- ✅ Headers de seguridad configurados
- ✅ Sanitización de inputs de usuario
- ✅ Rate limiting en APIs
- ✅ Variables de entorno nunca expuestas al cliente

---

## 🤝 Contribución

Este proyecto es parte de un TFM académico. Si deseas contribuir o reportar issues:

1. Abre un issue describiendo el problema o mejora
2. Fork el repositorio
3. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
4. Commit tus cambios (`git commit -m 'Añade nueva funcionalidad'`)
5. Push a la rama (`git push origin feature/nueva-funcionalidad`)
6. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está licenciado bajo la **Licencia MIT**. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

**Sergio Álvaro Sampedro**

- 🔗 LinkedIn: [linkedin.com/in/sergio-alvaro-sampedro/](https://www.linkedin.com/in/sergio-alvaro-sampedro/)
- 💻 GitHub: [@Sas1694](https://github.com/Sas1694)

---

**⭐ Si este proyecto te resulta útil, considera darle una estrella en GitHub**


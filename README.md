# Nutrifix - AI-Powered Nutrition Marketplace Backend

A RESTful API backend for connecting fitness enthusiasts with macro-optimized meals using AI-powered recommendations and intelligent meal matching algorithms.

🌐 **Live API:** https://nutrifix-ygyz.onrender.com

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Status](#project-status)
- [What I Learned](#what-i-learned)

---

## 🎯 Overview

Nutrifix addresses a common pain point for fitness enthusiasts: manually tracking macronutrients and searching for meals that fit specific protein, carbs, and fat targets. This backend API provides:

- **Macro-based meal filtering** with intelligent match scoring
- **AI-powered macro calculations** tailored to user goals (muscle gain, fat loss, maintenance)
- **Order management system** with business logic validation
- **JWT authentication** for secure user sessions
- **RESTful architecture** with clean separation of concerns

**Frontend Development:** Planned for future implementation. Current focus is on robust backend API foundation.

---

## ✨ Features

### Authentication & Security
- JWT-based authentication with httpOnly token management
- Bcrypt password hashing (10 salt rounds)
- Protected routes with middleware-based authorization
- Session management with 7-day token expiration

### Meal Discovery
- **Smart Macro Matching**: Search meals by protein/carbs/fats with configurable tolerance
- **Match Scoring Algorithm**: Ranks meals by macro accuracy (percentage-based deviation)
- **Vendor Integration**: Includes vendor details (name, address) in meal responses
- **Availability Filtering**: Only returns available meals

### Order Management
- Create orders with automatic price calculation
- Status tracking (pending, confirmed, preparing, out_for_delivery, delivered, cancelled)
- Business logic: Can only cancel orders in pending/confirmed status
- Order history with meal and vendor details

### AI-Powered Recommendations
- **Macro Advisor**: Calculates optimal protein/carbs/fats based on:
  - Age, weight, height
  - Activity level (sedentary, moderate, active, very active)
  - Fitness goal (muscle gain, fat loss, maintenance)
- **Meal Recommender**: Suggests top 5 meals matching target macros
- Powered by Groq (Llama 3.1 70B) for fast, cost-effective inference

### User Management
- Profile CRUD operations
- Order history tracking
- Secure data handling (passwords never exposed in responses)

---

## 🛠️ Tech Stack

**Backend Framework**
- Node.js 20+
- Express.js 5.x
- TypeScript 5.x

**Database**
- PostgreSQL 15+
- Prisma ORM 6.x (type-safe queries, migrations)

**Authentication**
- JSON Web Tokens (jsonwebtoken)
- Bcrypt for password hashing

**AI/ML**
- Groq SDK (Llama 3.1 8b instant)
- Custom prompt engineering for nutrition domain

**DevOps & Deployment**
- Render (web service + PostgreSQL)
- GitHub Actions (CI/CD ready)
- Environment-based configuration

**Development Tools**
- ts-node-dev (hot reload)
- Postman (API testing)
- Git (version control)

---

## 🏗️ Architecture
```
backend/
├── src/
│   ├── agents/              # AI agent logic
│   │   ├── macroAdvisor.ts       # Macro calculation agent
│   │   ├── mealRecommender.ts    # Meal suggestion agent
│   │   └── nutritionAgent.ts     # Main agent orchestrator
│   ├── ai/                  # AI infrastructure
│   │   ├── llmClient.ts          # Groq API wrapper
│   │   └── prompts.ts            # System prompts
│   ├── config/              # Configuration
│   │   └── database.ts           # Prisma client instance
│   ├── controllers/         # Request handlers
│   │   ├── authController.ts
│   │   ├── mealController.ts
│   │   ├── orderController.ts
│   │   ├── userController.ts
│   │   └── agentController.ts
│   ├── middleware/          # Express middleware
│   │   └── auth.ts               # JWT verification
│   ├── routes/              # API routes
│   │   ├── authRoutes.ts
│   │   ├── mealRoutes.ts
│   │   ├── orderRoutes.ts
│   │   ├── userRoutes.ts
│   │   └── agentRoutes.ts
│   ├── services/            # Business logic
│   │   ├── authService.ts        # Auth operations
│   │   └── mealService.ts        # Meal operations
│   ├── types/               # TypeScript definitions
│   │   └── express.d.ts          # Extended Express types
│   └── server.ts            # App entry point
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── seed.ts              # Seed data (3 vendors, 15 meals)
│   └── migrations/          # Migration history
└── docs/
    ├── Nutrifix.postman_collection.json
    └── Nutrifix.postman_environment.json
```

**Design Patterns Used:**
- **MVC Architecture**: Routes → Controllers → Services → Database
- **Dependency Injection**: Centralized Prisma client, LLM client
- **Middleware Pattern**: Auth verification, error handling
- **Service Layer**: Business logic separated from controllers

---

## 📡 API Endpoints

### Authentication (Public)
```
POST   /api/auth/register     Register new user
POST   /api/auth/login        Login existing user
```

### Meals (Public)
```
GET    /api/meals                      Get all available meals
GET    /api/meals/search               Search by macros (query params: protein, carbs, fats, tolerance)
GET    /api/meals/:id                  Get single meal details
```

### Orders (Protected - Requires JWT)
```
POST   /api/orders                     Create new order
GET    /api/orders                     Get user's order history
GET    /api/orders/:id                 Get single order details
DELETE /api/orders/:id                 Cancel order (if status allows)
```

### AI Agents (Protected - Requires JWT)
```
POST   /api/agents/suggest-macros     Get personalized macro targets
POST   /api/agents/recommend-meals  Get AI-recommended meals
```

### User Profile (Protected - Requires JWT)
```
GET    /api/users/profile              Get user profile
PUT    /api/users/profile              Update user profile
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ and npm/yarn
- PostgreSQL 15+ (or use cloud database)
- Groq API key (free at console.groq.com)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/nutrifix.git
cd nutrifix/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/nutrifix"
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
GROQ_API_KEY="your-groq-api-key"
BCRYPT_SALT_ROUNDS=10
NODE_ENV=development
```

4. **Run database migrations**
```bash
npx prisma migrate dev
```

5. **Seed the database**
```bash
npx prisma db seed
```
This creates:
- 3 vendors (FitMeal Co, Macro Kitchen, NutriHub)
- 15 meals with diverse macro profiles

6. **Start development server**
```bash
npm run dev
```

Server runs at `http://localhost:3000`

---

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/nutrifix` |
| `JWT_SECRET` | Secret for signing JWT tokens | `my-super-secret-key-32-chars-min` |
| `GROQ_API_KEY` | Groq API key for AI features | `gsk_...` |
| `BCRYPT_SALT_ROUNDS` | Bcrypt hashing rounds (optional) | `10` |
| `NODE_ENV` | Environment mode | `development` / `production` |

---

## 🗄️ Database Schema

### Overview
The database uses PostgreSQL with Prisma ORM, featuring a normalized relational design with proper indexing for query optimization.

### Entity Relationship Diagram
```
Users ──1:N──→ Orders ←──N:1── Meals ←──N:1── Vendors
                ↑
                └──N:1── Vendors
```

---

### Tables

#### **Users**
Stores customer accounts and fitness profiles for personalized macro targeting.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | Primary Key | Unique user identifier |
| `email` | String | Unique, Required | User email (login credential) |
| `passwordHash` | String | Required | Bcrypt hashed password |
| `name` | String | Required | User display name |
| `age` | Integer | Optional | For BMR calculations |
| `weight` | Float | Optional | Weight in kg |
| `height` | Float | Optional | Height in cm |
| `activityLevel` | String | Optional | `sedentary`, `light`, `moderate`, `active`, `very_active` |
| `goal` | String | Optional | `weight_loss`, `maintenance`, `muscle_gain` |
| `targetProtein` | Float | Optional | Daily protein goal (grams) |
| `targetCarbs` | Float | Optional | Daily carbs goal (grams) |
| `targetFats` | Float | Optional | Daily fats goal (grams) |
| `createdAt` | DateTime | Auto | Account creation timestamp |
| `updatedAt` | DateTime | Auto | Last profile update |

**Relationships:**
- `orders` → One-to-Many with Orders

---

#### **Vendors**
Represents food vendors/restaurants in the marketplace.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | Primary Key | Unique vendor identifier |
| `name` | String | Required | Business name |
| `email` | String | Unique, Required | Vendor contact email |
| `passwordHash` | String | Required | Bcrypt hashed password |
| `description` | String | Optional | Business description |
| `address` | String | Required | Physical address |
| `latitude` | Float | Optional | GPS coordinate (for distance calc) |
| `longitude` | Float | Optional | GPS coordinate |
| `phone` | String | Required | Contact number |
| `isVerified` | Boolean | Default: false | Admin verification status |
| `createdAt` | DateTime | Auto | Vendor registration date |
| `updatedAt` | DateTime | Auto | Last profile update |

**Relationships:**
- `meals` → One-to-Many with Meals
- `orders` → One-to-Many with Orders

---

#### **Meals**
Individual meal items with complete macro breakdown.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | Primary Key | Unique meal identifier |
| `vendorId` | UUID | Foreign Key | References `vendors.id` (Cascade Delete) |
| `name` | String | Required | Meal name |
| `description` | String | Optional | Ingredients, preparation details |
| `protein` | Float | Required | Protein content (grams) |
| `carbs` | Float | Required | Carbohydrate content (grams) |
| `fats` | Float | Required | Fat content (grams) |
| `calories` | Float | Required | Total calories (kcal) |
| `price` | Float | Required | Price in INR |
| `cuisineType` | String | Optional | `Indian`, `Continental`, `Asian`, etc. |
| `isAvailable` | Boolean | Default: true | Current availability status |
| `preparationTime` | Integer | Required | Prep time in minutes |
| `imageUrl` | String | Optional | Meal image URL |
| `createdAt` | DateTime | Auto | Meal creation timestamp |
| `updatedAt` | DateTime | Auto | Last update |

**Indexes:**
- `vendorId` (for vendor meal lookups)
- `protein, carbs, fats` (composite index for macro search)
- `isAvailable` (for filtering available meals)

**Relationships:**
- `vendor` → Many-to-One with Vendors
- `orders` → One-to-Many with Orders

---

#### **Orders**
Purchase records with delivery tracking.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | Primary Key | Unique order identifier |
| `userId` | UUID | Foreign Key | References `users.id` |
| `mealId` | UUID | Foreign Key | References `meals.id` |
| `vendorId` | UUID | Foreign Key | References `vendors.id` |
| `status` | String | Default: `pending` | Order lifecycle state |
| `quantity` | Integer | Default: 1 | Number of meals ordered |
| `totalPrice` | Float | Required | `meal.price × quantity` |
| `deliveryAddress` | String | Required | Delivery destination |
| `orderedAt` | DateTime | Auto | Order placement timestamp |
| `deliveredAt` | DateTime | Optional | Delivery completion timestamp |

**Status Values:**
- `pending` → Order placed, awaiting vendor confirmation
- `confirmed` → Vendor accepted order
- `preparing` → Meal being prepared
- `out_for_delivery` → En route to customer
- `delivered` → Successfully delivered
- `cancelled` → Order cancelled (only allowed in `pending`/`confirmed` states)

**Indexes:**
- `userId` (for user order history)
- `vendorId` (for vendor order management)
- `status` (for status-based filtering)
- `orderedAt` (for chronological sorting)

**Relationships:**
- `user` → Many-to-One with Users
- `meal` → Many-to-One with Meals
- `vendor` → Many-to-One with Vendors

---

### Key Design Decisions

**Normalization:**
- Separated Vendors and Meals (1:N) to avoid data duplication
- Orders reference both Meal and Vendor for redundancy (meal could be deleted but order history preserved)

**Indexing Strategy:**
- Composite index on `(protein, carbs, fats)` for fast macro-based searches
- Single-column indexes on frequently filtered fields (`status`, `isAvailable`)
- Foreign key indexes for JOIN optimization

**Cascade Deletes:**
- Meals → Cascade (if vendor deleted, remove their meals)
- Orders → Restrict (preserve order history even if meal/vendor deleted)

**Data Types:**
- Float for macros/weight (precision matters for nutrition)
- UUID for IDs (distributed system ready, no collision risk)
- DateTime with timezone support

**Future Extensions:**
- Meal reviews table (1:N from Orders)
- User saved meals (M:N with Users)
- Vendor analytics table (aggregated metrics)
---

## 🧪 Testing

### Using Postman

1. **Import collection**
   - Import `docs/Nutrifix.postman_collection.json`
   - Import `docs/Nutrifix.postman_environment.json`

2. **Select environment**
   - Choose "Nutrifix Production" from dropdown

3. **Run authentication flow**
   - Execute "Register User" (token auto-saved to environment)
   - Or execute "Login User" if already registered

4. **Test protected endpoints**
   - All Order, AI Agent, and Profile endpoints will use saved token automatically

### Example Request Flow
```bash
# 1. Register
POST https://nutrifix-ygyz.onrender.com/api/auth/register
Body: { "name": "John", "email": "john@test.com", "password": "pass123" }

# 2. Search meals by macros
GET https://nutrifix-ygyz.onrender.com/api/meals/search?protein=150&carbs=300&fats=60

# 3. Create order (requires auth token in header)
POST https://nutrifix-ygyz.onrender.com/api/orders
Headers: Authorization: Bearer <token>
Body: { "mealId": "...", "quantity": 2, "deliveryAddress": "123 Main St" }

# 4. Get AI macro suggestion
POST https://nutrifix-ygyz.onrender.com/api/agents/macro-suggestion
Headers: Authorization: Bearer <token>
Body: { "age": 25, "weight": 75, "height": 175, "activityLevel": "moderate", "goal": "muscle gain" }
```

---

## 🚢 Deployment

**Deployed on Render** (https://render.com)

### Deployment Configuration

**Web Service:**
- Runtime: Node.js
- Build Command: `yarn install --production=false && yarn build && npx prisma generate && npx prisma migrate deploy && npx prisma db seed`
- Start Command: `node dist/server.js`

**Database:**
- PostgreSQL 15
- Automatic backups enabled

**Environment Variables:**
- Set in Render dashboard (see Environment Variables section)

### CI/CD
- Auto-deploys from `main` branch on GitHub push
- Build time: ~2-3 minutes
- Zero-downtime deployments

---

## 📊 Project Status

### ✅ Completed Features
- [x] RESTful API architecture
- [x] JWT authentication & authorization
- [x] User registration & login
- [x] Meal CRUD operations
- [x] Macro-based meal search with scoring algorithm
- [x] Order management system
- [x] AI macro calculations (Groq/Llama 3.1)
- [x] AI meal recommendations
- [x] Database schema with relations
- [x] PostgreSQL + Prisma ORM integration
- [x] TypeScript type safety throughout
- [x] Production deployment on Render
- [x] Postman API documentation
- [x] Seed data for testing

### 🔄 Future Enhancements
- [ ] **Frontend Development** (React + TypeScript + Tailwind - Planned Q1 2026)
  - User dashboard
  - Meal browsing interface
  - Order tracking UI
  - Profile management
- [ ] Vendor dashboard for managing meals/orders
- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Real-time order status updates (WebSockets)
- [ ] Email notifications (SendGrid)
- [ ] Rate limiting & API throttling
- [ ] Comprehensive error logging (Winston/Sentry)
- [ ] Unit & integration tests (Jest)
- [ ] Meal reviews & ratings system
- [ ] Dietary preference filtering (vegan, gluten-free, etc.)
- [ ] Calorie tracking dashboard

---

## 👤 Author

**Aswin Ramabadran**
- GitHub: [@aswin-dev04](https://github.com/aswin-dev04)
- LinkedIn: [aswinramabadran](https://linkedin.com/in/aswinramabadran)
- Email: ramabadranaswin2004@gmail.com

---

## 🙏 Acknowledgments

- Groq for providing free LLM API access
- Render for free-tier hosting
- Prisma for excellent ORM tooling
- FreeCodeCamp for backend tutorials

---

**Built with ❤️ using TypeScript, Node.js, and AI**

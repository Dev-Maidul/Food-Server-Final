# 🚀 FoodHub Backend Server

Backend API for FoodHub - A multi-vendor food delivery platform built with Node.js, Express, Prisma, and PostgreSQL.

# Credentials for Testing

- **Admin**
  ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=Admin@123

- **Provider**
  - Email:provider@gmail.com
  - Password:provider@com

- **Customer**
  - Email:customer@gmail.com
  - Password:customer@com

# Live Demo

- **Frontend:** [https://foodhub-main-eta.vercel.app](https://foodhub-main-eta.vercel.app)
- **Backend API:** [https://foodhub-server-three.vercel.app/]
(https://foodhub-server-three.vercel.app)

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** Better Auth with JWT
- **Validation:** Zod
- **Build Tool:** tsup

## 📁 Project Structure

```
src/
├── app/
│   ├── modules/              # Feature modules
│   │   ├── auth/            # Authentication & authorization
│   │   ├── category/        # Meal categories
│   │   ├── meal/            # Meal management
│   │   ├── order/           # Order processing
│   │   ├── provider/        # Provider/shop management
│   │   ├── review/          # Reviews & ratings
│   │   └── user/            # User management
│   ├── middleware/          # Express middleware
│   │   ├── auth.ts         # Authentication middleware
│   │   ├── errorHandler.ts # Global error handler
│   │   └── validateRequest.ts # Request validation
│   ├── routes/             # Route definitions
│   └── errors/             # Custom error classes
├── helper/                 # Helper utilities
├── shared/                 # Shared utilities
├── types/                  # TypeScript type definitions
├── app.ts                  # Express app setup
└── server.ts              # Server entry point

prisma/
├── schema/                 # Modular Prisma schemas
│   ├── schema.prisma      # Main schema file
│   ├── auth.prisma        # User & session models
│   ├── meal.prisma        # Meal models
│   ├── order.prisma       # Order models
│   ├── provider.prisma    # Provider models
│   └── review.prisma      # Review models
└── migrations/            # Database migrations
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm/yarn/pnpm

### Installation

1. **Clone and navigate to server directory**

```bash
cd Food-Server-Final
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

Edit `.env` and add your configuration:

```env
NODE_DEV=development
PORT=8080
BETTER_AUTH_SECRET=
BETTER_AUTH_URL="http://localhost:8080"
FRONTEND_URL="http://localhost:3000"
DATABASE_URL="postgresql://user:password@localhost:5432/foodhub"

# email config
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=
```

4. **Run Prisma migrations**

```bash
npx prisma migrate dev
```

5. **Seed the database (optional)**

```bash
npm run seed
```

6. **Start development server**

```bash
npm run dev
```

Server will run on `http://localhost:8080`

## 📝 Available Scripts

```bash
npm run dev              # Start development server with hot reload
npm run build            # Build TypeScript to JavaScript
npm run start            # Start production server
npm run seed             # Seed database with sample data
npx prisma studio        # Open Prisma Studio (Database GUI)
npx prisma migrate dev   # Create and apply migrations
npx prisma generate      # Generate Prisma Client
```

## 🗄️ Database Schema

### Users Table

- Multiple roles: CUSTOMER, PROVIDER, ADMIN
- Managed authentication with Better Auth
- User profiles with contact information

### Provider Table

- Shop information (name, address, description)
- Links to meals and orders
- Provider-specific settings

### Meal Table

- Complete meal information
- Category relationships
- Availability status
- Pricing and descriptions

### Order Table

- Order tracking with status (PENDING, ACCEPTED, COOKING, ON_THE_WAY, DELIVERED, CANCELLED)
- Order items with quantities
- Total amount calculation
- Timestamps for tracking

### Review Table

- User reviews for meals
- Star ratings (1-5)
- Unique constraint: one review per user per meal

### Category Table

- Meal categorization
- Used for filtering and organization

## 🌐 Deployment

### Vercel Deployment

```bash
vercel --prod
```

### Environment Variables for Production

- Set `DATABASE_URL` to production database
- Update `BETTER_AUTH_SECRET`
- Set `NODE_ENV=production`
- Configure CORS origins

## 📊 Database Management

### View Database

```bash
npx prisma studio
```

### Create Migration

```bash
npx prisma migrate dev --name migration_name
```

### Reset Database

```bash
npx prisma migrate reset
```

### Generate Prisma Client

```bash
npx prisma generate
```

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**

```bash
# Check DATABASE_URL in .env
# Ensure PostgreSQL is running
# Verify database exists
```

**Prisma Client Not Generated**

```bash
npx prisma generate
```

**Port Already in Use**

```bash
# Change PORT in .env
# Or kill process using port 5000
```

## 📈 Performance Optimization

- Database indexing on frequently queried fields
- Pagination for large datasets
- Efficient query optimization with Prisma
- Caching strategies (recommended)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request


## 👨‍💻 Developer

Developed by [Md Maidul Islam]

---


# Kumarie — Setup Guide

## Prerequisites

- Node.js 18+
- PostgreSQL database
- Cloudinary account (free tier works)
- Razorpay account (test mode for development)

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
npm install tailwindcss-animate  # Required for animations
```

### 2. Configure Environment Variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/kumarie_db"
JWT_SECRET="your-32-char-minimum-secret-key-here"
CLOUDINARY_CLOUD_NAME="your-cloudname"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloudname"
RAZORPAY_KEY_ID="rzp_test_xxxx"
RAZORPAY_KEY_SECRET="your-secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxxx"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project URLs

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | Public store homepage |
| `http://localhost:3000/products` | Product listing |
| `http://localhost:3000/cart` | Shopping cart |
| `http://localhost:3000/checkout` | Checkout |
| `http://localhost:3000/admin/login` | Admin login |
| `http://localhost:3000/admin/dashboard` | Admin dashboard |
| `http://localhost:3000/admin/products` | Manage products |
| `http://localhost:3000/admin/orders` | View orders |

## Default Admin Credentials

After seeding:
- **Email**: `admin@kumarie.com`
- **Password**: `Admin@Kumarie2024`

> ⚠️ Change these in your `.env.local` before deploying to production!

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT (custom, HTTP-only cookies) |
| Payments | Razorpay |
| Images | Cloudinary |
| State | Zustand (cart) |
| Forms | React Hook Form + Zod |
| Deployment | Vercel |

---

## Deployment to Vercel

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Set environment variables in Vercel project settings
4. Deploy

The `vercel.json` is pre-configured. The build command runs `prisma generate` automatically.

---

## Folder Structure

```
kumarie/
├── app/
│   ├── (public)/              # Public-facing pages
│   │   ├── page.tsx           # Landing page
│   │   ├── products/          # Product pages
│   │   ├── cart/              # Cart page
│   │   └── checkout/          # Checkout + success
│   ├── (admin)/               # Admin panel
│   │   └── admin/
│   │       ├── login/         # Admin login
│   │       ├── dashboard/     # Stats overview
│   │       ├── products/      # CRUD products
│   │       └── orders/        # Order management
│   ├── api/                   # API routes
│   │   ├── auth/              # Auth check
│   │   ├── payment/           # Razorpay integration
│   │   ├── upload/            # Cloudinary upload
│   │   └── webhook/           # Razorpay webhooks
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── public/                # Public UI components
│   └── admin/                 # Admin UI components
├── lib/                       # Utilities & integrations
├── hooks/                     # Custom React hooks
├── actions/                   # Server actions
├── types/                     # TypeScript types
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Sample data seeder
├── middleware.ts               # Route protection
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

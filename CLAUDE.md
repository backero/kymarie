# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev           # Start dev server

# Build
npm run build         # prisma generate + next build
npm run start         # Start production server

# Linting
npm run lint          # Next.js ESLint

# Database
npm run db:generate   # Prisma client generation
npm run db:push       # Push schema changes (no migration file)
npm run db:migrate    # Create and apply migration
npm run db:studio     # Open Prisma Studio UI
npm run db:seed       # Seed database (ts-node prisma/seed.ts)
```

No test runner is configured.

## Architecture

Full-stack Next.js e-commerce app for Kumarie (handcrafted natural soaps). Uses the App Router with two route groups:

- `(public)/` — customer-facing storefront: home, product listing/detail, cart, checkout, auth, profile
- `(admin)/admin/` — protected admin dashboard: product/order management

### Auth

Two separate auth flows share a single NextAuth v5 setup (`auth.ts`):
- **Customers** — register/login via `actions/userAuth.ts`, role: `"user"`
- **Admins** — login via `actions/admin.ts`, role: `"admin"`, credentials checked against the `Admin` model

Route protection is handled in `proxy.ts` (not `middleware.ts` — this is intentional). `/admin/*` requires role `"admin"`; `/profile` requires any session.

JWT strategy with 7-day expiry. `AUTH_SECRET` env var is required (not `NEXTAUTH_SECRET`). Session/JWT types are extended in `types/next-auth.d.ts`.

Use `requireAdmin()` from `lib/auth.ts` inside server actions to guard admin operations.

### Data Layer

PostgreSQL via Prisma. Key models: `Product`, `Category`, `User`, `Admin`, `Order`, `OrderItem`, `Address`, `WishlistItem`, `Review`, `Coupon`, `Newsletter`.

All DB operations go through **server actions** in `actions/`:
- `admin.ts` — product/category CRUD, admin login
- `userAuth.ts` — customer registration/login/profile
- `products.ts` — product queries with filtering & sorting
- `orders.ts` — order creation, payment confirmation, status updates
- `addresses.ts`, `wishlist.ts` — user-specific data

### Payments

Razorpay integration. Flow: `api/payment/create-order` → client-side Razorpay modal → `api/payment/verify` (signature verification + order status update). A demo route at `api/payment/demo` exists for development.

### Image Uploads

Cloudinary via `api/upload`. Supports two modes: real Cloudinary upload and URL passthrough (for development). Remote image patterns for Cloudinary and Unsplash are configured in `next.config.ts`.

### Client State

Cart is managed entirely client-side with Zustand + localStorage persistence (`hooks/useCart.ts`). No cart state is stored in the database.

## Key Environment Variables

```
DATABASE_URL
AUTH_SECRET            # NextAuth (32+ chars)
JWT_SECRET
CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET
RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
NEXT_PUBLIC_RAZORPAY_KEY_ID
NEXT_PUBLIC_APP_URL
```

## UI & Styling

Tailwind CSS with a custom brand palette (forest, sage, amber, clay, cream). Component library is shadcn/ui (Radix UI primitives). Custom fonts: Plus Jakarta Sans + Jost. Framer Motion for animations.

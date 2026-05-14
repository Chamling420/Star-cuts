# Star Cuts Beauty Salon

A full-featured, modern beauty salon website built with Next.js, TypeScript, and Tailwind CSS. Star Cuts offers a premium online experience for booking appointments, browsing services & products, and managing salon operations through dedicated admin panels.

---

## Features

### Public Pages
- **Home** — Hero section with dynamic background image, featured services, products carousel, testimonials, gallery preview, and CTA banner
- **About** — Salon story, team info, and statistics
- **Services** — Full service catalog with category filtering (Hair, Skin, Makeup, Nails)
- **Products** — Product listings with brand, price, and add-to-cart functionality
- **Gallery** — Visual portfolio of salon work with before/after and styling categories
- **Contact** — Contact form, map placeholder, and business details
- **Booking** — Appointment booking system with date/time selection and service selection

### Authentication
- Login & Register with email/password (combined in one dialog)
- Session-based auth using NextAuth.js
- Three user roles: **Super Admin**, **Admin**, **User**

### Admin Panel (Admin & Super Admin)
- **Home** — Edit hero section (title, subtitle, image, CTA text)
- **Services** — Manage salon services (CRUD)
- **Products** — Manage products (CRUD)
- **About** — Edit about page content
- **Payments** — Manage payment methods (Bank, eSewa, Khalti, IME Pay) with QR code images
- **Settings** — Site-wide settings

### Super Admin Panel (Super Admin Only)
- All Admin Panel features, plus:
- **Users** — View, add, and manage user accounts and roles
- **Dashboard Stats** — Overview of users, bookings, services, products, messages

### Other Features
- Dark mode / Light mode toggle
- Fully responsive design (mobile-first)
- Shopping cart with product management
- Payment methods with QR code support (Bank, eSewa, Khalti, IME Pay)
- Image upload via URL or file (DualImageInput component)
- Smooth animations with Framer Motion
- Professional UI with shadcn/ui components
- Contact message system with read/unread status
- Gallery with masonry-style grid layout
- Protected routes and role-based access control
- Galaxy animation fallback for hero section

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework with App Router |
| **TypeScript 5** | Type-safe development |
| **Tailwind CSS 4** | Utility-first styling |
| **shadcn/ui** | UI component library (New York style) |
| **Prisma ORM** | Database ORM (PostgreSQL) |
| **Neon** | Serverless PostgreSQL database |
| **NextAuth.js v4** | Authentication & session management |
| **Zustand** | Client-side state management |
| **Framer Motion** | Animations & transitions |
| **React Hook Form** | Form handling & validation |
| **Zod** | Schema validation |
| **Lucide React** | Icon library |
| **Recharts** | Data visualization charts |
| **bcryptjs** | Password hashing |

---

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, or bun
- A [Neon](https://neon.tech) account (free tier available)

### Step 1: Clone and Install

```bash
git clone https://github.com/Chamling420/Star-cuts.git
cd Star-cuts
bun install
# or
npm install
```

### Step 2: Create a Neon Database (FREE)

1. Go to [https://neon.tech](https://neon.tech) and sign up for a **free account**
2. Click **"Create Project"** → name it "Star Cuts" → select a region → **Create**
3. Copy the **connection string** — it looks like:
   ```
   postgresql://neondb_owner:npg_xxxxx@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### Step 3: Set Up Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://neondb_owner:npg_xxxxx@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
NEXTAUTH_SECRET="star-cuts-beauty-salon-secret-key-2024"
NEXTAUTH_URL="http://localhost:3000"
```

> 💡 Generate a stronger NEXTAUTH_SECRET: `openssl rand -base64 32`

### Step 4: Set Up the Database

```bash
# Push schema to create tables in Neon
bun run db:push
# or
npx prisma db push
```

### Step 5: Seed the Database (Adds Demo Data & User Accounts)

```bash
bun run db:seed
# or
npx prisma db seed
```

### Step 6: Start the Development Server

```bash
bun run dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deploy to Vercel (FREE Hosting)

### Step 1: Push Code to GitHub

Make sure your code is pushed to the GitHub repository.

### Step 2: Connect to Vercel

1. Go to [https://vercel.com](https://vercel.com) and sign up
2. Click **"Add New Project"**
3. Import your GitHub repository: `Chamling420/Star-cuts`
4. Vercel will auto-detect Next.js

### Step 3: Set Environment Variables in Vercel

In the Vercel project settings → **Environment Variables**, add:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your Neon PostgreSQL connection string |
| `NEXTAUTH_SECRET` | `star-cuts-beauty-salon-secret-key-2024` (or your custom secret) |
| `NEXTAUTH_URL` | `https://your-app-name.vercel.app` |

> ⚠️ **IMPORTANT**: You MUST add all 3 environment variables, otherwise the site will show "Internal Server Error"

### Step 4: Deploy

Click **Deploy** and wait for the build to complete.

### Step 5: Seed the Production Database

After the first successful deployment, seed your production database:

```bash
# Set DATABASE_URL to your Neon connection string, then:
npx prisma db seed
```

Or use the Neon SQL editor at https://console.neon.tech to run queries manually.

---

## Default Login Credentials

| Role | Email | Password |
|---|---|---|
| **Super Admin** | `superadmin@starcuts.com` | `admin123` |
| **Admin** | `admin@starcuts.com` | `admin123` |
| **User** | `user@starcuts.com` | `user123` |

---

## User Roles & Permissions

### User (Regular)
- Browse all public pages (Home, About, Services, Products, Gallery, Contact)
- Register and log in to their account
- Book appointments for available services
- View their booking history
- Add products to cart
- Update their profile

### Admin
- All User permissions, plus:
- Access the **Admin Panel** with tabs:
  - **Home** — Edit hero section content (title, subtitle, image, CTA)
  - **Services** — Create, edit, and delete salon services
  - **Products** — Create, edit, and delete products
  - **About** — Edit about page content
  - **Payments** — Manage payment methods (Bank, eSewa, Khalti, IME Pay)
  - **Settings** — Site-wide configuration
- View contact messages
- Manage bookings (confirm, cancel, mark as completed)

### Super Admin
- All Admin permissions, plus:
- Access the **Super Admin Panel** with additional tabs:
  - **Users** — View all users, create new accounts, change user roles, delete users
  - **Dashboard Stats** — Overview of total users, bookings, services, products, and messages
- Full control over the entire system
- Can promote/demote user roles (User to Admin to Super Admin)
- Can manage all site content and settings
- Can view and manage all bookings across all users

---

## API Routes

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/register` | Register a new user | No |
| `POST` | `/api/auth/[...nextauth]` | Login / Auth | No |
| `GET` | `/api/services` | List all services | No |
| `POST` | `/api/services` | Create a service | Admin+ |
| `GET` | `/api/products` | List all products | No |
| `POST` | `/api/products` | Create a product | Admin+ |
| `GET` | `/api/gallery` | List gallery images | No |
| `POST` | `/api/gallery` | Add gallery image | Admin+ |
| `GET` | `/api/content` | Get site content | No |
| `POST` | `/api/content` | Update site content | Admin+ |
| `GET` | `/api/bookings` | List bookings | Auth |
| `POST` | `/api/bookings` | Create a booking | Auth |
| `GET` | `/api/users` | List all users | Super Admin |
| `POST` | `/api/users` | Create a user | Super Admin |
| `GET` | `/api/messages` | List contact messages | Admin+ |
| `POST` | `/api/messages` | Submit a contact message | No |
| `GET` | `/api/payment-methods` | List payment methods | No |
| `POST` | `/api/payment-methods` | Create payment method | Admin+ |
| `GET` | `/api/stats` | Dashboard statistics | Super Admin |

---

## Payment Methods Supported

- **Bank Transfer** — Account holder, bank name, branch, account number, QR image
- **eSewa** — Full name, eSewa number, QR image
- **Khalti** — Full name, Khalti number, QR image
- **IME Pay** — Full name, IME Pay number, QR image

---

## Database Schema

The application uses **PostgreSQL** (via Neon) with Prisma ORM:

- **User** — id, name, email, password, role (USER/ADMIN/SUPER_ADMIN), image, phone
- **Service** — id, title, description, price, image, category, duration, featured, active
- **Product** — id, title, description, price, image, category, brand, inStock, featured
- **Booking** — id, userId, serviceId, date, time, status, notes
- **Message** — id, name, email, message, read
- **GalleryImage** — id, title, image, category, beforeImage, description, active
- **SiteContent** — id, section, key, value (dynamic content management)
- **PaymentMethod** — id, type, account details, QR image, active

---

## Project Structure

```
Star-cuts/
├── prisma/
│   ├── schema.prisma          # Database schema (PostgreSQL)
│   ├── seed.ts                # Main seed file
│   └── seed-content.ts        # Content seed file
├── public/
│   ├── images/                # Service, product, gallery images
│   ├── logo.svg               # Logo SVG
│   └── robots.txt             # SEO robots file
├── src/
│   ├── app/
│   │   ├── api/               # API routes (auth, bookings, content, etc.)
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Main page (SPA router)
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── auth/              # Login/Register dialog
│   │   ├── layout/            # Header, Footer
│   │   ├── pages/             # All page components
│   │   └── ui/                # Reusable UI components (shadcn/ui)
│   ├── lib/                   # Database client, auth config, utilities
│   ├── store/                 # Zustand state store
│   ├── types/                 # TypeScript type definitions
│   └── hooks/                 # Custom React hooks
├── .env                       # Environment variables
├── vercel.json                # Vercel deployment config
├── package.json               # Dependencies and scripts
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string | ✅ Yes |
| `NEXTAUTH_SECRET` | Secret key for auth sessions | ✅ Yes |
| `NEXTAUTH_URL` | Base URL for auth callbacks | ✅ Yes |

---

## License

This project is proprietary. All rights reserved.

---

<p align="center">
  <strong>Star Cuts Beauty Salon</strong><br/>
  Where Beauty Meets Excellence
</p>

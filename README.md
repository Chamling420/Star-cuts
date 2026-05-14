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
- Login & Register with email/password
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
- 🌙 Dark mode / Light mode toggle
- 📱 Fully responsive design (mobile-first)
- 🛒 Shopping cart with product management
- 💳 Payment methods with QR code support (Bank, eSewa, Khalti, IME Pay)
- 🖼️ Image upload via URL or file (DualImageInput component)
- ✨ Smooth animations with Framer Motion
- 🎨 Professional UI with shadcn/ui components
- 💬 Contact message system with read/unread status
- 📊 Gallery with masonry-style grid layout
- 🔒 Protected routes and role-based access control

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework with App Router |
| **TypeScript 5** | Type-safe development |
| **Tailwind CSS 4** | Utility-first styling |
| **shadcn/ui** | UI component library (New York style) |
| **Prisma ORM** | Database ORM (SQLite) |
| **NextAuth.js v4** | Authentication & session management |
| **Zustand** | Client-side state management |
| **Framer Motion** | Animations & transitions |
| **React Hook Form** | Form handling & validation |
| **Zod** | Schema validation |
| **Lucide React** | Icon library |
| **Recharts** | Data visualization charts |

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts    # Authentication API
│   │   ├── bookings/route.ts              # Bookings CRUD
│   │   ├── content/route.ts               # Site content CRUD
│   │   ├── gallery/route.ts               # Gallery images CRUD
│   │   ├── messages/route.ts              # Contact messages CRUD
│   │   ├── payment-methods/route.ts       # Payment methods CRUD
│   │   ├── products/route.ts              # Products CRUD
│   │   ├── register/route.ts              # User registration
│   │   ├── services/route.ts              # Services CRUD
│   │   ├── stats/route.ts                 # Dashboard statistics
│   │   ├── upload/route.ts                # File upload
│   │   └── users/route.ts                 # User management
│   ├── layout.tsx                          # Root layout
│   ├── page.tsx                            # Main page (SPA router)
│   └── globals.css                         # Global styles
├── components/
│   ├── auth/auth-dialog.tsx                # Login/Register dialog
│   ├── layout/
│   │   ├── header.tsx                      # Navigation header
│   │   └── footer.tsx                      # Site footer
│   ├── pages/
│   │   ├── home-page.tsx                   # Home page
│   │   ├── about-page.tsx                  # About page
│   │   ├── services-page.tsx               # Services page
│   │   ├── products-page.tsx               # Products page
│   │   ├── gallery-page.tsx                # Gallery page
│   │   ├── contact-page.tsx                # Contact page
│   │   ├── booking-page.tsx                # Booking page
│   │   ├── admin-panel.tsx                 # Admin panel
│   │   └── super-admin-panel.tsx           # Super Admin panel
│   └── ui/                                 # Reusable UI components
├── lib/
│   ├── db.ts                               # Prisma client instance
│   └── utils.ts                            # Utility functions
├── store/
│   └── use-app-store.ts                    # Zustand state store
├── types/
│   └── index.ts                            # TypeScript type definitions
└── hooks/
    └── use-toast.ts                        # Toast notification hook
```

---

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Chamling420/Star-cuts.git
   cd Star-cuts
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   bun run db:push
   # or
   npx prisma db push
   ```

5. **Seed the database** (optional — adds demo data and user accounts)
   ```bash
   bunx prisma db seed
   # or
   npx prisma db seed
   ```

6. **Start the development server**
   ```bash
   bun run dev
   # or
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

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
- Can promote/demote user roles (User ↔ Admin ↔ Super Admin)
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
| `POST` | `/api/upload` | Upload a file | Admin+ |

---

## Payment Methods Supported

- **Bank Transfer** — Account holder, bank name, branch, account number, QR image
- **eSewa** — Full name, eSewa number, QR image
- **Khalti** — Full name, Khalti number, QR image
- **IME Pay** — Full name, IME Pay number, QR image

---

## Database Schema

The application uses **SQLite** via Prisma ORM with the following models:

- **User** — id, name, email, password, role (USER/ADMIN/SUPER_ADMIN), image, phone
- **Service** — id, title, description, price, image, category, duration, featured, active
- **Product** — id, title, description, price, image, category, brand, inStock, featured
- **Booking** — id, userId, serviceId, date, time, status, notes
- **Message** — id, name, email, message, read
- **GalleryImage** — id, title, image, category, beforeImage, description, active
- **SiteContent** — id, section, key, value (dynamic content management)
- **PaymentMethod** — id, type, account details, QR image, active

---

## License

This project is proprietary. All rights reserved.

---

<p align="center">
  <strong>Star Cuts Beauty Salon</strong><br/>
  Where Beauty Meets Excellence
</p>

# ⭐ Star Cuts Beauty Salon

A modern, full-featured beauty salon website for **Star Cuts** — built to help manage salon bookings, showcase services and products, handle customer interactions, and manage payment methods online.

---

## 🔗 Live Repository

**GitHub:** https://github.com/Chamling420/Star-cuts

---

## 📋 Table of Contents

- [What This Website Does](#-what-this-website-does)
- [Login Accounts](#-login-accounts)
- [User Roles & Permissions](#-user-roles--permissions)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Website Pages](#-website-pages)
- [Key Features](#-key-features)
- [Payment Methods](#-payment-methods)
- [API Routes](#-api-routes)
- [Database](#-database)
- [Project Structure](#-project-structure)
- [License](#-license)

---

## 🌟 What This Website Does

Star Cuts Beauty Salon is a complete web application designed for a beauty salon business. It serves as both a **customer-facing website** and an **admin management system**.

### For Customers (Visitors)
- **Browse Services** — View all salon services (haircuts, facials, manicures, bridal packages, hair coloring, balayage) with prices in Nepali Rupees (Rs)
- **Shop Products** — Browse beauty products (argan oil, foundations, eyeshadow palettes, vitamin C serums) with stock status
- **Book Appointments** — Pick a service, choose a date and time, and book an appointment online
- **View Gallery** — See before/after photos, styling inspiration, and salon work
- **Contact the Salon** — Send messages directly through the contact form
- **Learn About Us** — Read about the salon's story, team, and values
- **Dark/Light Mode** — Switch between light and dark themes for comfortable browsing
- **View Payment Methods** — See available payment options (Bank, eSewa, Khalti, IME Pay) with QR codes

### For Admins (Staff)
- **Dashboard** — View total bookings, services, products, and pending bookings at a glance with stat cards
- **Manage Bookings** — View all bookings, approve, reject, or mark as completed, filter by status
- **Manage Services** — Add, edit, or delete salon services (title, description, price, image, category, duration, featured)
- **Manage Products** — Add, edit, or delete beauty products (title, description, price, image, brand, stock, featured)
- **View Messages** — Read and manage customer contact messages, mark as read
- **Manage Gallery** — Upload new gallery images, add before/after comparisons, organize by category
- **Edit Site Content** — Update homepage hero text, about section, testimonials, contact info, and more
- **Manage Payment Methods** — Add, edit, delete payment options (Bank, eSewa, Khalti, IME Pay) with QR codes
- **Edit Settings** — Update salon name, email, phone, address, and business hours

### For Super Admin (Owner)
- Everything an Admin can do, PLUS:
- **User Management** — View all users, create new admin accounts, change user roles, delete users
- **Full Site Control** — Edit any section of the website content
- **System Overview** — Complete analytics and business insights
- **Complete Payment Control** — Manage all payment methods
- **Settings Management** — Configure all salon settings

---

## 🔐 Login Accounts

| Role | Email | Password |
|------|-------|----------|
| **Super Admin** | `superadmin@starcuts.com` | `admin123` |
| **Admin** | `admin@starcuts.com` | `admin123` |
| **User** | `user@starcuts.com` | `user123` |

> **Note:** New users can also register through the website's Sign Up form. They will be assigned the "User" role by default.

---

## 👥 User Roles & Permissions

### 🟡 User (Customer)
Standard user — can browse the website, book appointments, and manage their own bookings.

| Permission | Access |
|-----------|--------|
| Browse services, products, gallery | ✅ |
| Book appointments | ✅ |
| Cancel own bookings | ✅ |
| Send contact messages | ✅ |
| View payment methods | ✅ |
| Access Admin Panel | ❌ |
| Access Super Admin Panel | ❌ |
| Manage content | ❌ |
| Manage services/products | ❌ |
| Manage bookings (all) | ❌ |
| Manage users | ❌ |
| View messages | ❌ |

### 🔵 Admin (Staff)
Full management access — can edit all content, manage bookings, services, products, gallery, and view messages.

| Permission | Access |
|-----------|--------|
| All User permissions | ✅ |
| Access Admin Panel | ✅ |
| Manage content (Home, About, Services, etc.) | ✅ |
| Add, edit, delete services | ✅ |
| Add, edit, delete products | ✅ |
| Manage gallery images | ✅ |
| Manage bookings (confirm/cancel/complete) | ✅ |
| View & manage messages | ✅ |
| Manage payment methods | ✅ |
| Edit settings | ✅ |
| Access Super Admin Panel | ❌ |
| Manage users | ❌ |

### 🟣 Super Admin (Owner)
Complete system control — all Admin permissions plus user management, role assignment, and system settings.

| Permission | Access |
|-----------|--------|
| All Admin permissions | ✅ |
| Access Super Admin Panel | ✅ |
| Create, edit, delete users | ✅ |
| Change user roles (User ↔ Admin ↔ Super Admin) | ✅ |
| Delete admin accounts | ✅ |
| Full analytics & business insights | ✅ |
| Complete system settings | ✅ |

---

## 🛠 Tech Stack

| Technology | What It Does |
|---|---|
| **Next.js 16** | React-based web framework with server-side rendering and App Router |
| **TypeScript** | Type-safe JavaScript for reliable code |
| **Tailwind CSS 4** | Utility-first CSS for fast, responsive styling |
| **shadcn/ui** | Pre-built accessible UI components (New York style) |
| **Prisma ORM** | Type-safe database queries with SQLite |
| **SQLite** | Lightweight file-based database (no server needed) |
| **NextAuth.js v4** | Secure authentication with role-based access control |
| **Framer Motion** | Smooth page transitions and animations |
| **Zustand** | Lightweight client-side state management |
| **Lucide Icons** | Beautiful, consistent icon library |
| **Recharts** | Interactive charts for admin dashboard |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun installed on your machine
- Git installed

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/Chamling420/Star-cuts.git
cd Star-cuts
```

**2. Install dependencies**
```bash
npm install
```

**3. Setup environment variables**

Create a `.env` file in the project root:
```env
DATABASE_URL=file:./db/custom.db
NEXTAUTH_SECRET=star-cuts-beauty-salon-secret-key-2024
NEXTAUTH_URL=http://localhost:3000
```

**4. Setup the database**
```bash
npx prisma generate
npx prisma db push
```

**5. Add default data (admin accounts, services, products)**
```bash
npx prisma db seed
```

If that doesn't work:
```bash
npx tsx prisma/seed.ts
```

**6. Start the development server**
```bash
npm run dev
```

**7. Open your browser**

Go to: **http://localhost:3000**

---

## 📄 Website Pages

| Page | URL | Description |
|---|---|---|
| **Home** | `/` | Hero banner with background image, featured services, featured products, customer testimonials, call-to-action |
| **About** | `/` (About tab) | Salon story, team introduction, core values |
| **Services** | `/` (Services tab) | All services grouped by category (Hair, Skin, Makeup, Nails) with prices in Rs |
| **Products** | `/` (Products tab) | Beauty products with prices in Rs, stock status, and categories |
| **Gallery** | `/` (Gallery tab) | Before/after photos, styling showcases, upload new images |
| **Contact** | `/` (Contact tab) | Contact form, salon location info, business hours |
| **Booking** | `/` (Booking tab) | Online appointment booking — pick service, date, and time |
| **Admin Panel** | `/` (Admin tab) | Staff dashboard — manage bookings, services, products, messages, payments |
| **Super Admin** | `/` (Super Admin tab) | Owner dashboard — full control over users, content, and everything |

---

## ✨ Key Features

### Core Features
- **Role-Based Access Control** — Three user roles (Super Admin, Admin, User) with different permissions
- **Online Booking System** — Customers can book appointments; admins can confirm/cancel/mark complete
- **Service & Product Management** — Full CRUD operations with image upload support
- **Payment Methods** — Support for Bank transfer, eSewa, Khalti, and IME Pay with QR codes
- **Image Uploads** — Upload images via file or URL for services, products, gallery, and payment QR codes
- **Responsive Design** — Works on mobile, tablet, and desktop
- **Dark/Light Theme** — Toggle between themes for comfortable viewing
- **Smooth Animations** — Page transitions and hover effects with Framer Motion
- **Nepali Rupees (Rs)** — All prices displayed in Rs currency
- **Contact Form** — Customers can send messages; admins can read and manage them
- **Dashboard Analytics** — Visual stats showing bookings, services, products, and pending items

### Admin Panel Features
- **9 Tab Sections** — Dashboard, Bookings, Services, Products, Messages, Gallery, Content, Payments, Settings
- **Search & Filter** — Search services/products, filter by category and status
- **Inline Editing** — Edit content directly with save/cancel buttons
- **Image Preview** — Preview images before saving in dialogs
- **Status Badges** — Color-coded booking statuses (Pending, Confirmed, Cancelled, Completed)
- **Unread Message Count** — Badge notification for unread messages
- **Quick Actions** — Quick access to add service/product from dashboard

### Super Admin Additional Features
- **User Management** — Create, edit, delete users and change roles
- **Role Assignment** — Promote users to Admin or demote back to User
- **Complete Content Control** — Edit all site sections
- **System Settings** — Salon name, email, phone, address, business hours

---

## 💳 Payment Methods

The salon supports the following payment methods, each manageable from the Admin/Super Admin panel:

| Payment Type | Fields |
|---|---|
| **Bank Transfer** | Account Holder Name, Bank Name, Branch Name, Account Number, QR Code |
| **eSewa** | Full Name, Number, QR Code |
| **Khalti** | Full Name, Number, QR Code |
| **IME Pay** | Full Name, Number, QR Code |

Each payment method can be:
- ✅ Created with all required fields
- ✅ Edited/updated
- ✅ Deleted
- ✅ Toggled active/inactive
- ✅ QR code image added via URL or file upload

---

## 🛣 API Routes

| Route | Methods | Description |
|---|---|---|
| `/api/auth/*` | GET, POST | NextAuth.js authentication |
| `/api/bookings` | GET, POST, PUT, DELETE | Booking management |
| `/api/services` | GET, POST, PUT, DELETE | Service management |
| `/api/products` | GET, POST, PUT, DELETE | Product management |
| `/api/gallery` | GET, POST, PUT, DELETE | Gallery image management |
| `/api/messages` | GET, POST, PUT, DELETE | Contact messages |
| `/api/content` | GET, POST, PUT, DELETE | Site content management |
| `/api/payment-methods` | GET, POST, PUT, DELETE | Payment methods management |
| `/api/users` | GET, POST, PUT, DELETE | User management (Super Admin) |
| `/api/upload` | POST | File/image upload |
| `/api/stats` | GET | Dashboard statistics |
| `/api/register` | POST | User registration |

---

## 🗄 Database

This project uses **SQLite** — a simple, file-based database. No need to install MySQL, PostgreSQL, or any separate database server.

- **Database file**: `db/custom.db`
- **ORM**: Prisma
- **8 Tables**:

| Table | Description |
|---|---|
| **User** | User accounts with roles (USER, ADMIN, SUPER_ADMIN) |
| **Service** | Salon services with categories, prices, and images |
| **Product** | Beauty products with stock status and brands |
| **Booking** | Customer appointments with status tracking |
| **Message** | Contact form submissions |
| **GalleryImage** | Salon gallery images with before/after support |
| **SiteContent** | Dynamic website content (key-value pairs by section) |
| **PaymentMethod** | Payment options (Bank, eSewa, Khalti, IME Pay) with QR codes |

---

## 📁 Project Structure

```
Star-cuts/
├── prisma/                          # Database schema & seed data
│   ├── schema.prisma                # Database models definition
│   ├── seed.ts                      # Seed script for default data
│   └── seed-content.ts              # Default site content
├── db/
│   └── custom.db                    # SQLite database file
├── public/
│   └── images/                      # Salon & product images
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Main entry page (single-page app)
│   │   ├── layout.tsx               # Root layout with providers
│   │   ├── globals.css              # Theme styles & custom CSS
│   │   └── api/                     # Backend API routes
│   │       ├── auth/                # NextAuth authentication
│   │       ├── bookings/            # Booking CRUD
│   │       ├── services/            # Service CRUD
│   │       ├── products/            # Product CRUD
│   │       ├── gallery/             # Gallery CRUD
│   │       ├── messages/            # Messages CRUD
│   │       ├── content/             # Site content CRUD
│   │       ├── payment-methods/     # Payment methods CRUD
│   │       ├── users/               # User management
│   │       ├── upload/              # File upload handler
│   │       ├── stats/               # Dashboard statistics
│   │       └── register/            # User registration
│   ├── components/
│   │   ├── pages/                   # Page components
│   │   │   ├── home-page.tsx        # Homepage
│   │   │   ├── about-page.tsx       # About page
│   │   │   ├── services-page.tsx    # Services listing
│   │   │   ├── products-page.tsx    # Products listing
│   │   │   ├── gallery-page.tsx     # Photo gallery
│   │   │   ├── contact-page.tsx     # Contact form
│   │   │   ├── booking-page.tsx     # Appointment booking
│   │   │   ├── admin-panel.tsx      # Admin dashboard
│   │   │   └── super-admin-panel.tsx # Super Admin dashboard
│   │   ├── layout/                  # Layout components
│   │   │   ├── header.tsx           # Navigation header
│   │   │   └── footer.tsx           # Site footer
│   │   ├── auth/                    # Authentication
│   │   │   └── auth-dialog.tsx      # Login/Register dialog
│   │   └── ui/                      # Reusable UI components (shadcn/ui)
│   │       ├── star-logo.tsx        # Custom Star Cuts logo
│   │       ├── galaxy-animation.tsx # Animated background
│   │       └── ...                  # 40+ UI components
│   ├── lib/                         # Core utilities
│   │   ├── auth.ts                  # NextAuth configuration
│   │   ├── db.ts                    # Prisma client instance
│   │   └── utils.ts                 # Utility functions
│   ├── hooks/                       # Custom React hooks
│   │   └── use-toast.ts            # Toast notification hook
│   ├── store/                       # State management
│   │   └── use-app-store.ts         # Zustand store
│   └── types/                       # TypeScript definitions
│       └── index.ts                 # Types & role permissions
├── .env                             # Environment variables
├── .gitignore                       # Git ignore rules
├── package.json                     # Dependencies & scripts
├── tsconfig.json                    # TypeScript configuration
├── next.config.ts                   # Next.js configuration
└── tailwind.config.ts               # Tailwind CSS configuration
```

---

## 📝 Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | SQLite database path | `file:./db/custom.db` |
| `NEXTAUTH_SECRET` | Secret key for authentication | - |
| `NEXTAUTH_URL` | Base URL of the application | `http://localhost:3000` |

---

## 🎨 Customization

### Changing Site Content
All website content is stored in the database and can be edited through the Admin Panel's **Content** tab. No code changes needed for:
- Hero section (title, subtitle, description, background image)
- About section (title, description)
- Contact info (email, phone, address, hours)
- Testimonials
- Footer text

### Adding New Services/Products
Use the Admin Panel's **Services** or **Products** tab to add new items with:
- Title, description, price
- Category (Hair, Skin, Makeup, Nails)
- Image (upload file or paste URL)
- Duration (for services)
- Stock status (for products)
- Featured flag

### Managing Payment Methods
Use the Admin Panel's **Payments** tab to configure:
- Bank transfer details (account holder, bank name, branch, account number, QR)
- eSewa details (full name, number, QR)
- Khalti details (full name, number, QR)
- IME Pay details (full name, number, QR)

---

## 📜 License

This project is built for **Star Cuts Beauty Salon**. All rights reserved.

---

<p align="center">
  <strong>⭐ Star Cuts Beauty Salon — Where Beauty Meets Excellence ⭐</strong>
</p>

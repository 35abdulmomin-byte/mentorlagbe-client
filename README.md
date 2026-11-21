# MentorLagbe

**Smart Tuition & Mentorship Platform** (Client)

MentorLagbe is a full-stack, role-based tuition management platform. Tutors post subject-wise tuition batches or 1-on-1 mentorship, Students search and apply, and Admins moderate listings, manage users and track Stripe subscription revenue.

## Purpose

Students and parents struggle to find verified tutors by subject, class level, mode (Online/Offline) and monthly budget. Tutors lack a structured place to showcase their batches and manage enrollments. MentorLagbe solves both problems in one unified ecosystem.

## Live URL

- **Live Site:** https://mentorlagbe-client-gules.vercel.app
- **Server API:** https://mentorlagbe-server-3xld.vercel.app
- **Server Repository:** https://github.com/35abdulmomin-byte/mentorlagbe-server

## Admin Credentials

Sign in from `/sign-in`. After login, every user is redirected to their own dashboard.

| Role    | Email                     | Password        |
|---------|---------------------------|-----------------|
| Admin   | admin@mentorlagbe.com     | Admin@12345|
| Tutor   | 35abdulmomin@gmail.com     | asd123 |
| Student |32abdulmomin@gmail.com       | asd123 |

**Stripe test card:** `4242 4242 4242 4242`, any future expiry date, any CVC.

## Key Features

### Authentication and Security
- Role-based authentication (Student, Tutor, Admin) using BetterAuth with MongoDB adapter
- JWT issued after login and sent with every protected API request
- Role-protected dashboards; reloading any private route keeps the user logged in
- All keys stored in environment variables

### Public Pages
- Home page with hero, dynamic featured tuitions (6 latest approved), how it works, top subjects, stats, testimonials and pricing sections with scroll animations
- Browse Tuitions with **server-side** search, filters (subject, class level, mode), sorting and **pagination**
- Tuition Details page with tutor info; only Students can apply, duplicate applications are blocked
- Dedicated How It Works and Pricing pages

### Student Dashboard
- Stats cards (total, accepted, pending applications, current plan)
- My Applications table with status badges and cancel option for pending applications

### Tutor Dashboard
- Stats cards (posted, active/approved, total applicants, current plan)
- Post Tuition with direct **ImgBB image upload** (Free plan: up to 2 posts, Pro plan: unlimited)
- My Tuitions with full CRUD (edit, delete, active/closed toggle)
- Manage Applicants (accept / reject)

### Admin Dashboard
- Platform stats (total users, tutors, pending vs approved tuitions, Stripe revenue)
- User management with role change
- Tuition moderation (approve, reject, revoke) with status tabs
- Transaction list from Stripe payments

### Payments
- Stripe Checkout for Pro plans (Tutor $15, Student $10)
- Payment verification, record saved in `payments` collection and user plan upgraded to `pro`
- `/payment/success` and `/payment/cancel` pages

### UI and Experience
- Fully responsive (mobile, tablet, desktop) with a collapsible dashboard sidebar
- Dark / Light theme toggle across landing pages and dashboard
- Loading skeletons, custom 404 and error pages
- Toast notifications for all form submissions, CRUD actions, login and logout
- Seeded realistic data (12 approved tuitions)
- Profile update with ImgBB image upload

## Tech Stack

Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, BetterAuth, Stripe, ImgBB API

## NPM Packages Used

- `next`, `react`, `react-dom`, `typescript`
- `tailwindcss`, `@tailwindcss/postcss`, `tw-animate-css`
- `shadcn`, `@base-ui/react`, `class-variance-authority`, `cn`
- `lucide-react` (icons)
- `sonner` (toast notifications)
- `next-themes` (dark / light mode)
- `better-auth` (authentication)


## Run Locally

```bash
npm install
npm run dev
```

The server must be running on the URL set in `NEXT_PUBLIC_API_URL`.

## Folder Overview

```
app/            routes (home, tuitions, pricing, dashboard, payment, auth pages)
components/     reusable UI (navbar, footer, cards, dashboard shell, forms)
lib/            api helpers, auth client, token and image upload utilities
```
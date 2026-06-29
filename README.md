# VAA Philippines — Virtual Assistant Management System

A dual-facing Content Management System for VAA Philippines that consolidates department hierarchies, VA workforce management, client tracking, work logs, and support ticketing into a single scalable platform.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | Tailwind CSS v4 + ShadCN/ui |
| Database | PostgreSQL 16 (via Supabase) |
| ORM | Prisma 7 + pg adapter |
| Auth | Supabase Auth (Google SSO) + custom RBAC |
| File Storage | Google Drive API (Service Account) |
| Realtime | Supabase Realtime (WebSockets) |
| Hosting | Vercel (Edge + Serverless) |

## Prerequisites

- **Node.js** ≥ 20.x
- **PostgreSQL** ≥ 15 (local or Supabase project)
- **Google Cloud Console** — Service Account for Drive/Sheets APIs (optional during dev, mock layer included)

## Quick Start

```bash
git clone <repo-url>
cd va-management
npm install
cp .env.example .env.local
# edit .env.local with your Supabase credentials
npx prisma db push
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). In dev mode without Supabase configured, the app runs with a mock auth layer.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `DIRECT_URL` | Dev | Direct DB connection (bypasses pooler) |
| `NEXT_PUBLIC_SUPABASE_URL` | Prod | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Prod | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Prod | Service role key (for admin ops) |
| `NEXT_PUBLIC_SITE_URL` | Prod | `https://your-domain.com` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Optional | SA email for Drive/Sheets |
| `GOOGLE_PRIVATE_KEY` | Optional | SA private key |
| `GOOGLE_DRIVE_PARENT_FOLDER_ID` | Optional | Root Drive folder ID |

## Database Schema

See [DOCUMENTATION.md](./DOCUMENTATION.md) for detailed schema docs and architecture diagrams. Key models:

- **departments** — Hierarchical org structure with parent-child nesting
- **positions** — Job titles with reporting chain (reports_to)
- **department_memberships** — Many-to-many user↔department links
- **users** — Staff and VA accounts with granular system roles
- **user_profiles** — Extended profiles (G-Cash, emergency contacts, social media, personality traits)
- **employment_records** — Tenure tracking, contract types, employment statuses, blacklist
- **role_assignments** — Temporary role elevations (Contributor, Viewer, Approver)
- **va_profiles** — VA-specific data with availability and capacity management
- **va_skills** — Many-to-many skills with proficiency levels and experience
- **va_documents** — Google Drive-stored contracts, IDs, clearances
- **leave_requests** — Leave management with approval chains
- **clients** — Client organizations with platform and service metadata
- **assignments** — VA↔Client matching with hours tracking
- **work_logs** — Daily hour entries
- **tickets** — Centralized support ticketing
- **ticket_conversations** — Threaded ticket messages
- **audit_logs** — Immutable change history

### System Roles (RBAC)

| Role | Scope |
|------|-------|
| SUPER_ADMIN | Full system access |
| SYSTEM_ADMIN | User/dept management, no deletion |
| EXECUTIVE | Read-only across all modules |
| DEPT_MANAGER | Full access within department |
| STAFF | Read/write within department |
| VA | Own profile, assignments, work logs, tickets |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:migrate` | Run Prisma migrations |

## Project Structure

```
va-management/
├── app/
│   ├── (auth)/           # Login, OAuth callback
│   ├── (dashboard)/      # Protected routes
│   │   ├── dashboard/    # Manager & VA dashboards
│   │   ├── vas/          # VA profiles & management
│   │   ├── clients/      # Client CRUD
│   │   ├── assignments/  # VA-to-client assignments
│   │   ├── work-logs/    # Hour logging
│   │   ├── skills/       # Service catalog
│   │   └── reports/      # Monthly hour reports
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/              # ShadCN UI primitives
│   ├── layout/          # Sidebar, Navbar, RealtimeProvider
│   ├── vas/             # VA forms
│   ├── clients/         # Client forms
│   ├── assignments/     # Assignment forms
│   ├── skills/          # Skill manager
│   └── reports/         # Report controls
├── lib/
│   ├── prisma.ts        # Prisma client singleton
│   ├── auth.ts          # Auth helpers & RBAC middleware
│   ├── utils.ts         # cn() utility
│   ├── supabase/
│   │   ├── client.ts    # Browser Supabase client
│   │   └── server.ts    # Server Supabase client
│   └── google/
│       ├── drive.ts     # Google Drive integration
│       └── sheets.ts    # Google Sheets sync
├── prisma/
│   ├── schema.prisma    # Full database schema
│   └── seed.ts          # Demo data seeder
├── scripts/             # Utility scripts
├── prisma.config.ts     # Prisma configuration
├── proxy.ts             # Auth guard middleware
└── next.config.ts       # Next.js configuration
```

## Development Phases

| Phase | Scope | Status |
|-------|-------|--------|
| 0 | Auth, basic CRUD (VAs, Clients, Assignments, Work Logs) | Complete |
| 1 | Department Hierarchy, Positions, Memberships | Planned |
| 2 | VA Workforce: Enhanced profiles, skills v2, employment records, leave, documents | Planned |
| 3 | Client Workforce & Service Lines, skill matching | Planned |
| 4 | Consolidated ticketing system | Planned |
| 5 | Reports, dashboards, polish | Planned |

## Deployment

The app is deployed to Vercel with automatic HTTPS. Database migrations run as part of the build pipeline:

1. Push to `main` → GitHub Actions triggers
2. `npx prisma migrate deploy` against production DB
3. `next build` with production optimizations
4. Deploy to Vercel

For the complete architecture blueprint, database schema documentation, and production deployment guide, see `VA-Management-System-Blueprint.docx` in the parent directory.

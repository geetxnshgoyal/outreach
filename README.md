# Outreach Portal

A premium outreach management system for BugBash events.

## Features
- **Role-based Authentication**: Separate portals for Administrators and Outreach Team members.
- **CSV Data Ingestion**: Admin can upload participant lists; the system automatically maps fields and handles duplicates.
- **Outreach Workflow**: Team members can track call status (Called, Not Picked, Will Come, etc.) and add detailed notes for each participant.
- **Interactive Dashboard**: Real-time stats and advanced filtering by Event, Status, and Search.
- **Notification System**: Automatic alerts (simulated) when new registrations are imported.

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Initialize the database:
   ```bash
   npx prisma migrate dev --name init
   ```
3. Seed default users:
   ```bash
   node prisma/seed.js
   ```

### Default Credentials
- **Admin**: `admin@outreach.com` / `admin123`
- **Outreach Team**: `team@outreach.com` / `team123`

### Development
Start the development server:
```bash
npm run dev
```

The portal will be available at [http://localhost:3000](http://localhost:3000).

## Technical Stack
- **Framework**: Next.js 15 (App Router)
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS with Glassmorphism
- **Auth**: NextAuth.js
- **Icons**: Lucide React

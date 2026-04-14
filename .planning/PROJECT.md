# PROJECT.md - Outreach Portal

## Purpose
A specialized web portal for managing bugbash event registrations. The system enables admins to upload participant data via CSV files and allows the outreach team to track communication status with participants.

## Context
The project is built for a bugbash event where multiple registrations occur daily. The outreach team needs to call participants to verify their registrations, handle issues, and confirm attendance.

## Core Features
- **Authentication**: Role-based access for Admin and Outreach team members.
- **CSV Data Management**: 
  - Admin can upload CSV files containing registration data.
  - System identifies and adds new registrations.
- **Outreach Dashboard**:
  - View participants by event (up to 13 events).
  - Search and filter participants.
  - Update communication status (e.g., Called, Not Picked, Will Come, Not Interested).
- **Notifications**: Email notifications to the outreach team when new registrations are uploaded (simulated).

## Tech Stack
- **Frontend/Backend**: Next.js 14+ (App Router)
- **Database**: Prisma + SQLite
- **Styling**: Tailwind CSS + Shadcn UI
- **Parser**: PapaParse (CSV)
- **Auth**: NextAuth.js (Credentials provider)

## Implementation Priorities (Milestones)
1. **MVP Infrastructure**: Project setup, Database schema, and Auth.
2. **Data Pipeline**: CSV upload and ingestion logic.
3. **Outreach Interface**: Dashboard for viewing and updating participant statuses.
4. **Polish & Notifications**: Email triggers and UI refinements.

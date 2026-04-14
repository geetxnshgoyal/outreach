# REQUIREMENTS.md - Outreach Portal

## User Stories

### Admin
- **AS AN** Admin, **I WANT TO** log in to the system **SO THAT** I can manage registration data.
- **AS AN** Admin, **I WANT TO** upload a CSV file **SO THAT** I can import new participant data.
- **AS AN** Admin, **I WANT TO** specify which of the 13 events the CSV belongs to **SO THAT** data is organized correctly.
- **AS AN** Admin, **I WANT TO** see a summary of the upload (e.g., "50 new registrations added") **SO THAT** I know the process was successful.

### Outreach Team
- **AS AN** Outreach Member, **I WANT TO** log in to the system **SO THAT** I can see the participants I need to call.
- **AS AN** Outreach Member, **I WANT TO** see a list of participants for a specific event **SO THAT** I can focus my work.
- **AS AN** Outreach Member, **I WANT TO** search for a participant by name or email **SO THAT** I can find them quickly.
- **AS AN** Outreach Member, **I WANT TO** update the status of a participant (e.g., "Mark as Called") **SO THAT** the team knows theyve been handled.
- **AS AN** Outreach Member, **I WANT TO** add notes to a participant record **SO THAT** I can record specific feedback they provided.

## Functional Requirements
1. **Authentication System**:
   - Secure login for Admin and Outreach roles.
   - Session management.
2. **CSV Processor**:
   - Parse CSV headers matching the provided template.
   - Deduplication based on Email + Event.
   - Store data in SQLite via Prisma.
3. **Outreach Dashboard**:
   - Responsive table layout.
   - Filtering by Event, Status, and Date.
   - Inline status editing or modal-based updates.
4. **Email Notification System**:
   - Trigger a notification to outreach members (mocked for now) when a new CSV is processed.

## Non-Functional Requirements
- **Performance**: CSV ingestion should handle up to 5000 rows quickly.
- **Usability**: "WOW" factor in UI design, especially the dashboard.
- **Reliability**: Use SQLite for persistent storage.

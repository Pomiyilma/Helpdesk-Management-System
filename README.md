# Helpdesk Management System

This is the required full-featured helpdesk ticketing system built with TypeScript, Next.js 14+, Prisma, and PostgreSQL. Regular employees can report issues, technical staff resolve them, and managers coordinate assignments.

Firstly, I want to apologize for the generic looking UI I have implemented. I have tried to make the user interface as beautiful as possible. But the reason I didn't gave much of my time on it is because I was heavily focused on tradeoffs and some behind-the-scene activities that happen while developing this system. Since it was my first time working with Prisma as well, I had to give the backend most of my attention. Even though most of the system architectures were specified on the file, I had to understand why one was better than the other and what else could have made the system more efficient and more optimal. Those tasks took lots of time to divulge that I couldn't make the frontend and UI/UX as spectacular as I can. 

## Features

### User Roles

**Manager**
- View all tickets in the system
- Assign tickets to technical employees
- Change ticket priority and status
- View team workload via dashboard statistics
- Filter tickets by assignee, status, priority, and category

**Technical Employee**
- View tickets assigned to them
- Update ticket status (Assigned → In Progress → Resolved)
- Add comments and updates to tickets
- Resolve tickets

**Employee**
- Create tickets with title, description, priority, and category
- View their own tickets
- Confirm resolution and close tickets

### Ticket Workflow

**Status Flow:**
1. Open - Employee creates ticket
2. Assigned - Manager assigns to technical employee
3. In Progress - Technical employee starts working
4. Resolved - Technical employee fixes issue
5. Closed - Employee confirms resolution

**Status Transitions:**
- Employee: Can create (Open), confirm (Close)
- Technical: Can move Assigned → In Progress → Resolved
- Manager: Can assign and update any status

### Ticket Fields

**Required Fields:**
- Title (short summary)
- Description (problem details)
- Category (IT Support, Facilities, HR, Other)
- Priority (Low, Medium, High, Critical)

**Auto-generated:**
- Ticket ID (e.g., TKT-0001)
- Created date
- Created by (current user)

**System-managed:**
- Status (starts at Open)
- Assigned to (technical employee)

### Pages

**Dashboard**
- Role-specific view with statistics
- Manager: All tickets by priority and status
- Technical: My tickets and open assigned tickets
- Employee: My tickets and tickets awaiting action
- Quick stats cards for each role

**Ticket List**
- Filter by status, priority, assigned to, category
- Sort by date, priority, status
- Search by title
- Role-appropriate actions displayed

**Ticket Detail**
- Full ticket information display
- Activity timeline (creation → updates → resolution)
- Comment/update section
- Role-based action buttons

**Ticket Creation**
- Form with all required fields
- Submit creates ticket with Open status



<img src="app/public/image.png" alt="Image Description" width="600"/>

<img src="app/public/image1.png" alt="Image Description 1" width="600"/>



### Technical Implementation

**Stack:**
- Framework: Next.js 16.2.11 (App Router)
- Language: TypeScript
- ORM: Prisma 7.9.0 (PostgreSQL)
- Form Handling: React Hook Form 7.82.0
- Validation: Zod 4.4.3
- Styling: TailwindCSS 4.3.3
- Authentication: JWT with cookies (jsonwebtoken 9.0.3)
- Password Hashing: bcryptjs 3.0.3

**Architecture:**
- No API routes - uses Server Actions for all mutations
- Server Components for data fetching
- Client Components only for interactivity
- Server-side validation using shared Zod schemas
- Role-based access control enforced at server level
- Middleware for route protection

**Database Schema:**
- User model with roles (MANAGER, TECHNICAL, EMPLOYEE)
- Ticket model with status, priority, category enums
- TicketComment model with type tracking (COMMENT, STATUS_CHANGE, ASSIGNMENT)
- Proper relationships between users, tickets, and comments

## Setup Instructions

### Prerequisites
- Node.js 20+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your database connection string and JWT secret:
```
DATABASE_URL="postgresql://user:password@localhost:5432/helpdesk_db"
JWT_SECRET="your-secret-key-here"
```

4. Generate Prisma client:
```bash
npx prisma generate
```

5. Run database migrations:
```bash
npx prisma migrate dev
```

6. Seed the database with sample users and tickets:
```bash
npx tsx prisma/seed.ts
```

7. Start the development server:
```bash
npm run dev
```

8. Open http://localhost:3000 in your browser

### Preseeded Data

**Users:**

Managers (2):
- manager1@company.com / password123
- manager2@company.com / password123

Technical Staff (3):
- tech1@company.com / password123
- tech2@company.com / password123
- tech3@company.com / password123

Employees (3):
- emp1@company.com / password123
- emp2@company.com / password123
- emp3@company.com / password123

**Sample Tickets:**
15 pre-seeded tickets in various states (Open, Assigned, In Progress, Resolved, Closed) across all categories (IT Support, Facilities, HR, Other) and priority levels (Low, Medium, High, Critical).

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Database Management

- `npx prisma studio` - Open Prisma Studio to view/edit database
- `npx prisma migrate dev` - Create and apply new migration
- `npx prisma migrate reset` - Reset database and reapply migrations
- `npx tsx prisma/seed.ts` - Re-seed database with sample data

## Security Considerations

- JWT tokens stored in httpOnly cookies
- Passwords hashed with bcrypt (12 rounds)
- Server-side validation on all inputs
- Role-based access control enforced on all operations
- SQL injection prevention via Prisma ORM
- CSRF protection via Server Actions

## Interview Preparation Topics

**Database Schema Design:**
- Separation of User, Ticket, and TicketComment models
- Enum types for Status, Priority, Category, Role, CommentType
- Relationships: User has many created tickets and assigned tickets, Ticket has many comments
- Cascade delete for comments when ticket is deleted

**Role-based Permissions:**
- Implemented in `lib/ticket-access.ts` and `lib/ticket-workflow.ts`
- Manager: Full access to all tickets
- Technical: Access only to assigned tickets
- Employee: Access only to own tickets
- Status transitions restricted by role

**Validation Strategy:**
- Shared Zod schemas in `lib/validations/`
- Client-side validation with React Hook Form + Zod resolver
- Server-side validation in Server Actions using same schemas
- Type safety throughout with TypeScript

**Server Actions Implementation:**
- All mutations in `app/actions/` directory
- `'use server'` directive for server-side execution
- FormData handling for form submissions
- Revalidation of paths after mutations 
- Proper error handling with user-friendly messages

**Optimistic Updates:**
- React useTransition for non-blocking UI updates
- Router refresh after successful mutations
- Loading states on buttons during operations

**Error Handling:**
- Try-catch blocks in all Server Actions
- User-friendly error messages returned to client
- Server-side logging for debugging
- Graceful fallbacks for missing data

**Performance Optimizations:**
- Server Components for data fetching (no client-side hydration)
- Prisma query optimization with selective fields
- Suspense boundaries for loading states
- Database indexes on foreign keys and unique fields
- Efficient filtering and sorting at database level

## Project Structure

```
helpdesk-management/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx          # Login page
│   ├── actions/
│   │   ├── auth-actions.ts       # Authentication Server Actions
│   │   └── ticket-actions.ts     # Ticket Server Actions
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard with role-specific stats
│   ├── tickets/
│   │   ├── [id]/
│   │   │   ├── page.tsx          # Ticket detail page
│   │   │   ├── AddCommentForm.tsx
│   │   │   └── TicketActions.tsx
│   │   ├── new/
│   │   │   └── page.tsx          # Ticket creation page
│   │   ├── page.tsx              # Ticket list with filters
│   │   └── TicketFilters.tsx    # Filter component
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home redirect
├── components/
│   └── ui/
│       └── AppShell.tsx          # Shared layout component
├── lib/
│   ├── auth.ts                  # JWT and authentication utilities
│   ├── prisma.ts                # Prisma client singleton
│   ├── ticket-access.ts         # Role-based access control
│   ├── ticket-workflow.ts       # Status transition logic
│   └── validations/
│       ├── auth.ts              # Auth validation schemas
│       └── ticket.ts            # Ticket validation schemas
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Database seeding script
└── middleware.ts                # Route protection middleware
```


This is what the system looks like in general. The only thing I believe needs more focus is the 'Apply Filters' button, which keeps breaking other functionalities as I fix it again and again. So I decided to leave it be. Other than that everything looks and works alright. 

                            Thank you for reading!!!


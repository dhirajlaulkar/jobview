# JobView - Modern Job Portal

JobView is a streamlined job portal built with a modern tech stack. It aggregates job listings from multiple sources, including curated positions managed by admins and live feeds from external job APIs.

 ## Features

- **Dual Job Sources**:
  - **Jobs by JobView**: Admin-curated job postings stored in the local database.
  - **Live Jobs**: Real-time listings aggregated from external APIs.
- **Advanced Search & Filtering**:
  - Full-text search for jobs by title, company, or description.
  - Filter jobs by salary, job type, and experience level.
- **Admin Dashboard**:
  - Secure area for administrators to perform CRUD operations (Create, Read, Update, Delete) on "Jobs by JobView".
- **User Authentication**:
  - Secure sign-up, sign-in, and user management powered by Clerk.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 14 (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (or any Prisma-compatible DB)
- **Authentication**: [Clerk](https://clerk.com/)
- **External APIs**: Adzuna, Remote OK

## ⚙️ Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/en/) (v18.17 or newer)
- [pnpm](https://pnpm.io/installation)
- A running PostgreSQL database instance.

### 2. Clone the Repository

```bash
git clone https://github.com/your-username/jobview.git
cd jobview
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Set Up Environment Variables

Create a `.env` file in the root of the project by copying the example file:

```bash
cp .env.example .env
```

Now, open the `.env` file and add your credentials.

| Variable                          | Description                                                                                             |
| --------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                    | Your full PostgreSQL connection string.                                                                 |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | The publishable key from your Clerk application dashboard.                                              |
| `CLERK_SECRET_KEY`                | The secret key from your Clerk application dashboard.                                                   |
| `ADZUNA_APP_ID`                   | Your application ID from the [Adzuna Developer Portal](https://developer.adzuna.com/admin/applications). |
| `ADZUNA_APP_KEY`                  | Your application key from the Adzuna Developer Portal.                                                  |

### 5. Set Up the Database

Run the following commands to generate the Prisma client and sync your schema with the database:

```bash
npx prisma generate
npx prisma db push
```

### 6. Run the Development Server

```bash
pnpm dev
```

The application should now be running at [http://localhost:3000](http://localhost:3000).

##  Admin Access

To gain access to the admin dashboard located at `/admin`:

1.  Sign up for an account in the application.
2.  Go to your [Clerk Dashboard](https://dashboard.clerk.com/).
3.  Navigate to the "Users" section and select your user.
4.  In the "Metadata" section, add the following to **Public Metadata**:
    ```json
    {
      "role": "admin"
    }
    ```
5.  Save the changes. You should now have access to the `/admin` route.

## 📂 Project Structure

```
jobview/
├── app/
│   ├── (main)/           # Main application routes (jobs, live)
│   ├── admin/            # Admin dashboard routes
│   ├── api/              # API endpoints
│   └── layout.tsx        # Root layout
├── components/
│   ├── jobs/             # Job-related components
│   ├── layout/           # Header, Footer, etc.
│   └── ui/               # Reusable UI components from shadcn/ui
├── lib/
│   ├── prisma.ts         # Prisma client instance
│   └── services/         # External API service integrations
└── prisma/
    └── schema.prisma     # Database schema definition
```

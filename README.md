# Grimoire 2.0 - Mage: The Ascension Rote Library

A beautiful digital grimoire for managing Mage: The Ascension rotes with full database persistence and admin panel.

## 🎯 Features

- ✨ **Browse & Search** - Find rotes by tradition, sphere, or keyword
- ➕ **Add Rotes** - Contribute your own mystical knowledge
- 🔐 **Admin Panel** - Manage all rotes with password protection
- 💾 **Database Persistence** - All rotes saved server-side
- 🎨 **Beautiful UI** - Grimoire-themed interface with parchment aesthetics

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 2. Setup Database

You have several options for the database:

#### Option A: Local PostgreSQL
```bash
# Install PostgreSQL locally
# Then create a database
createdb grimoire

# Create .env file
cp .env.example .env

# Edit .env and set:
DATABASE_URL="postgresql://user:password@localhost:5432/grimoire"
```

#### Option B: Vercel Postgres (Recommended for deployment)
1. Create a Vercel account
2. Add Vercel Postgres to your project
3. Copy the DATABASE_URL from Vercel dashboard to .env

#### Option C: Supabase
1. Create a Supabase project
2. Get your connection string from Supabase dashboard
3. Add to .env:
```
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

### 3. Initialize Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# OR create a migration (for production)
npm run db:migrate
```

### 4. Seed Database (Optional)

You can seed the database with sample rotes using the Admin Panel:
1. Start the dev server
2. Click the shield icon in the top-right corner
3. Enter password: `TruthUntilParadox`
4. Click "Seed Sample Rotes"

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔐 Admin Panel

Access the admin panel by clicking the shield icon in the top-right corner.

**Password:** `TruthUntilParadox`

### Admin Features:
- 🗑️ **Delete All Rotes** - Clear the entire database
- 🗑️ **Delete Individual Rotes** - Remove specific entries
- 🌱 **Seed Sample Rotes** - Add 12 example rotes
- 📊 **View Statistics** - See total rote count

## 📝 Database Schema

```prisma
model Rote {
  id          String   @id @default(cuid())
  name        String
  tradition   String
  description String   @db.Text
  spheres     Json
  level       String
  pageRef     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio (database GUI)

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Add Vercel Postgres
4. Deploy!

Vercel will automatically:
- Install dependencies
- Run `prisma generate`
- Build the Next.js app

### Environment Variables for Production

Make sure to set in your hosting platform:
```
DATABASE_URL=your_production_database_url
```

## 🎨 Tech Stack

- **Framework:** Next.js 16 + React 19
- **Database:** PostgreSQL + Prisma ORM
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Fonts:** Cinzel, Crimson Text, IM Fell DW Pica

## 📚 API Routes

- `GET /api/rotes` - Get all rotes
- `POST /api/rotes` - Create a new rote
- `GET /api/rotes/[id]` - Get single rote
- `PUT /api/rotes/[id]` - Update a rote
- `DELETE /api/rotes/[id]` - Delete a rote
- `POST /api/admin/auth` - Verify admin password
- `DELETE /api/admin/delete-all` - Delete all rotes (requires password)
- `POST /api/admin/seed` - Seed sample rotes (requires password)

## 🔒 Security Notes

⚠️ **IMPORTANT:** The admin password is currently hardcoded. For production:
1. Move password to environment variable
2. Hash the password
3. Consider using proper authentication (NextAuth.js)

## 📖 Usage

1. **Browse Rotes** - View all rotes organized by tradition
2. **Search** - Find specific rotes using filters
3. **Add New Rote** - Contribute your own magical knowledge
4. **Admin Panel** - Manage the grimoire (password protected)

---

*May your paradox be minimal and your Arete be strong!* ✨

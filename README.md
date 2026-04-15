# 🎡 The Paradox Wheel

**A comprehensive digital grimoire for Mage: The Ascension**  
Browse rotes, track characters, manage experience, and explore the Spheres.

> *"Where Reality Bends • Navigate the Spheres"*

---

## ✨ Features

### **📚 Rote Library**
- **Browse & Search** - 1000+ rotes with advanced filtering
- **Sphere Filtering** - Visual dot interface for precise sphere requirements
- **Random Discovery** - Explore 20 rotes at a time in random order
- **Multiple Combinations** - Support for rotes with alternative sphere paths
- **Share Rotes** - Direct links to individual rotes
- **Add Your Own** - Contribute your mystical discoveries

### **🎭 Character Management**
- **Guided Character Creation** - Step-by-step wizard for new mages
- **Full Character Sheets** - Store attributes, abilities, spheres, backgrounds
- **Merits & Flaws** - Complete database with filtering and search
- **Experience Tracking** - Gain XP, spend on improvements
- **Official XP Costs** - Built-in M:tA 20th Anniversary rules
- **Custom XP Costs** - House rules support per character
- **Post-Creation Growth** - Add merits, backgrounds, and flaws with XP
- **Character Rotes** - Assign rotes to your characters

### **⚙ Wonders & Artifacts**
- **Wonder Database** - Artifacts, talismans, fetishes, grimoires
- **7 Wonder Categories** - Complete classification system
- **Character Wonders** - Track who has which wonders
- **Search & Filter** - Find wonders by category or requirements

### **📖 Resources & References**
- **Recommended Resources** - Curated books, podcasts, websites, tools
- **Official XP Costs** - Quick reference table with examples
- **Mage Groups** - Detailed information on Traditions and Conventions
- **Reader Mode** - Simplified, distraction-free reading interface

### **🔐 User System**
- **Account Creation** - Sign up with email/password
- **Secure Authentication** - NextAuth.js with bcrypt
- **Personal Dashboard** - View your characters and progress
- **Admin Roles** - Special permissions for site administrators

### **⚡ Admin Panel**
- **Site Updates & Changelog** - Announce new features
- **Book Releases** - Manage upcoming Mage publications
- **Content Management** - Edit welcome text, about page, footer
- **Rote Management** - CRUD operations on all rotes
- **Merit/Flaw Database** - Manage complete lists
- **Resource Curation** - Feature recommended content
- **User Management** - View and manage accounts
- **Character Creation Guide** - Customize creation wizard text

---

## 🎨 Design Features

- **Grimoire Aesthetic** - Parchment textures, ornamental borders
- **Dark/Light Themes** - Toggle between modes
- **Reader Mode** - Simplified grayscale view for extended reading
- **Mobile Responsive** - Works on all screen sizes
- **Custom Fonts** - Cinzel, Crimson Text, decorative symbols
- **Markdown Support** - Rich text in descriptions

---

## 🚀 Quick Start

### **1. Install Dependencies**

```bash
npm install
```

### **2. Setup Database**

#### Option A: Vercel Postgres (Recommended)
```bash
# Connect to Vercel, add Postgres
vercel link
vercel env pull .env.local
```

#### Option B: Local PostgreSQL
```bash
createdb paradox_wheel
```

Create `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/paradox_wheel"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

### **3. Initialize Database**

```bash
# Push schema to database
npx prisma db push

# Seed XP costs (optional but recommended)
npx tsx prisma/seed-xp-costs.ts

# Generate Prisma Client
npx prisma generate
```

### **4. Create Admin User**

```bash
# Open Prisma Studio
npx prisma studio

# Create user with isAdmin = true
```

### **5. Run Development Server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Database Schema

### **Core Models**
- **Rote** - Magical procedures with sphere requirements
- **Merit/Flaw** - Character advantages and disadvantages
- **Background** - Character resources and connections
- **Wonder** - Magical artifacts and devices
- **Resource** - External links and references
- **MageGroup** - Traditions and Technocracy conventions

### **Character System**
- **User** - Authentication and account management
- **Character** - Player character data
- **CharacterRote** - Rotes assigned to characters
- **CharacterWonder** - Wonders owned by characters
- **CharacterMerit/Flaw** - Post-creation merits/flaws
- **CharacterBackground** - Post-creation backgrounds

### **Experience System**
- **ExperienceLog** - XP transactions (gains and spending)
- **ExperienceCost** - Official M:tA XP cost formulas
- **CharacterMerit/Flaw/Background** - XP tracking per purchase

### **Site Management**
- **SiteSettings** - Homepage, about page, footer content
- **SiteUpdate** - Changelog entries
- **BookRelease** - Upcoming Mage publications
- **CharacterCreationContent** - Wizard step descriptions

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **React:** 19
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** NextAuth.js v4
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui + Radix UI
- **Markdown:** react-markdown
- **Fonts:** Cinzel (serif), Crimson Text (body), Inter (UI)

---

## 📝 Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint

# Database
npx prisma studio    # Database GUI
npx prisma db push   # Push schema changes
npx prisma migrate   # Create migration
npx prisma generate  # Generate client

# Seeding
npx tsx prisma/seed-xp-costs.ts  # Seed official XP costs
```
---

## 🎯 Key Features Explained

### **Experience System**

Track character progression with official Mage: The Ascension rules:

```
Attribute: new rating × 4
Ability: new rating × 2
Arete: new rating × 8
Sphere: new rating × 7
Willpower: current rating × 1
Background: new rating × 3
Merit: merit cost × 2
Remove Flaw: flaw value × 2
```

**Features:**
- Award XP after sessions
- Spend on improvements
- Complete transaction log
- Custom costs per character
- Automatic calculations

### **Character Creation**

5-step guided wizard:
1. **Concept** - Name, tradition, nature, demeanor, essence
2. **Attributes** - Physical, Social, Mental (7/5/3)
3. **Abilities** - Talents, Skills, Knowledges (13/9/5)
4. **Spheres** - Affinity + 6 dots, backgrounds
5. **Finishing** - Freebie points, merits/flaws, Arete, Willpower

### **Rote Browsing**

Advanced filtering system:
- **Visual Sphere Dots** - Click to set minimum requirements
- **Tradition Filter** - Select from 20+ groups
- **Search** - Name, description, tradition
- **Random Order** - Discover 20 at a time
- **Load More** - Progressive loading

### **Reader Mode**

Simplified reading experience:
- Grayscale color scheme
- Remove decorative elements
- Increase line spacing
- System fonts
- Better contrast
- Max 900px width

---

## 🌐 Deployment

### **Vercel (Recommended)**

1. Push to GitHub
2. Import to Vercel
3. Add Vercel Postgres
4. Set environment variables:
   ```
   DATABASE_URL=(provided by Vercel)
   NEXTAUTH_SECRET=(generate with: openssl rand -base64 32)
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```
5. Deploy!

### **Other Platforms**

Works on any platform with PostgreSQL and Node.js support:
- Railway
- Render
- Fly.io
- DigitalOcean App Platform

---

## 🔒 Security

- **Password Hashing** - bcrypt for user passwords
- **Session Management** - NextAuth.js JWT tokens
- **Protected Routes** - Middleware guards authenticated pages
- **Admin Checks** - Role-based access control
- **SQL Injection** - Prevented by Prisma ORM
- **Input Validation** - Zod-style validation on API routes
- **CORS** - Next.js built-in protections

### **Admin Access**

Admin panel requires `isAdmin: true` in user database record.

---

## 📚 Content Management

### **Site Updates**

Announce changes with:
- Title and description (Markdown)
- Category (Feature, Bug Fix, Content, Improvement, Announcement)
- Priority (higher shows first)
- Publish/draft status
- Dismissible homepage banner

### **Book Releases**

Promote upcoming books with:
- Title, publisher, description
- Release date and status
- Cover image URL
- Purchase and announcement links
- Homepage widget display

---

## 🎨 Customization

### **Themes**

Modify `app/globals.css`:
```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --primary: 300 45% 30%;
    --accent: 42 42% 59%;
    /* ... */
  }
}
```

### **Fonts**

Update `next.config.js` and import fonts in `app/layout.tsx`

### **Content**

All text content editable via Admin Panel → Content tab

---

## 🤝 Contributing

This is a personal project, but ideas are welcome!

### **Reporting Bugs**

Open an issue with:
- Description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

---

## 📖 Credits

### **Game System**
- Mage: The Ascension © White Wolf Publishing / Paradox Interactive
- This is an unofficial fan project

### **Resources**
- [Mage: The Ascension 20th Anniversary](https://www.drivethrurpg.com/product/149562/Mage-The-Ascension-20th-Anniversary-Edition)
- [World of Darkness Wiki](https://whitewolf.fandom.com/wiki/Mage:_The_Ascension)

### **Technologies**
- Next.js, React, Tailwind CSS
- Prisma, PostgreSQL
- shadcn/ui components
- NextAuth.js

---

## 📄 License

This project is for personal and educational use. Mage: The Ascension is trademarked by Paradox Interactive AB.

---

## 🗺️ Roadmap

### **Planned Features**
- [ ] Character sheet PDF export
- [ ] Dice roller integration
- [ ] Chronicle management (multiple characters)
- [ ] Paradox tracking system
- [ ] Resonance and quintessence pools
- [ ] Collaborative character creation
- [ ] Mobile app (React Native)
- [ ] API for third-party integrations

### **Under Consideration**
- [ ] AI-powered rote suggestions
- [ ] Character portrait generator
- [ ] Session note-taking
- [ ] Initiative tracker
- [ ] NPC database
- [ ] Cabal (group) management

---

## 💬 Support

For questions or issues:
1. Check the [installation guide](docs/installation.md)
2. Search existing issues
3. Create a new issue with details

---

## 🙏 Acknowledgments

Thanks to:
- The Mage: The Ascension community
- Onyx Path Publishing for continuing the line
- White Wolf for creating this amazing game
- Everyone who has contributed rotes and feedback

---

*"Reality is what you make of it. Make it wisely."* ✨

---

**Version:** 2.0  
**Last Updated:** April 2026  
**Maintained by:** Nicolás Castrege

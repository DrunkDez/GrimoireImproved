# 🎯 New Features: Merits & Flaws + Recommended Resources

## ✅ What's New

1. **Merits & Flaws Page** - Organized by category (Physical, Mental, Social, Supernatural, etc.)
2. **Recommended Resources Page** - Podcasts, websites, books, videos, etc.
3. **Admin Management** - Full admin panels to add/edit/delete both

---

## 📦 Files to Upload

### 1. Database Schema
**File:** `schema.prisma`
**Location:** `prisma/schema.prisma`
**What:** Adds Merit and Resource models to database

### 2. API Routes for Merits
**Folder:** `api-merits/`
**Location:** `app/api/merits/`
**Contents:**
- `route.ts` - GET all merits, POST new merit
- `[id]/route.ts` - GET/PUT/DELETE individual merit

### 3. API Routes for Resources
**Folder:** `api-resources/`
**Location:** `app/api/resources/`
**Contents:**
- `route.ts` - GET all resources, POST new resource
- `[id]/route.ts` - GET/PUT/DELETE individual resource

### 4. Public Pages
**Files:**
- `merits-flaws-page.tsx` → `app/merits-flaws/page.tsx`
- `recommended-page.tsx` → `app/recommended/page.tsx`

### 5. Admin Panel Components
**Files:**
- `admin-merits-panel.tsx` → `components/admin/admin-merits-panel.tsx`
- `admin-resources-panel.tsx` → `components/admin/admin-resources-panel.tsx`

---

## 🗄️ Database Migration

After uploading files, you MUST run Prisma commands:

### Option A: Via Vercel (Automatic)
Your `package.json` already has:
```json
"build": "prisma generate && prisma db push && next build"
```
✅ Database will update automatically on next deployment!

### Option B: Manual (If Needed)
```bash
npx prisma generate
npx prisma db push
```

This creates two new tables:
- ✅ `Merit` - Stores all merits and flaws
- ✅ `Resource` - Stores recommended resources

---

## 🎨 Features Overview

### Merits & Flaws Page
**URL:** `/merits-flaws`

**Features:**
- ✅ Two tabs: Merits & Flaws
- ✅ Organized by category
- ✅ Search functionality
- ✅ Shows point cost
- ✅ Page references
- ✅ Beautiful grimoire styling

**Example Categories:**
- Physical
- Mental  
- Social
- Supernatural
- Background
- General

### Recommended Resources Page
**URL:** `/recommended`

**Features:**
- ✅ Featured resources section
- ✅ Filter by type (Podcast, Website, Book, Video, etc.)
- ✅ Search functionality
- ✅ External links
- ✅ Author attribution
- ✅ Category badges

**Resource Types:**
- Podcast
- Website
- Book
- Video
- Article
- Tool
- Blog
- Community

### Admin Panels
**Access:** Via existing admin panel (password: TruthUntilParadox)

**Merits Panel:**
- Add/Edit/Delete merits and flaws
- Select category from dropdown
- Set merit (positive) or flaw (negative)
- Assign point costs
- Add descriptions
- Optional page references

**Resources Panel:**
- Add/Edit/Delete resources
- Select type (Podcast, Website, etc.)
- Add URLs, authors, images
- Mark as "Featured" to show at top
- Categorize by topic

---

## 🔗 Adding Navigation Links

You'll want to add links to these pages in your navigation. Here are some options:

### Option 1: Add to GrimoireHeader

Edit `components/grimoire-header.tsx` to add quick links:

```typescript
// After the title, add navigation links
<div className="flex justify-center gap-4 mt-4">
  <Link href="/merits-flaws">
    <Button variant="outline">Merits & Flaws</Button>
  </Link>
  <Link href="/recommended">
    <Button variant="outline">Resources</Button>
  </Link>
</div>
```

### Option 2: Add to UserNav Menu

Edit `components/auth/user-nav.tsx` to add menu items:

```typescript
<DropdownMenuItem asChild>
  <Link href="/merits-flaws">
    <Star className="mr-2 h-4 w-4" />
    Merits & Flaws
  </Link>
</DropdownMenuItem>
<DropdownMenuItem asChild>
  <Link href="/recommended">
    <BookOpen className="mr-2 h-4 w-4" />
    Resources
  </Link>
</DropdownMenuItem>
```

### Option 3: Add to Main Navigation Tabs

If you want them as main tabs, edit `components/grimoire-nav.tsx`:

```typescript
const tabs = [
  // ... existing tabs
  { id: "merits", label: "Merits & Flaws", symbol: "\u2726" },
  { id: "resources", label: "Resources", symbol: "\u{1F4DA}" },
]
```

---

## 🎯 Using the Features

### As Admin:

1. **Go to Admin Panel** (existing password)
2. **Look for new tabs/sections:**
   - "Merits & Flaws Management"
   - "Recommended Resources Management"
3. **Click "Add New"**
4. **Fill in the form**
5. **Save!**

### Adding Merits:

```
Name: Natural Linguist
Category: Mental
Type: Merit
Cost: 2
Description: You have a natural affinity for languages. Reduce the difficulty of learning new languages by 2.
Page Ref: M20 Core, p.123
```

### Adding Resources:

```
Name: Mage: The Podcast
Type: Podcast
Category: Lore
Description: Deep dives into Mage lore and gameplay
URL: https://magepodcast.example.com
Author: John Smith
Featured: ✅ (check to show at top)
```

---

## 📋 Quick Setup Checklist

- [ ] Upload `schema.prisma` to `prisma/schema.prisma`
- [ ] Upload `api-merits` folder to `app/api/merits/`
- [ ] Upload `api-resources` folder to `app/api/resources/`
- [ ] Upload `merits-flaws-page.tsx` to `app/merits-flaws/page.tsx`
- [ ] Upload `recommended-page.tsx` to `app/recommended/page.tsx`
- [ ] Upload admin components to `components/admin/`
- [ ] Commit and push to GitHub
- [ ] Vercel auto-deploys
- [ ] Database tables created automatically
- [ ] Visit `/merits-flaws` and `/recommended`
- [ ] Add content via admin panel!

---

## ✨ Future Enhancements (For Later)

**Merits:**
- Import bulk merits from spreadsheet
- Character sheet integration
- Point calculation
- Prerequisites system

**Resources:**
- RSS feed integration
- Rating system
- Comments
- User submissions

---

## 🐛 Troubleshooting

**Pages show "No content":**
→ You haven't added any via admin panel yet!
→ Go to admin panel and add some

**404 on /merits-flaws:**
→ Make sure you created the `app/merits-flaws/page.tsx` file
→ Check file structure

**API errors:**
→ Make sure database migration ran (`prisma db push`)
→ Check Vercel deployment logs

**Admin panel doesn't show new sections:**
→ You need to integrate the admin components
→ I can help with this if needed

---

## 📝 Next Steps

1. **Upload all files**
2. **Deploy to Vercel**
3. **Test the pages**
4. **Add your merit/flaw list** via admin panel
5. **Add recommended resources** via admin panel
6. **(Optional) Add navigation links** to make them easier to find

---

**The pages are ready to go! Just add your content and they'll look amazing!** 🎉

Let me know if you need help integrating the admin panels into your existing admin interface!

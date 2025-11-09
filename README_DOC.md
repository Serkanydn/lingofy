# Learn&Quiz English - Project Documentation

## 🎯 Main Purpose

**Learn&Quiz English** is a comprehensive, interactive English language learning platform designed to help students master English through four core learning methods: **Reading**, **Listening**, **Grammar**, and **Vocabulary Building**. The platform offers content for all CEFR proficiency levels (A1 to C1) with integrated quizzes, progress tracking, and a freemium business model.

### Core Mission
To make quality English education accessible to everyone by providing:
- **Free Grammar Education** - 100% free grammar content for all users
- **Premium Content Library** - 500+ premium reading and listening materials
- **Personalized Learning** - Track progress and build custom vocabulary collections
- **Interactive Assessment** - Quiz system to test comprehension and retention

---

## 🏗️ Project Overview

### What Problem Does It Solve?
Traditional English learning is often:
- Expensive and inaccessible
- Not personalized to learner levels
- Lacks integrated practice and assessment
- Doesn't track progress effectively

**Learn&Quiz English** addresses these issues by providing a comprehensive, affordable, and level-appropriate learning platform with built-in progress tracking and assessment tools.

### Target Users
- **English Learners:** Students at any level (A1-C1) seeking to improve their English
- **Self-Learners:** Individuals studying independently
- **Educators:** Teachers supplementing their curriculum
- **Professionals:** Those needing English for career advancement

---

## 📱 Platform Structure

### Total Pages/Routes: **25+ Main Pages**

### 1. **Public Pages** (3 pages)
- **Landing Page** (`/`) - Marketing homepage with feature overview
- **Login Page** (`/login`) - User authentication
- **Register Page** (`/register`) - New user registration

### 2. **Main Application Pages** (10+ pages)

#### Dashboard
- **Home Dashboard** (`/`) - Main user dashboard with feature cards and statistics

#### Reading Module (5+ pages)
- **Reading Hub** (`/reading`) - Level selection (A1, A2, B1, B2, C1)
- **Reading Level List** (`/reading/[level]`) - Content list for each level (5 pages)
- **Reading Content Detail** (`/reading/[level]/[id]`) - Individual reading text with audio player
- **Reading Quiz** - Integrated quiz after content

#### Listening Module (5+ pages)
- **Listening Hub** (`/listening`) - Level selection
- **Listening Level List** (`/listening/[level]`) - Audio content by level (5 pages)
- **Listening Content Detail** (`/listening/[level]/[id]`) - Audio player with transcript
- **Listening Quiz** - Comprehension assessment

#### Grammar Module (10+ pages)
- **Grammar Categories** (`/grammar`) - 9 category cards (Tenses, Modals, Conditionals, etc.)
- **Grammar Category Topics** (`/grammar/[category-slug]`) - Topics within each category (9 pages)
- **Grammar Topic Detail** (`/grammar/[category-slug]/[topic-id]`) - Full lesson with examples
- **Grammar Quiz** - Practice exercises

#### Vocabulary Module (1 page - Premium Only)
- **My Words** (`/my-words`) - Personal vocabulary collection with:
  - Custom category management
  - Word addition/editing
  - Flashcard practice mode
  - Category-based filtering

#### Other User Pages
- **Statistics** (`/statistics`) - Learning progress and analytics
- **Premium Page** (`/premium`) - Subscription plans and features

### 3. **Admin Panel** (6+ pages)

- **Admin Dashboard** (`/admin`) - Platform statistics overview
- **User Management** (`/admin/users`) - Manage all users and premium status
- **Grammar Category Management** (`/admin/grammar/categories`) - Create/edit grammar categories
- **Grammar Topics Management** (`/admin/grammar`) - Create/edit grammar topics
- **Reading Content Management** (`/admin/reading`) - Create/edit reading texts
- **Listening Content Management** (`/admin/listening`) - Create/edit audio lessons

---

## 🎨 Core Features Breakdown

### Feature 1: Authentication System
**Purpose:** Secure user access and profile management

**Components:**
- User registration with email/password
- Login with session management
- Profile storage with premium status
- JWT-based authentication via Supabase
- Row Level Security (RLS) for data protection

**Key Tables:** `profiles` (linked to `auth.users`)

---

### Feature 2: Reading Practice Module
**Purpose:** Improve reading comprehension across all levels

**How It Works:**
1. User selects CEFR level (A1-C1)
2. Views list of available reading texts for that level
3. Reads text with optional audio playback
4. Takes comprehension quiz (5-10 questions)
5. Views results and score
6. Progress tracked in statistics

**Content Structure:**
- **Title:** Descriptive text title
- **Level:** A1, A2, B1, B2, or C1
- **Content:** Full reading text (100-600+ words based on level)
- **Audio URL:** Link to audio file for listening while reading
- **Premium Status:** Free or premium content
- **Quiz:** Multiple-choice questions linked via `quiz_content_id`

**Key Tables:** `reading_content`, `questions`, `question_options`, `user_question_attempts`

**Free vs Premium:**
- Free users: Limited access to basic level content
- Premium users: Full access to 500+ texts

---

### Feature 3: Listening Practice Module
**Purpose:** Enhance listening comprehension and pronunciation

**How It Works:**
1. User selects proficiency level
2. Views audio lessons for that level
3. Plays audio with custom controls (play/pause/speed)
4. Views transcript while listening
5. Takes listening comprehension quiz
6. Results recorded in statistics

**Content Structure:**
- **Title:** Lesson title
- **Level:** CEFR level
- **Audio URL:** Link to audio file
- **Duration:** Length in seconds
- **Transcript:** Full text transcript
- **Description:** Brief lesson overview
- **Premium Status:** Access control

**Key Tables:** `listening_content`, `questions`, `question_options`

**Audio Features:**
- Howler.js for audio playback
- Speed control (0.75x - 1.5x)
- Progress bar
- Transcript synchronization

---

### Feature 4: Grammar Practice Module (100% FREE)
**Purpose:** Master English grammar through structured lessons

**Philosophy:** Grammar is fundamental to learning English, therefore ALL grammar content is permanently free for everyone.

**How It Works:**
1. User browses 9 grammar categories (database-driven)
2. Selects category (e.g., "Tenses", "Modals", "Conditionals")
3. Views topics within that category
4. Studies topic with detailed explanations and examples
5. Reads mini practice text
6. Takes grammar quiz
7. Views results and feedback

**Grammar Categories (Dynamic):**
The system uses a **database-driven category system** instead of hardcoded enums:

| Category | Icon | Description | Color |
|----------|------|-------------|-------|
| Tenses | ⏰ | Present, past, future, and perfect tenses | Blue |
| Modals | 🔑 | Modal verbs (can, could, should, etc.) | Purple |
| Conditionals | 🔀 | If-clauses and conditional sentences | Orange |
| Passive Voice | 🔄 | Active to passive transformations | Green |
| Reported Speech | 💬 | Direct and indirect speech | Pink |
| Articles | 📰 | A, an, the, zero article | Red |
| Prepositions | 🎯 | Time, place, movement prepositions | Yellow |
| Phrasal Verbs | 🚀 | Common phrasal verb patterns | Teal |
| Tricky Topics | 🤔 | Commonly confused grammar points | Gray |

**Topic Structure:**
- **Category ID:** Links to `grammar_categories` table
- **Title:** Grammar topic name (e.g., "Present Perfect")
- **Explanation:** Detailed grammar rule explanation
- **Examples:** JSON array of example sentences
- **Mini Text:** Short practice text using the grammar
- **Quiz:** Practice questions

**Key Tables:** `grammar_categories`, `grammar_topics`, `questions`, `question_options`

**Why Database-Driven?**
- Admin can add/edit categories without code changes
- Easy to reorganize content
- Supports internationalization
- Dynamic icon and color customization

---

### Feature 5: Quiz System
**Purpose:** Assess comprehension and reinforce learning

**How It Works:**
1. User completes content (reading/listening/grammar)
2. Quiz automatically available
3. User answers all questions
4. System calculates score
5. Results displayed with correct answers
6. Statistics updated automatically

**Question Types:**
- **Multiple Choice:** 4 options, single correct answer
- **Fill in the Blank:** Type the correct word (planned)
- **True/False:** Binary choice (planned)

**Quiz Structure:**
```
Content → Quiz Content → Questions → Question Options
                                   ↓
                          User Attempts
```

**Scoring:**
- Each question: 10 points (default)
- Total Score = Sum of correct answers
- Percentage = (Score / Max Score) × 100
- All attempts stored in database

**Key Tables:** `questions`, `question_options`, `user_question_attempts`

**Quiz Features:**
- Instant feedback
- Show correct answers after submission
- Track all attempts
- Calculate percentage score
- Link results to statistics

---

### Feature 6: My Words (Vocabulary Module) - 👑 PREMIUM ONLY
**Purpose:** Build and practice personal vocabulary collection

**How It Works:**
1. User reads content and finds unknown words
2. Clicks "Add to My Words" or manually adds word
3. Fills in word details (definition, examples, category)
4. Word saved to personal collection
5. User can practice with flashcards
6. Progress tracked in statistics

**Word Structure:**
- **Word:** The English word/phrase
- **Description:** Definition or translation
- **Example Sentences:** Array of usage examples
- **Source Type:** Where saved from (reading/listening/manual)
- **Source ID:** Link to original content
- **Category:** User-defined category
- **Created Date:** When added

**Category System:**
Users create custom categories:
- **Name:** Category title (e.g., "Business English", "Travel")
- **Color:** Hex color code for visual distinction
- **Icon:** Icon name for category
- **Order:** Custom sorting

**Flashcard Practice:**
- Random order presentation
- Flip animation (word ↔ definition)
- Track practice sessions
- Session statistics

**Access Control:**
- Feature completely locked for free users
- Upgrade prompt shown if not premium
- All word operations require premium status

**Key Tables:** `user_words`, `user_word_categories`

---

### Feature 7: Statistics & Progress Tracking
**Purpose:** Monitor learning progress and achievements

**Tracked Metrics:**
- Total reading texts completed
- Total listening lessons completed
- Total quizzes taken
- Total quiz score and average percentage
- Words added to vocabulary
- Flashcard practice session count
- Total usage days
- Most studied level (A1-C1)
- Last activity date

**How It Works:**
- Automatically updated after each activity
- Aggregated from multiple tables
- Displayed in visual dashboard
- Charts and graphs (planned)
- Level-wise breakdown

**Key Tables:** `user_statistics`, `user_question_attempts`

**Display Elements:**
- Stat cards with icons
- Progress bars
- Activity calendar (planned)
- Achievement badges (planned)
- Learning streaks (planned)

---

### Feature 8: Premium Subscription System
**Purpose:** Monetize platform through subscription model

**Business Model:** Freemium
- **Free Tier:** All grammar + limited content
- **Premium Tier:** Full access + exclusive features

**Pricing Plans:**
- **Monthly:** ₺50/month - Flexible billing
- **Yearly:** ₺400/year - Save 33% (₺33.33/month)

**Premium Features:**
1. **500+ Premium Content** - All reading and listening materials
2. **Advanced Statistics** - Detailed analytics
3. **My Words Feature** - Complete vocabulary management
4. **Ad-Free Experience** - No distractions (planned)
5. **Early Access** - New content 3 days early
6. **Priority Support** - Faster customer service
7. **Unlimited Practice** - No limits on usage

**Payment Integration:**
- **Provider:** Lemon Squeezy
- **Flow:** User → Plan Selection → Checkout → Payment → Webhook → Database Update
- **Storage:** Customer ID and Subscription ID stored in `profiles`

**Key Tables:** `profiles` (premium fields)

**Premium Check:**
```typescript
isPremium = is_premium === true && premium_expires_at > current_date
```

---

### Feature 9: Admin Panel (Content Management System)
**Purpose:** Manage all platform content and users

**Access:** Admin users only (requires `is_admin = true`)

**Admin Capabilities:**

#### Dashboard
- View platform statistics
- Total users count
- Premium users count
- Content counts by type
- Total quizzes taken
- Conversion rate

#### User Management (`/admin/users`)
- View all registered users
- Search by email/name
- See premium status and expiration
- Toggle premium for testing/support
- Delete user accounts
- View user details

#### Grammar Category Management (`/admin/grammar/categories`)
- Create new categories with:
  - Name and slug
  - Icon (emoji)
  - Color (hex code)
  - Description
  - Active status
- Edit existing categories
- Reorder categories (order_index)
- Toggle active/inactive
- Delete categories

#### Grammar Topic Management (`/admin/grammar`)
- Add new grammar topics
- Select category from dropdown
- Input title and explanation
- Add multiple examples (JSON array)
- Write mini practice text
- Set order index
- Edit existing topics
- Delete topics

#### Reading Content Management (`/admin/reading`)
- Add reading texts
- Select CEFR level (A1-C1)
- Input full text content
- Add audio URL
- Set premium/free status
- Set order index
- Edit existing content
- Delete reading texts

#### Listening Content Management (`/admin/listening`)
- Add audio lessons
- Upload/link audio file
- Add transcript
- Set duration
- Select level
- Set premium status
- Add description
- Edit content
- Delete lessons

**Key Tables:** All content tables + `profiles`

**Security Notes:**
- Currently no middleware (must implement before production)
- Should check `is_admin` flag on all admin routes
- Row Level Security policies needed
- Admin column added to `profiles` table

---

## 🗄️ Database Architecture

### Total Tables: **12 Tables**

### Relationships:

```
auth.users (Supabase Auth)
    ↓ (1:1)
profiles (User profiles with premium status)
    ↓ (1:many)
    ├─→ user_words (Vocabulary collection)
    ├─→ user_question_attempts (Quiz results)
    ├─→ user_statistics (Learning metrics)
    └─→ user_word_categories (Custom categories)

grammar_categories (Category definitions)
    ↓ (1:many)
grammar_topics (Grammar lessons)

reading_content (Reading texts)
    ↓ (1:many)
questions → question_options (Quiz questions)

listening_content (Audio lessons)
    ↓ (1:many)
questions → question_options (Quiz questions)
```

### Key Database Features:
- **UUID Primary Keys:** All tables use UUID for scalability
- **Timestamps:** created_at, updated_at on all tables
- **Foreign Keys:** Enforce referential integrity
- **RLS Policies:** Row Level Security for data protection
- **Indexes:** Performance optimization (order_index, user_id, etc.)
- **Check Constraints:** Level validation (A1-C1)
- **JSONB Fields:** Flexible data storage (examples, answers)

---

## 🔐 Security Architecture

### Authentication
- **Provider:** Supabase Auth
- **Method:** Email/Password (OAuth planned)
- **Sessions:** JWT tokens with automatic refresh
- **Storage:** HTTPOnly cookies

### Authorization
- **Row Level Security (RLS):** Enabled on all tables
- **User Data:** Users can only access their own data
- **Premium Content:** Checked at query level
- **Admin Access:** is_admin flag in profiles (middleware TODO)

### RLS Policy Examples:
```sql
-- Users can only see their own words
CREATE POLICY "Users can view own words"
ON user_words FOR SELECT
USING (auth.uid() = user_id);

-- Only premium users can access premium content
CREATE POLICY "Premium content for premium users"
ON reading_content FOR SELECT
USING (NOT is_premium OR is_premium_user(auth.uid()));
```

---

## 💻 Technology Stack Summary

### Frontend
- **Framework:** Next.js 16.0.1 (App Router, Server Components)
- **React:** 19.2.0 with React Compiler
- **Language:** TypeScript 5
- **Styling:** TailwindCSS 4
- **UI Components:** Radix UI + Shadcn/ui
- **State Management:** Zustand 5.0.8
- **Data Fetching:** TanStack React Query 5.90.5
- **Forms:** React Hook Form 7.65.0 + Zod validation
- **Audio:** Howler.js 2.2.4
- **Icons:** Lucide React
- **Notifications:** Sonner (toast)

### Backend
- **Database:** PostgreSQL (via Supabase)
- **Auth:** Supabase Auth
- **API:** Next.js API Routes
- **ORM:** Supabase Client (direct SQL)
- **Payments:** Lemon Squeezy

### Development
- **Package Manager:** npm
- **Linting:** ESLint 9
- **Type Checking:** TypeScript strict mode
- **Git:** Version control

---

## 📊 Data Flow Examples

### Example 1: User Takes Reading Quiz
```
1. User clicks "Start Reading" → reading_content record loaded
2. User reads text with audio player (Howler.js)
3. User clicks "Take Quiz" → questions + question_options loaded
4. User answers questions → answers stored in memory
5. User submits quiz → POST /api/quiz/submit
6. Server calculates score → creates user_question_attempts record
7. Server updates user_statistics (total_reading_completed++)
8. Client shows results with score percentage
9. User views correct answers
```

### Example 2: Premium User Adds Word
```
1. User reads content, finds unknown word
2. User clicks "Add to My Words" button
3. AddWordDialog opens with word pre-filled
4. User fills description, examples, selects category
5. User clicks "Save" → POST /api/words
6. Server checks isPremium status (required)
7. Server creates user_words record
8. Server updates user_statistics (total_words_added++)
9. Client shows success toast
10. Word appears in My Words page
```

### Example 3: Admin Creates Grammar Topic
```
1. Admin navigates to /admin/grammar
2. Clicks "Add Topic" button
3. AddGrammarDialog opens
4. Admin selects category from dropdown (fetches grammar_categories)
5. Fills title, explanation, examples array, mini_text
6. Sets order_index
7. Clicks "Create" → POST /api/admin/grammar
8. Server checks is_admin flag (should check, currently TODO)
9. Server creates grammar_topics record
10. Client refreshes list, shows new topic
11. Topic appears on front-end /grammar/[category] page
```

---

## 🎯 User Journeys

### Journey 1: New Free User
```
Landing Page → Register → Email Verification → 
Dashboard → Browse Grammar (Free) → 
Study Tenses → Take Quiz → See Results → 
Try Reading → Hit Premium Lock → 
View Premium Page → (Convert or Continue Free)
```

### Journey 2: Premium Subscriber
```
Login → Dashboard → Go to Reading/B2 → 
Select Text → Read + Listen → 
Add Unknown Words to My Words → 
Take Quiz → View Statistics → 
Practice Flashcards → Track Progress
```

### Journey 3: Admin Content Manager
```
Login as Admin → Admin Dashboard → 
View Statistics → Go to Grammar Categories → 
Create "Idioms" Category → 
Add Topics to Category → 
Test on Frontend → 
Publish
```

---

## 📁 Project File Structure

```
learn-quiz-english/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (admin)/                 # Admin layout group
│   │   │   ├── layout.tsx           # Admin-specific layout
│   │   │   └── admin/               # Admin pages
│   │   │       ├── page.tsx         # Dashboard
│   │   │       ├── users/           # User management
│   │   │       ├── grammar/         # Grammar admin
│   │   │       │   └── categories/  # Category management
│   │   │       ├── reading/         # Reading admin
│   │   │       └── listening/       # Listening admin
│   │   ├── (auth)/                  # Auth layout group
│   │   │   ├── login/               # Login page
│   │   │   └── register/            # Register page
│   │   ├── (main)/                  # Main app layout
│   │   │   ├── layout.tsx           # Main layout + sidebar
│   │   │   ├── page.tsx             # Dashboard
│   │   │   ├── reading/             # Reading module
│   │   │   │   ├── page.tsx         # Level selection
│   │   │   │   └── [level]/         # Dynamic level pages
│   │   │   ├── listening/           # Listening module
│   │   │   ├── grammar/             # Grammar module
│   │   │   │   ├── page.tsx         # Categories
│   │   │   │   └── [slug]/          # Category topics
│   │   │   ├── my-words/            # Vocabulary (Premium)
│   │   │   ├── statistics/          # Progress tracking
│   │   │   └── premium/             # Subscription page
│   │   ├── api/                     # API routes
│   │   │   ├── auth/                # Auth endpoints
│   │   │   ├── quiz/                # Quiz submission
│   │   │   ├── words/               # Word operations
│   │   │   ├── grammar/             # Grammar API
│   │   │   ├── reading/             # Reading API
│   │   │   ├── listening/           # Listening API
│   │   │   ├── create-checkout/     # Payment checkout
│   │   │   └── webhook/             # Payment webhook
│   │   ├── layout.tsx               # Root layout
│   │   └── globals.css              # Global styles
│   ├── features/                    # Feature modules (organized by domain)
│   │   ├── auth/                    # Authentication
│   │   │   ├── components/          # Login/Register forms
│   │   │   ├── hooks/               # useAuth, useProfile
│   │   │   ├── services/            # authService.ts
│   │   │   ├── store/               # Auth Zustand store
│   │   │   └── types/               # Auth types
│   │   ├── reading/                 # Reading module
│   │   │   ├── components/          # ReadingCard, LevelCard
│   │   │   ├── hooks/               # useReading hooks
│   │   │   ├── services/            # readingService.ts
│   │   │   ├── constants/           # Level definitions
│   │   │   └── types/               # Reading types
│   │   ├── listening/               # Listening module
│   │   ├── grammar/                 # Grammar module
│   │   │   ├── components/          # Grammar UI
│   │   │   ├── services/            # grammarService.ts
│   │   │   │                        # grammarCategoryService.ts
│   │   │   └── types/               # Grammar + Category types
│   │   ├── quiz/                    # Quiz system
│   │   ├── words/                   # Vocabulary (My Words)
│   │   ├── statistics/              # Progress tracking
│   │   ├── premium/                 # Subscription
│   │   └── admin/                   # Admin panel
│   ├── components/
│   │   └── ui/                      # Shadcn UI components
│   ├── shared/                      # Shared utilities
│   │   ├── components/              # Reusable components
│   │   ├── hooks/                   # Shared hooks
│   │   ├── lib/                     # Utilities
│   │   │   ├── supabase/            # Supabase clients
│   │   │   └── lemonsqueezy/        # Payment config
│   │   ├── providers/               # Context providers
│   │   ├── services/                # Base services
│   │   └── types/                   # Shared types
│   └── scripts/                     # Database scripts
│       ├── DB.sql                   # Complete schema
│       ├── seed-grammar-categories.ts
│       ├── seed-grammar.ts
│       └── seed-content.ts
├── public/                          # Static assets
├── .eslintrc.json
├── components.json                  # Shadcn config
├── next.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── README.md
├── README_PRD.md                    # Full PRD (this file)
└── README_DOC.md                    # Project documentation
```

---

## 🚀 Setup & Running

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Lemon Squeezy account (for payments)

### Installation
```bash
# 1. Clone and install
git clone <repo>
cd learn-quiz-english
npm install

# 2. Setup environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# 3. Setup database
# Execute DB.sql in Supabase SQL Editor

# 4. Seed data
npm run seed-grammar-categories
npm run seed-grammar
npm run seed-content

# 5. Run development server
npm run dev
# Open http://localhost:3000
```

### Build & Deploy
```bash
npm run build    # Build production bundle
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 📈 Success Metrics

### User Engagement
- Daily Active Users (DAU)
- Average session duration
- Content completion rate
- Quiz participation rate

### Business
- Free to Premium conversion rate (target: 5-10%)
- Monthly Recurring Revenue (MRR)
- Churn rate (target: <5%)

### Learning Outcomes
- Average quiz scores
- User progression through levels
- Content completion rates

---

## 🎯 Key Differentiators

1. **Free Grammar:** Unlike competitors, all grammar is permanently free
2. **Integrated Quizzes:** Every content piece has comprehension assessment
3. **CEFR-Based:** Content properly organized by international standards
4. **Premium Vocabulary:** Unique flashcard system for word building
5. **Progress Tracking:** Comprehensive statistics for motivation
6. **Audio Support:** All reading texts include audio for pronunciation
7. **Admin CMS:** Easy content management without code changes

---

## 🔮 Future Roadmap

### Phase 1 (Q1 2026)
- [ ] Dark mode support
- [ ] OAuth login (Google, GitHub)
- [ ] Password reset flow
- [ ] Bookmark system
- [ ] Learning streaks

### Phase 2 (Q2-Q3 2026)
- [ ] Speaking practice (voice recognition)
- [ ] Writing exercises (AI feedback)
- [ ] Mobile app (React Native)
- [ ] Social features (leaderboards)
- [ ] Adaptive difficulty

### Phase 3 (Q4 2026+)
- [ ] AI conversation practice
- [ ] Certificate programs
- [ ] Corporate training packages
- [ ] Multi-language support
- [ ] Native mobile apps

---

## 🤖 For AI Implementation

### What An AI Needs To Know

1. **This is a Next.js 16 App Router project** - Use server components where appropriate
2. **All data comes from Supabase** - PostgreSQL database with RLS
3. **Premium checks are critical** - Always verify `is_premium` for locked features
4. **Grammar is always free** - Never gate grammar content behind premium
5. **Categories are database-driven** - Don't hardcode grammar categories
6. **Admin needs auth** - Must implement `is_admin` middleware before production
7. **Quizzes link to content** - Use proper foreign key relationships
8. **Statistics auto-update** - Trigger updates after each user action
9. **Mobile responsive** - All components must work on mobile
10. **TypeScript strict** - Maintain type safety throughout

### Design Patterns Used
- Feature-based folder structure
- Custom hooks for data fetching (React Query)
- Service layer for API calls
- Zustand for global state
- Radix UI primitives for accessibility
- Server components for better performance
- API routes for backend logic

---

## 📞 Additional Resources

- **README_PRD.md:** Complete Product Requirements Document
- **ADMIN_PANEL_README.md:** Admin feature documentation
- **GRAMMAR_CATEGORIES_IMPLEMENTATION.md:** Grammar system details
- **DB.sql:** Complete database schema

---

**End of Documentation**

This document provides a comprehensive overview of the Learn&Quiz English platform, designed to give any AI or developer a complete understanding of the project's structure, functionality, and implementation details.


# Color Palett
| Role                   | Color     | HEX                                                  | 
| ---------------------- | --------- | ---------------------------------------------------- | 
| **Primary**            | `#7C3AED` | Bright purple – main accent color                    |             
| **Secondary**          | `#A78BFA` | Light lavender – secondary support color             |             
| **Accent**             | `#C084FC` | Glowing lilac tone – used for highlights and accents |             
| **Background (Light)** | `#F5F3FF` | Soft light purple background                         |             
| **Background (Dark)**  | `#1E1B4B` | Deep purple – for dark mode                          |             
| **Surface / Card**     | `#EDE9FE` | Light grayish-purple surface color                   |             
| **Text Primary**       | `#1E1E1E` | Dark gray – for light backgrounds                    |             
| **Text On Dark**       | `#FAFAFA` | White – for dark backgrounds                         |             
| **Success**            | `#10B981` | Greenish accent (used for success states)            |             
| **Error**              | `#EF4444` | Red (used for error alerts)                          |             
| **Warning**            | `#F59E0B` | Amber – used for warnings or cautionary messages     |             
| **Info**               | `#3B82F6` | Bright blue – used for informational messages        |             
| **Neutral**            | `#6B7280` | Medium gray – used for neutral or system states      |             

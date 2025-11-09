# Learn&Quiz English - Product Requirements Document (PRD)

**Version:** 1.0  
**Last Updated:** November 9, 2025  
**Project Type:** Educational Web Platform  
**Tech Stack:** Next.js 16, React 19, TypeScript, Supabase, TailwindCSS

---

## 📋 Executive Summary

Learn&Quiz English is an interactive, comprehensive English learning platform designed to help learners improve their English skills across multiple dimensions: reading, listening, grammar, and vocabulary. The platform provides content for all CEFR levels (A1 to C1) with an integrated quiz system, premium subscription model, and personalized learning tracking.

---

## 🎯 Product Vision & Goals

### Vision
To create an accessible, engaging, and effective English learning platform that adapts to learners at every proficiency level, making quality English education available to everyone.

### Core Goals
1. **Accessibility:** Provide free grammar content to all users, with premium content for enhanced learning
2. **Comprehensive Learning:** Cover all essential English learning areas (reading, listening, grammar, vocabulary)
3. **Progress Tracking:** Enable users to track their learning progress and performance
4. **Engagement:** Create an interactive experience with quizzes, flashcards, and gamification elements
5. **Monetization:** Offer premium subscriptions for advanced features and exclusive content

---

## 👥 Target Audience

### Primary Users
- **English Learners (A1-C1 levels):** Students, professionals, and self-learners seeking to improve English proficiency
- **Age Range:** 15-45 years old
- **Geography:** Global, with specific focus on Turkish market (based on pricing in ₺)
- **Motivation:** Career advancement, academic requirements, personal development, or travel preparation

### Secondary Users
- **Educators:** Teachers looking for supplementary materials for their students
- **Content Creators:** Admin users managing the platform content

---

## 🏗️ System Architecture

### Technology Stack

#### Frontend
- **Framework:** Next.js 16.0.1 (App Router)
- **UI Library:** React 19.2.0
- **Language:** TypeScript 5
- **Styling:** TailwindCSS 4 with Radix UI components
- **State Management:** Zustand 5.0.8
- **Data Fetching:** TanStack React Query 5.90.5
- **Forms:** React Hook Form 7.65.0 + Zod 4.1.12

#### Backend
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (@supabase/auth-helpers-nextjs)
- **API:** Next.js API Routes
- **Payment Processing:** Lemon Squeezy (@lemonsqueezy/lemonsqueezy.js)
- **Audio Playback:** Howler.js 2.2.4

#### Development Tools
- **Package Manager:** npm
- **Linting:** ESLint 9 with Next.js config
- **Runtime:** Node.js (via ts-node for scripts)

---

## 📊 Database Schema

### Core Tables

#### 1. **profiles**
```sql
- id: uuid (PK, FK to auth.users)
- email: text (UNIQUE, NOT NULL)
- full_name: text
- is_premium: boolean (DEFAULT false)
- premium_expires_at: timestamp
- lemon_squeezy_customer_id: text
- lemon_squeezy_subscription_id: text
- created_at: timestamp
- updated_at: timestamp
```

#### 2. **reading_content**
```sql
- id: uuid (PK)
- title: text (NOT NULL)
- level: text (A1|A2|B1|B2|C1)
- content: text (NOT NULL)
- audio_url: text (NOT NULL)
- is_premium: boolean (DEFAULT false)
- order_index: integer
- content_id: uuid (FK to quiz_content)
- created_at: timestamp
- updated_at: timestamp
```

#### 3. **listening_content**
```sql
- id: uuid (PK)
- title: text (NOT NULL)
- level: text (A1|A2|B1|B2|C1)
- description: text
- audio_url: text (NOT NULL)
- duration_seconds: integer
- transcript: text
- is_premium: boolean (DEFAULT false)
- order_index: integer
- content_id: uuid (FK to quiz_content)
- created_at: timestamp
- updated_at: timestamp
```

#### 4. **grammar_topics**
```sql
- id: uuid (PK)
- category_id: uuid (FK to grammar_categories)
- title: text (NOT NULL)
- explanation: text (NOT NULL)
- examples: jsonb (NOT NULL)
- mini_text: text (NOT NULL)
- order_index: integer
- content_id: uuid (FK to quiz_content)
- created_at: timestamp
- updated_at: timestamp
```

#### 5. **grammar_categories**
```sql
- id: uuid (PK)
- name: text (NOT NULL)
- slug: text (UNIQUE, NOT NULL)
- description: text
- icon: text (emoji)
- color: text (hex color)
- is_active: boolean (DEFAULT true)
- order_index: integer
- created_at: timestamp
- updated_at: timestamp
```

#### 6. **quiz_content**
```sql
- id: uuid (PK)
- content_id: uuid (NOT NULL)
- title: text (NOT NULL)
- created_at: timestamp
- updated_at: timestamp
```

#### 7. **questions**
```sql
- id: uuid (PK)
- content_id: uuid (FK to quiz_content)
- text: text (NOT NULL)
- points: integer (DEFAULT 10)
- created_at: timestamp
```

#### 8. **question_options**
```sql
- id: uuid (PK)
- question_id: uuid (FK to questions)
- text: text (NOT NULL)
- is_correct: boolean (DEFAULT false)
- created_at: timestamp
```

#### 9. **user_question_attempts**
```sql
- id: uuid (PK)
- user_id: uuid (FK to profiles)
- content_id: uuid (FK to quiz_content)
- answers: jsonb (NOT NULL)
- score: integer (NOT NULL)
- max_score: integer (NOT NULL)
- percentage: numeric
- completed_at: timestamp
```

#### 10. **user_statistics**
```sql
- user_id: uuid (PK, FK to profiles)
- total_reading_completed: integer (DEFAULT 0)
- total_listening_completed: integer (DEFAULT 0)
- total_quizzes_completed: integer (DEFAULT 0)
- total_quiz_score: integer (DEFAULT 0)
- total_words_added: integer (DEFAULT 0)
- flashcard_practice_count: integer (DEFAULT 0)
- total_usage_days: integer (DEFAULT 0)
- last_activity_date: date
- most_studied_level: text
- updated_at: timestamp
```

#### 11. **user_words**
```sql
- id: uuid (PK)
- user_id: uuid (FK to auth.users)
- word: text (NOT NULL)
- source_type: text
- source_id: uuid
- category_id: uuid (FK to user_word_categories)
- description: text
- example_sentences: text[]
- created_at: timestamp
- updated_at: timestamp
```

#### 12. **user_word_categories**
```sql
- id: uuid (PK)
- user_id: uuid (FK to auth.users)
- name: text (NOT NULL)
- color: text (DEFAULT '#3b82f6')
- icon: text (DEFAULT 'folder')
- order_index: integer (DEFAULT 0)
- created_at: timestamp
- updated_at: timestamp
```

---

## 🎨 Feature Specifications

### 1. **Authentication & User Management**

#### Feature Overview
Secure user authentication system with profile management and premium status tracking.

#### User Stories
- As a new user, I want to register with email/password so I can access the platform
- As a returning user, I want to log in to access my learning progress
- As a user, I want to see my premium status and expiration date
- As a user, I want to sign out securely

#### Technical Implementation
- **Location:** `src/features/auth/`
- **Components:**
  - `LoginForm` - Email/password login interface
  - `RegisterForm` - New user registration
  - `AuthProvider` - Global authentication context
- **Services:** `authService.ts` - Handles Supabase auth operations
- **Store:** Zustand store for auth state management
- **Types:**
  - `User` - Core user interface
  - `Profile` - Extended user profile with premium info
  - `SignInCredentials` - Login credentials
  - `SignUpCredentials` - Registration data

#### Security Features
- Supabase Row Level Security (RLS) policies
- JWT-based session management
- Secure password reset flow
- Protected routes via middleware

---

### 2. **Reading Practice Module**

#### Feature Overview
Extensive collection of reading texts across all CEFR levels (A1-C1) with integrated quizzes and audio support.

#### User Stories
- As a learner, I want to select my proficiency level to find appropriate content
- As a learner, I want to read texts with audio support to improve pronunciation
- As a learner, I want to take quizzes after reading to test comprehension
- As a premium user, I want access to exclusive reading materials

#### CEFR Level Structure
- **A1 (Beginner):** Simple texts, basic vocabulary, 100-150 words
- **A2 (Elementary):** Everyday topics, 150-250 words
- **B1 (Intermediate):** Standard texts, varied topics, 250-400 words
- **B2 (Upper Intermediate):** Complex topics, 400-600 words
- **C1 (Advanced):** Academic/professional texts, 600+ words

#### Technical Implementation
- **Location:** `src/features/reading/`
- **Routes:**
  - `/reading` - Level selection page
  - `/reading/[level]` - Content list for specific level
  - `/reading/[level]/[id]` - Individual reading text with quiz
- **Components:**
  - `LevelCard` - CEFR level selection cards
  - `ReadingCard` - Individual reading content preview
  - `ReadingDetail` - Full text view with audio player
  - `ReadingQuiz` - Comprehension quiz interface
- **Services:** `readingService.ts` - CRUD operations for reading content
- **Types:**
  - `ReadingContent` - Content structure
  - `ReadingFilters` - Filter parameters
  - `ReadingStats` - User reading statistics

#### Content Features
- Audio playback with Howler.js
- Text highlighting for vocabulary building
- Progress tracking
- Premium/Free content distinction
- Bookmark functionality (planned)

---

### 3. **Listening Practice Module**

#### Feature Overview
Audio-based learning content with transcripts and comprehension exercises for all proficiency levels.

#### User Stories
- As a learner, I want to listen to authentic English audio at my level
- As a learner, I want to see transcripts to verify understanding
- As a learner, I want to practice with listening comprehension quizzes
- As a premium user, I want access to extended audio content

#### Technical Implementation
- **Location:** `src/features/listening/`
- **Routes:**
  - `/listening` - Level selection
  - `/listening/[level]` - Audio lessons by level
  - `/listening/[level]/[id]` - Audio player with transcript
- **Components:**
  - `ListeningCard` - Audio lesson preview
  - `AudioPlayer` - Custom audio control interface
  - `TranscriptViewer` - Synchronized transcript display
  - `ListeningQuiz` - Comprehension assessment
- **Services:** `listeningService.ts` - Manages listening content
- **Types:**
  - `ListeningExercise` - Audio lesson structure
  - `ListeningQuestion` - Quiz question format

#### Audio Features
- Play/pause/rewind controls
- Speed adjustment (0.75x, 1x, 1.25x, 1.5x)
- Duration display
- Transcript synchronization (planned)
- Progress indicator

---

### 4. **Grammar Practice Module** 🆓

#### Feature Overview
**100% FREE for all users.** Comprehensive grammar instruction organized by categories with explanations, examples, and practice exercises.

#### Philosophy
Grammar is considered essential for English learning, therefore all grammar content is permanently free for everyone.

#### Grammar Categories (Dynamic, Database-Driven)
1. **Tenses (⏰)** - Present, past, future, and perfect tenses
2. **Modals (🔑)** - Modal verbs and their uses
3. **Conditionals (🔀)** - If-clauses and conditional sentences
4. **Passive Voice (🔄)** - Active to passive transformations
5. **Reported Speech (💬)** - Direct and indirect speech
6. **Articles (📰)** - A, an, the, zero article
7. **Prepositions (🎯)** - Time, place, movement prepositions
8. **Phrasal Verbs (🚀)** - Common phrasal verb patterns
9. **Tricky Topics (🤔)** - Commonly confused grammar points

#### User Stories
- As a learner, I want to browse grammar topics by category
- As a learner, I want clear explanations with multiple examples
- As a learner, I want to practice with exercises after each topic
- As a learner, I want to track my grammar quiz scores

#### Technical Implementation
- **Location:** `src/features/grammar/`
- **Routes:**
  - `/grammar` - Category selection
  - `/grammar/[category-slug]` - Topics within category
  - `/grammar/[category-slug]/[topic-id]` - Grammar lesson detail
- **Components:**
  - `GrammarCategoryCard` - Category display with icon/color
  - `GrammarTopicCard` - Individual topic preview
  - `GrammarLesson` - Full explanation view
  - `GrammarExercise` - Practice quiz
- **Services:**
  - `grammarService.ts` - Grammar content operations
  - `grammarCategoryService.ts` - Category management
- **Types:**
  - `GrammarCategory` - Category structure (DB-driven)
  - `GrammarTopic` - Topic with explanation and examples
  - `GrammarExercise` - Practice question format
  - `GrammarStats` - User grammar progress

#### Content Structure
Each grammar topic includes:
- **Title:** Clear topic name
- **Explanation:** Detailed grammar rule description
- **Examples:** Multiple example sentences (stored as JSON)
- **Mini Text:** Short practice text using the grammar point
- **Quiz:** 5-10 comprehension/application questions
- **Order Index:** For logical topic sequencing

---

### 5. **Quiz System**

#### Feature Overview
Integrated quiz engine supporting multiple question types with instant feedback and score tracking.

#### Question Types
1. **Multiple Choice:** 4 options, single correct answer
2. **Fill in the Blank:** Type the correct word/phrase
3. **True/False:** Binary choice questions

#### User Stories
- As a learner, I want to take quizzes after each content piece
- As a learner, I want instant feedback on my answers
- As a learner, I want to see my score and percentage
- As a learner, I want to review incorrect answers

#### Technical Implementation
- **Location:** `src/features/quiz/`
- **Components:**
  - `QuizContainer` - Main quiz interface
  - `QuestionCard` - Individual question display
  - `QuizResults` - Score summary and review
  - `AnswerFeedback` - Correct/incorrect indicator
- **Services:** `quizService.ts` - Quiz submission and scoring
- **Utilities:**
  - `calculateScore` - Scoring algorithm
  - `shuffleQuestions` - Randomize question order
  - `validateAnswers` - Answer checking logic
- **Types:**
  - `QuizQuestion` - Question structure
  - `QuizOption` - Answer option
  - `QuizSubmission` - User answer submission
  - `QuizResult` - Score and feedback
  - `UserAnswer` - User's selected answer

#### Quiz Flow
1. User completes content (reading/listening/grammar)
2. Quiz becomes available
3. User answers all questions
4. System calculates score
5. Results displayed with correct answers
6. Statistics updated in database

#### Scoring System
- Each question worth 10 points (default)
- Total score calculated as sum of correct answers
- Percentage = (user_score / max_score) × 100
- Results stored in `user_question_attempts`

---

### 6. **My Words (Vocabulary Module)** 👑 Premium

#### Feature Overview
Personal vocabulary builder with categorization, flashcards, and spaced repetition practice.

#### User Stories
- As a premium user, I want to save words while reading
- As a premium user, I want to organize words into custom categories
- As a premium user, I want to practice with flashcards
- As a premium user, I want to track my vocabulary growth

#### Technical Implementation
- **Location:** `src/features/words/`
- **Route:** `/my-words`
- **Components:**
  - `WordCard` - Individual word display
  - `AddWordDialog` - Manual word addition
  - `FlashcardPractice` - Flashcard review mode
  - `CategoryManager` - Category CRUD interface
  - `WordCategorySelector` - Assign words to categories
- **Services:** `wordsService.ts` - Word and category operations
- **Store:** Zustand store for word state
- **Types:**
  - `UserWord` - Word structure with metadata
  - `WordCategory` - Custom category

#### Word Structure
- **Word:** The English word/phrase
- **Description:** Definition or translation
- **Example Sentences:** Array of usage examples
- **Source Type:** Where word was saved from (reading/listening/manual)
- **Source ID:** Reference to original content
- **Category:** User-defined category
- **Created Date:** When added

#### Category Features
- Custom category names
- Color coding (hex colors)
- Icon support
- Drag-and-drop reordering
- Category-based filtering

#### Flashcard Practice
- Random order presentation
- Flip animation (word ↔ definition)
- Progress tracking
- Session statistics

#### Access Control
- **Premium Only:** Entire feature locked for free users
- Upgrade prompt for non-premium users
- Premium status checked on route access

---

### 7. **Statistics & Progress Tracking**

#### Feature Overview
Comprehensive learning analytics showing user progress across all platform features.

#### Tracked Metrics
- Total reading texts completed
- Total listening lessons completed
- Total quizzes taken
- Total quiz score and average
- Words added to vocabulary
- Flashcard practice sessions
- Total usage days
- Most studied level
- Last activity date

#### User Stories
- As a learner, I want to see my overall progress
- As a learner, I want to track my quiz performance over time
- As a learner, I want to identify my most studied areas
- As a premium user, I want detailed analytics and charts

#### Technical Implementation
- **Location:** `src/features/statistics/`
- **Route:** `/statistics`
- **Components:**
  - `StatsOverview` - Key metrics dashboard
  - `ProgressChart` - Visual progress representation
  - `ActivityCalendar` - Daily activity heatmap
  - `LevelBreakdown` - Performance by CEFR level
- **Services:** `statisticsService.ts` - Statistics calculations
- **Types:**
  - `UserStatistics` - Core stats structure
  - `GrammarStats` - Grammar-specific metrics
  - `ReadingStats` - Reading progress
  - `QuizStats` - Quiz performance data

#### Statistics Display
- **Cards:** Total counts with icons
- **Charts:** Line/bar charts for trends
- **Badges:** Achievement indicators
- **Streaks:** Consecutive day tracking (planned)

---

### 8. **Premium Subscription System** 💎

#### Feature Overview
Freemium business model with Lemon Squeezy payment integration for premium subscriptions.

#### Pricing Plans
- **Monthly:** ₺50/month - Flexible billing
- **Yearly:** ₺400/year - Save 33% (₺33.33/month effective)

#### Premium Features
1. **500+ Premium Content** - Access all reading and listening materials
2. **Advanced Statistics** - Detailed analytics and progress charts
3. **My Words Feature** - Complete vocabulary management
4. **Ad-Free Experience** - No distractions
5. **Early Access** - New content 3 days before free users
6. **Priority Support** - Faster customer service
7. **Unlimited Practice** - No limits on quizzes or flashcards

#### Free User Access
- All grammar content (100% free)
- Limited reading content (basic level texts)
- Limited listening content
- Basic statistics
- Quiz functionality

#### Technical Implementation
- **Location:** `src/features/premium/`
- **Route:** `/premium`
- **Payment Provider:** Lemon Squeezy
- **API Routes:**
  - `/api/create-checkout` - Create payment session
  - `/api/webhook` - Handle subscription events
- **Components:**
  - `PricingCard` - Plan display
  - `UpgradePrompt` - Premium upsell
  - `SubscriptionStatus` - Current plan display
- **Services:** `premiumService.ts` - Subscription management
- **Store:** Zustand store for premium state

#### Subscription Flow
1. User clicks "Upgrade to Premium"
2. Selects plan (monthly/yearly)
3. Redirected to Lemon Squeezy checkout
4. Completes payment
5. Webhook updates database
6. User profile marked as premium
7. Premium features unlocked

#### Premium Check Logic
```typescript
const isPremium = profile?.is_premium && 
  profile?.premium_expires_at && 
  new Date(profile.premium_expires_at) > new Date()
```

---

### 9. **Admin Panel** 🔐

#### Feature Overview
Comprehensive content management system for platform administrators to manage users, content, and settings.

#### Access Control
⚠️ **IMPORTANT:** Currently no authentication middleware. Must implement admin role checking before production.

#### Admin Routes
- `/admin` - Dashboard with platform statistics
- `/admin/users` - User management
- `/admin/grammar` - Grammar content management
- `/admin/grammar/categories` - Grammar category management
- `/admin/reading` - Reading content management
- `/admin/listening` - Listening content management

#### Dashboard Statistics
- Total users count
- Premium users count
- Reading content count
- Listening content count
- Grammar topics count
- Total quizzes taken
- Premium conversion rate

#### User Management Features
- View all registered users
- Search by email/name
- See premium status and expiration
- Toggle premium status (for testing/support)
- View user details
- Delete user accounts

#### Grammar Management
**Category Management:**
- Create new grammar categories
- Edit category (name, slug, icon, color, description)
- Toggle category active status
- Reorder categories
- Delete categories (with cascade protection)

**Topic Management:**
- Add new grammar topics
- Select category from dropdown
- Edit topic details
- Set order index
- Include explanation and examples
- Link to quiz content
- Delete topics

#### Reading Content Management
- Add new reading texts
- Select CEFR level
- Input text content
- Add audio URL
- Set premium/free status
- Set order index
- Edit existing content
- Delete reading texts

#### Listening Content Management
- Add audio lessons
- Upload/link audio file
- Add transcript
- Set duration
- Select level
- Premium access control
- Edit content
- Delete lessons

#### Technical Implementation
- **Location:** `src/features/admin/`
- **Layout:** Dedicated admin layout with sidebar navigation
- **Components:**
  - `AdminSidebar` - Navigation menu
  - `StatsCard` - Metric display cards
  - `UserTable` - Sortable user list
  - `AddGrammarDialog` - Grammar topic form
  - `AddGrammarCategoryDialog` - Category creation
  - `EditGrammarDialog` - Topic editing
  - `EditGrammarCategoryDialog` - Category editing
  - `AddReadingDialog` - Reading content form
  - `AddListeningDialog` - Listening content form
- **Hooks:**
  - `useAdminStats` - Dashboard metrics
  - `useUsers` - User management operations
  - `useGrammarCategories` - Category CRUD
  - `useAdminGrammar` - Grammar content operations
  - `useAdminReading` - Reading content operations
  - `useAdminListening` - Listening content operations

#### Security TODO
```typescript
// 1. Add admin column to profiles
ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;

// 2. Create middleware for admin routes
// 3. Check is_admin flag before allowing access
// 4. Apply to /admin/* routes
```

---

## 🎨 Design System

### UI Framework
- **Base:** Radix UI primitives for accessibility
- **Styling:** TailwindCSS 4 for utility-first design
- **Components:** Shadcn/ui component library
- **Icons:** Lucide React
- **Theme:** Light mode (dark mode support planned)

### Component Library
All UI components located in `src/components/ui/`:

#### Core Components
- **Button** - Primary, secondary, outline, ghost variants
- **Card** - Container with header, content, footer sections
- **Input** - Text input with validation states
- **Label** - Form labels with accessibility
- **Select** - Dropdown selection
- **Dialog** - Modal dialogs
- **Alert Dialog** - Confirmation dialogs
- **Dropdown Menu** - Context menus
- **Tabs** - Tabbed interfaces
- **Badge** - Status indicators
- **Avatar** - User profile pictures
- **Progress** - Progress bars
- **Slider** - Range input
- **Checkbox** - Binary selection
- **Textarea** - Multi-line text input
- **Table** - Data tables
- **Separator** - Visual dividers
- **Skeleton** - Loading placeholders
- **Alert** - Notification banners
- **Header** - Global navigation header

### Design Tokens

#### Colors
- **Primary:** Blue gradient (from-blue-600 to-purple-600)
- **Premium:** Gold gradient (from-yellow-400 to-orange-500)
- **Success:** Green (text-green-600)
- **Error:** Red (text-red-600)
- **Muted:** Gray (text-muted-foreground)

#### Typography
- **Font Family:** Inter (sans-serif)
- **Headings:** Bold, various sizes (text-4xl, text-3xl, text-2xl)
- **Body:** Regular weight, responsive sizing
- **Monospace:** For code snippets (planned)

#### Spacing
- **Container:** max-w-7xl, px-4, py-8
- **Grid Gaps:** gap-4, gap-6, gap-8
- **Card Padding:** p-4, p-6, p-8

#### Responsive Breakpoints
- **sm:** 640px
- **md:** 768px
- **lg:** 1024px
- **xl:** 1280px
- **2xl:** 1536px

---

## 🔄 User Flows

### 1. New User Onboarding
```
Landing Page → Register → Email Verification → 
Profile Setup → Level Assessment (planned) → 
Dashboard → Feature Tour
```

### 2. Content Learning Flow
```
Select Feature (Reading/Listening/Grammar) → 
Choose Level/Category → Select Content → 
Study Content (with audio if available) → 
Take Quiz → View Results → Save Words (premium) → 
Return to Dashboard
```

### 3. Premium Upgrade Flow
```
Discover Premium Content (locked) → 
Click Premium Badge → Premium Page → 
Select Plan → Checkout (Lemon Squeezy) → 
Payment → Webhook Updates Profile → 
Premium Unlocked
```

### 4. Vocabulary Building Flow (Premium)
```
Read Content → Highlight Unknown Word → 
Click "Add to My Words" → Fill Word Details → 
Select Category → Save → 
Practice with Flashcards → Track Progress
```

### 5. Admin Content Management
```
Admin Login → Dashboard → 
Select Content Type → 
View Content List → Add New / Edit Existing → 
Fill Form → Preview (planned) → 
Publish → View Live
```

---

## 🔐 Security & Authentication

### Authentication Strategy
- **Provider:** Supabase Auth
- **Method:** Email/Password (OAuth planned)
- **Session:** JWT tokens with automatic refresh
- **Storage:** HTTPOnly cookies for security

### Row Level Security (RLS)
Supabase RLS policies enforce data access:

1. **Profiles:** Users can only read/update own profile
2. **User Words:** Users can only access own words
3. **User Statistics:** Users can only view own stats
4. **Content:** Public read, admin write
5. **Quiz Attempts:** Users can only see own attempts

### Protected Routes
- `/my-words` - Premium users only
- `/admin/*` - Admin users only (TODO: implement)
- `/statistics` - Authenticated users

### API Security
- All API routes validate authentication
- Webhook signatures verified (Lemon Squeezy)
- CORS properly configured
- Rate limiting (planned)

---

## 🚀 Deployment & Setup

### Environment Variables
Required environment variables (`.env.local`):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Lemon Squeezy
LEMON_SQUEEZY_API_KEY=your_lemon_squeezy_api_key
LEMON_SQUEEZY_STORE_ID=your_store_id
LEMON_SQUEEZY_WEBHOOK_SECRET=your_webhook_secret

# Plans
NEXT_PUBLIC_LEMON_SQUEEZY_MONTHLY_PLAN_ID=plan_id
NEXT_PUBLIC_LEMON_SQUEEZY_YEARLY_PLAN_ID=plan_id

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Installation Steps

1. **Clone Repository**
```bash
git clone <repository-url>
cd learn-quiz-english
```

2. **Install Dependencies**
```bash
npm install
```

3. **Setup Database**
```bash
# Execute SQL files in Supabase SQL Editor
# 1. create_database_tables.sql
# 2. create_grammar_categories_table.sql
# 3. setup_rls_policies.sql
# 4. performance_indexes.sql
```

4. **Seed Initial Data**
```bash
# Seed grammar categories
npm run seed-grammar-categories

# Seed grammar content (optional)
npm run seed-grammar

# Seed reading/listening content (optional)
npm run seed-content
```

5. **Configure Environment**
```bash
# Create .env.local and add variables
cp .env.example .env.local
# Edit .env.local with your credentials
```

6. **Run Development Server**
```bash
npm run dev
# Open http://localhost:3000
```

### Build & Production

```bash
# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

### Database Scripts
- `setup-db` - Initialize database schema
- `seed-content` - Seed sample content
- `seed-grammar` - Seed grammar topics
- `seed-grammar-categories` - Seed grammar categories

---

## 📱 Responsive Design

### Mobile-First Approach
The platform is fully responsive with mobile-first design:

- **Mobile (< 768px):** Single column, touch-friendly buttons, simplified navigation
- **Tablet (768px - 1024px):** Two-column grids, collapsible sidebar
- **Desktop (> 1024px):** Full sidebar, multi-column layouts, hover interactions

### Key Responsive Features
- Collapsible sidebar on mobile
- Responsive grid layouts
- Touch-friendly UI elements
- Adaptive font sizes
- Mobile-optimized audio player
- Swipe gestures for flashcards (planned)

---

## 🔮 Future Enhancements

### Planned Features

#### Short-term (3-6 months)
- [ ] Dark mode support
- [ ] OAuth authentication (Google, GitHub)
- [ ] Content bookmark system
- [ ] Learning streaks and badges
- [ ] Email notifications
- [ ] Password reset flow
- [ ] User profile customization
- [ ] Content search functionality

#### Medium-term (6-12 months)
- [ ] Speaking practice with voice recognition
- [ ] Writing exercises with AI feedback
- [ ] Personalized learning paths
- [ ] Adaptive difficulty system
- [ ] Social features (friends, leaderboards)
- [ ] Mobile app (React Native)
- [ ] Offline mode
- [ ] Content recommendation engine

#### Long-term (12+ months)
- [ ] AI-powered conversation practice
- [ ] Live tutoring integration
- [ ] Certificate programs
- [ ] Corporate training packages
- [ ] Multi-language support
- [ ] Native mobile apps (iOS/Android)
- [ ] API for third-party integrations
- [ ] White-label solution for institutions

### Technical Debt
- [ ] Implement admin authentication middleware
- [ ] Add comprehensive error boundaries
- [ ] Improve accessibility (WCAG AA compliance)
- [ ] Add E2E testing (Playwright/Cypress)
- [ ] Add unit tests (Jest/Vitest)
- [ ] Optimize image loading (Next.js Image)
- [ ] Implement CDN for media files
- [ ] Add performance monitoring
- [ ] SEO optimization
- [ ] Add rate limiting

---

## 📊 Success Metrics (KPIs)

### User Engagement
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Average session duration
- Content completion rate
- Quiz participation rate
- Flashcard practice frequency

### Business Metrics
- Free to Premium conversion rate
- Monthly Recurring Revenue (MRR)
- Customer Lifetime Value (CLV)
- Churn rate
- Premium subscriber growth

### Learning Outcomes
- Average quiz scores by level
- Content completion by category
- User progression through levels
- Word retention rate
- Time to proficiency improvement

---

## 🏗️ Project Structure

```
learn-quiz-english/
├── public/                          # Static assets
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── (admin)/                # Admin layout group
│   │   │   ├── layout.tsx          # Admin layout
│   │   │   └── admin/              # Admin pages
│   │   │       ├── page.tsx        # Dashboard
│   │   │       ├── users/          # User management
│   │   │       ├── grammar/        # Grammar admin
│   │   │       ├── reading/        # Reading admin
│   │   │       └── listening/      # Listening admin
│   │   ├── (auth)/                 # Auth layout group
│   │   │   ├── login/              # Login page
│   │   │   └── register/           # Register page
│   │   ├── (main)/                 # Main app layout group
│   │   │   ├── layout.tsx          # Main layout with sidebar
│   │   │   ├── page.tsx            # Home/Dashboard
│   │   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   │   ├── reading/            # Reading pages
│   │   │   ├── listening/          # Listening pages
│   │   │   ├── grammar/            # Grammar pages
│   │   │   ├── my-words/           # Vocabulary page
│   │   │   ├── premium/            # Premium page
│   │   │   └── statistics/         # Statistics page
│   │   ├── api/                    # API routes
│   │   │   ├── auth/               # Auth endpoints
│   │   │   ├── quiz/               # Quiz endpoints
│   │   │   ├── words/              # Word endpoints
│   │   │   ├── create-checkout/    # Payment checkout
│   │   │   └── webhook/            # Payment webhook
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Landing page
│   │   └── globals.css             # Global styles
│   ├── components/
│   │   └── ui/                     # Shadcn UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── dialog.tsx
│   │       ├── header.tsx
│   │       └── ...
│   ├── features/                   # Feature modules
│   │   ├── admin/                  # Admin feature
│   │   │   ├── components/         # Admin UI components
│   │   │   └── hooks/              # Admin React hooks
│   │   ├── auth/                   # Authentication
│   │   │   ├── components/         # Auth UI
│   │   │   ├── hooks/              # Auth hooks
│   │   │   ├── services/           # Auth service
│   │   │   ├── store/              # Auth state
│   │   │   └── types/              # Auth types
│   │   ├── grammar/                # Grammar feature
│   │   │   ├── api/                # Grammar API calls
│   │   │   ├── components/         # Grammar UI
│   │   │   ├── hooks/              # Grammar hooks
│   │   │   ├── services/           # Grammar service
│   │   │   └── types/              # Grammar types
│   │   ├── listening/              # Listening feature
│   │   ├── premium/                # Premium feature
│   │   ├── quiz/                   # Quiz system
│   │   ├── reading/                # Reading feature
│   │   ├── statistics/             # Statistics
│   │   └── words/                  # Vocabulary
│   ├── shared/                     # Shared code
│   │   ├── components/             # Shared components
│   │   ├── hooks/                  # Shared hooks
│   │   ├── lib/                    # Utilities
│   │   │   ├── supabase/           # Supabase clients
│   │   │   └── lemonsqueezy/       # Payment config
│   │   ├── providers/              # Context providers
│   │   ├── services/               # Base services
│   │   └── types/                  # Shared types
│   └── scripts/                    # Database scripts
│       ├── create_database_tables.sql
│       ├── create_grammar_categories_table.sql
│       ├── setup_rls_policies.sql
│       ├── seed-grammar-categories.ts
│       ├── seed-grammar.ts
│       └── seed-content.ts
├── .eslintrc.json                  # ESLint config
├── components.json                 # Shadcn config
├── next.config.ts                  # Next.js config
├── package.json                    # Dependencies
├── postcss.config.mjs              # PostCSS config
├── tailwind.config.ts              # Tailwind config
├── tsconfig.json                   # TypeScript config
├── README.md                       # Project readme
├── ADMIN_PANEL_README.md           # Admin documentation
├── GRAMMAR_CATEGORIES_IMPLEMENTATION.md
└── GRAMMAR_CATEGORIES_MIGRATION.md
```

---

## 🤝 Contributing Guidelines

### Code Style
- TypeScript for all code
- Functional components with hooks
- Named exports for components
- Async/await over promises
- ESLint rules enforced

### Component Structure
```typescript
// 1. Imports
import { useState } from 'react'
import { Button } from '@/components/ui/button'

// 2. Types
interface MyComponentProps {
  title: string
}

// 3. Component
export function MyComponent({ title }: MyComponentProps) {
  // 4. Hooks
  const [state, setState] = useState()
  
  // 5. Handlers
  const handleClick = () => {}
  
  // 6. Render
  return <div>{title}</div>
}
```

### Git Workflow
- Feature branches from `main`
- Descriptive commit messages
- Pull request for all changes
- Code review required
- Squash merge to main

---

## 📞 Support & Contact

### Documentation
- **README.md:** General project overview
- **ADMIN_PANEL_README.md:** Admin feature documentation
- **GRAMMAR_CATEGORIES_IMPLEMENTATION.md:** Grammar system details
- **GRAMMAR_CATEGORIES_MIGRATION.md:** Migration guide

### Technical Support
- GitHub Issues for bug reports
- Discussions for feature requests
- Email support (planned)

---

## 📄 License

[License information to be added]

---

## 🙏 Acknowledgments

- **Next.js:** React framework
- **Supabase:** Backend and database
- **Shadcn/ui:** UI component library
- **Radix UI:** Primitive components
- **TailwindCSS:** Styling framework
- **Lemon Squeezy:** Payment processing
- **Vercel:** Hosting (if applicable)

---

**Document End**

*This PRD provides comprehensive documentation for designing a modern website interface and implementing the complete Learn&Quiz English platform. All requirements, database schemas, features, and technical specifications are included for AI-assisted development.*

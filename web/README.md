# 💰 WealthTrack PH

A modern, secure personal finance dashboard for Filipino users to track savings, stocks, and time deposits.

## 🚀 Features

### Authentication
- ✅ Email/password registration with email verification
- ✅ Secure login with session management
- ✅ Protected routes with middleware
- ✅ Row Level Security (RLS) enabled

### Financial Modules

#### 🏦 Savings Accounts
- Track digital and traditional bank accounts
- Automatic interest calculations (monthly, quarterly, annually)
- 2% withholding tax on interest
- Future value projections
- Net interest after tax

#### 📈 Stock Portfolio
- Track multiple stock holdings
- Real-time gain/loss calculations
- Performance metrics (% change)
- Total invested vs current value

#### ⏰ Time Deposits
- Principal and interest tracking
- Maturity date calculations
- 2% withholding tax deduction
- Gross vs net interest breakdown
- Days until maturity countdown

### Dashboard
- 💰 Total net worth overview
- 📊 Asset allocation pie chart
- 📈 Portfolio summary with progress bars
- 🔄 Recent activity feed

### UI/UX
- 🌗 Dark/Light mode with system preference detection
- 📱 Fully responsive (mobile-first design)
- 🎨 Modern fintech aesthetic
- ⚡ Smooth transitions and animations

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **TypeScript**
- **TailwindCSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons

### Backend & Database
- **Supabase** (PostgreSQL + Auth)
- **Row Level Security** for data protection

## 📦 Installation

### Prerequisites
- Node.js 18.18+ (recommended: 20+)
- npm or yarn
- Supabase account

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd WealthTrackPH/Web
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Supabase

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the database to be provisioned

#### Run the Migration
1. Go to the SQL Editor in your Supabase dashboard
2. Copy the contents of `supabase/migration.sql`
3. Paste and run the SQL script

This will create:
- `savings_accounts` table
- `stocks` table
- `time_deposits` table
- Row Level Security policies

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Get these values from:
- Supabase Dashboard → Settings → API
- Copy the Project URL and anon/public key

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo>
git push -u origin main
```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Click Deploy

3. **Verify Deployment**
   - Test authentication flow
   - Verify CRUD operations work
   - Check responsive design on mobile

### Supabase Configuration
- Ensure RLS policies are enabled
- Verify email settings for auth
- Set up email templates (optional)

## 📁 Project Structure

```
Web/
├── app/
│   ├── dashboard/
│   │   ├── layout.tsx       # Dashboard layout wrapper
│   │   └── page.tsx         # Main dashboard
│   ├── login/
│   │   └── page.tsx         # Login page
│   ├── register/
│   │   └── page.tsx         # Registration page
│   ├── savings/
│   │   └── page.tsx         # Savings module
│   ├── stocks/
│   │   └── page.tsx         # Stocks module
│   ├── time-deposits/
│   │   └── page.tsx         # Time deposits module
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home (redirects to login)
├── components/
│   ├── Card.tsx             # Reusable card component
│   ├── Header.tsx           # Mobile header
│   ├── MobileNav.tsx        # Bottom navigation
│   ├── Modal.tsx            # Modal component
│   ├── Sidebar.tsx          # Desktop sidebar
│   └── ThemeToggle.tsx      # Dark/light mode toggle
├── contexts/
│   └── AuthContext.tsx      # Authentication context
├── lib/
│   └── supabaseClient.ts    # Supabase client config
├── types/
│   └── index.ts             # TypeScript types
├── utils/
│   └── calculations.ts      # Financial calculations
├── supabase/
│   └── migration.sql        # Database schema
├── middleware.ts            # Route protection
└── package.json
```

## 🔐 Security Features

- ✅ Row Level Security (RLS) on all tables
- ✅ Users can only access their own data
- ✅ Protected routes with middleware
- ✅ Environment variables for sensitive data
- ✅ Supabase Auth for secure authentication

## 🧮 Financial Calculations

### Savings Interest
- Compound interest formula: `A = P(1 + r/n)^(nt)`
- 2% withholding tax on interest
- Net interest = Gross interest - Tax

### Stocks Performance
- Total Invested = Quantity × Average Price
- Current Value = Quantity × Current Price
- Gain/Loss = Current Value - Total Invested
- Gain/Loss % = (Gain/Loss / Total Invested) × 100

### Time Deposits
- Simple interest: `I = P × r × t`
- 2% withholding tax on interest
- Maturity Value = Principal + Net Interest

## 📱 Responsive Design

- **Mobile**: Bottom navigation, stacked cards
- **Tablet**: Responsive grid layouts
- **Desktop**: Sidebar navigation, multi-column grids

## 🎨 Theme System

- Light mode (default)
- Dark mode
- System preference detection
- LocalStorage persistence

## 🤝 Contributing

This is a personal project, but feel free to fork and customize for your own use!

## 📄 License

ISC

## 🙏 Acknowledgments

- Built with Next.js and Supabase
- Icons by Lucide
- Charts by Recharts

# WealthTrack PH - Deployment Guide

## Prerequisites
- Supabase account (free tier)
- Vercel account (free tier)
- GitHub account

## Step 1: Set Up Supabase

### 1.1 Create a New Project
1. Go to https://supabase.com
2. Click "New Project"
3. Fill in:
   - Project name: `wealthtrack-ph`
   - Database password: (generate a strong password)
   - Region: Choose closest to Philippines (Singapore recommended)
4. Wait for project to be provisioned (~2 minutes)

### 1.2 Run Database Migration
1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase/migration.sql`
4. Paste into the editor
5. Click "Run" or press Ctrl/Cmd + Enter
6. Verify success message

### 1.3 Configure Authentication
1. Go to **Authentication** → **Settings**
2. Under "Email Auth", ensure:
   - ✅ Enable email confirmations (recommended)
   - ✅ Enable email provider
3. (Optional) Customize email templates under **Email Templates**

### 1.4 Get API Credentials
1. Go to **Settings** → **API**
2. Copy these values (you'll need them later):
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 2: Prepare Your Code

### 2.1 Create Environment Variables
Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2.2 Test Locally
```bash
npm run dev
```

Visit http://localhost:3000 and test:
- ✅ Registration
- ✅ Login
- ✅ Add savings account
- ✅ Add stock
- ✅ Add time deposit
- ✅ View dashboard
- ✅ Dark/light mode toggle

## Step 3: Deploy to Vercel

### 3.1 Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: WealthTrack PH"
git branch -M main
git remote add origin https://github.com/your-username/wealthtrack-ph.git
git push -u origin main
```

### 3.2 Import to Vercel
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (or `Web` if in subdirectory)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

### 3.3 Add Environment Variables
In Vercel project settings:
1. Go to **Settings** → **Environment Variables**
2. Add:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://your-project.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your-anon-key`
3. Apply to: **Production**, **Preview**, and **Development**

### 3.4 Deploy
1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Visit your deployed URL (e.g., `https://wealthtrack-ph.vercel.app`)

## Step 4: Post-Deployment Verification

### 4.1 Test Production App
- ✅ Register a new account
- ✅ Check email for verification (if enabled)
- ✅ Log in
- ✅ Add sample data to all modules
- ✅ Verify calculations are correct
- ✅ Test on mobile device
- ✅ Test dark/light mode

### 4.2 Configure Supabase for Production
1. In Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add your Vercel domain to:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: `https://your-app.vercel.app/**`

## Step 5: Optional Enhancements

### 5.1 Custom Domain (Vercel)
1. Go to Vercel project → **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

### 5.2 Email Customization (Supabase)
1. Go to **Authentication** → **Email Templates**
2. Customize:
   - Confirmation email
   - Password reset email
   - Magic link email

### 5.3 Database Backups
1. Supabase automatically backs up your database
2. For manual backups: **Database** → **Backups**

## Troubleshooting

### Build Fails on Vercel
- Check Node.js version (should be 18.18+)
- Verify all dependencies are in `package.json`
- Check build logs for specific errors

### Authentication Not Working
- Verify environment variables are set correctly
- Check Supabase URL configuration
- Ensure RLS policies are enabled

### Data Not Showing
- Verify user is logged in
- Check browser console for errors
- Verify RLS policies in Supabase

### Charts Not Rendering
- Ensure `recharts` is installed
- Check for JavaScript errors in console
- Verify data is being fetched correctly

## Free Tier Limits

### Supabase Free Tier
- ✅ 500 MB database space
- ✅ 1 GB file storage
- ✅ 2 GB bandwidth
- ✅ 50,000 monthly active users

### Vercel Free Tier
- ✅ 100 GB bandwidth
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Preview deployments

## Support

For issues:
1. Check the README.md
2. Review Supabase documentation
3. Review Next.js documentation
4. Check Vercel deployment logs

## Next Steps

After successful deployment:
1. Share the app with friends/family
2. Gather feedback
3. Add more features (export to CSV, goals, etc.)
4. Monitor usage in Supabase dashboard

---

**Congratulations! Your WealthTrack PH app is now live! 🎉**

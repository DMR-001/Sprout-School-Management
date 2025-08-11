# Deployment Guide for Sprout School Management System

## 🚀 Deploying to Your Domain: sproutschool.co.in

### Prerequisites
- Your domain: sproutschool.co.in (registered with GoDaddy)
- GitHub account
- Supabase database (already configured)

### Option 1: Vercel Deployment (Recommended)

#### Step 1: Push to GitHub
1. Create a new repository on GitHub named "sprout-school"
2. In your project directory, run:
```bash
git init
git add .
git commit -m "Initial commit - Sprout School Management System"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sprout-school.git
git push -u origin main
```

#### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "New Project"
4. Import your "sprout-school" repository
5. Vercel will auto-detect Vite configuration
6. Click "Deploy"

#### Step 3: Configure Custom Domain
1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add "sproutschool.co.in"
4. Vercel will provide DNS records

#### Step 4: Update GoDaddy DNS
1. Login to GoDaddy
2. Go to "My Domains" → "DNS"
3. Add these records (provided by Vercel):
   - Type: CNAME, Name: www, Value: cname.vercel-dns.com
   - Type: A, Name: @, Value: [Vercel IP addresses]

### Option 2: Netlify Deployment

#### Step 1: Build and Deploy
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your `dist` folder (created by `npm run build`)
3. Or connect GitHub repository for automatic deployments

#### Step 2: Custom Domain Setup
1. In Netlify dashboard → "Domain Settings"
2. Add custom domain: sproutschool.co.in
3. Follow DNS configuration instructions

### Option 3: Traditional Web Hosting

#### Step 1: Build for Production
```bash
npm run build
```

#### Step 2: Upload to GoDaddy Hosting
1. Login to GoDaddy hosting control panel
2. Upload contents of `dist` folder to public_html
3. Configure any necessary redirects

### Environment Variables
Make sure to set these in your hosting platform:
- VITE_SUPABASE_URL=your_supabase_url
- VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

### Important Notes
1. **Single Page Application (SPA) Setup**: The vercel.json file ensures proper routing
2. **HTTPS**: Most modern hosting platforms provide free SSL certificates
3. **Supabase Configuration**: Make sure your production domain is allowed in Supabase settings

### Production Checklist
- ✅ App builds without errors (`npm run build`)
- ✅ Supabase connection works
- ✅ All routes function properly
- ✅ Environment variables configured
- ✅ Domain DNS configured
- ✅ SSL certificate active

### Support
If you encounter issues:
1. Check browser console for errors
2. Verify Supabase URL whitelist includes your domain
3. Ensure DNS propagation (can take up to 48 hours)
4. Test with `www.sproutschool.co.in` and `sproutschool.co.in`

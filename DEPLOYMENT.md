# Deployment Guide

## Vercel Deployment

### Prerequisites
1. GitHub account with this repository
2. Vercel account (sign up at https://vercel.com)
3. Supabase project with URL and anon key

### Step 1: Import Project to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`

### Step 2: Configure Environment Variables

Add these in Vercel Project Settings → Environment Variables:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Important**: Add variables for all environments (Production, Preview, Development)

### Step 3: Setup GitHub Secrets (for CI/CD)

Go to GitHub Repository → Settings → Secrets and variables → Actions

Add these secrets:

```bash
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
NVD_API_KEY=your_nvd_api_key  # Optional: for OWASP checks
```

**To get Vercel tokens:**
1. Go to Vercel → Settings → Tokens
2. Create new token
3. Get ORG_ID and PROJECT_ID from project settings

**To get NVD API Key (Optional but recommended):**
1. Go to https://nvd.nist.gov/developers/request-an-api-key
2. Request API key
3. Add to GitHub secrets

### Step 4: Deploy

**Manual Deploy:**
```bash
# Install Vercel CLI
pnpm add -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Automatic Deploy:**
- Push to `main` branch → Production deployment
- Open Pull Request → Preview deployment

### Security Configuration

The `vercel.json` includes:
- Security headers (XSS, Clickjacking protection)
- SPA routing (all routes → index.html)
- Asset caching (1 year for immutable assets)
- Content Security Policy headers

### Monitoring

After deployment:
1. Check Vercel dashboard for build logs
2. Monitor GitHub Actions for security scans
3. Review Trivy/OWASP reports in Actions artifacts

## IoT Simulator Deployment (TODO)

Options for deploying the Python IoT simulator:
1. **AWS Lambda** (scheduled execution)
2. **Railway.app** (persistent process)
3. **Azure Container Instances** (Docker)
4. **GitHub Actions** (scheduled workflow)

Current status: Running locally for development

## Supabase Configuration

Edge Functions are already deployed on Supabase:
```bash
# To deploy Supabase functions
npx supabase functions deploy
```

## Environment Variables Reference

### Frontend (Vercel)
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon/public key

### GitHub Actions
- `VERCEL_TOKEN`: Vercel API token
- `VERCEL_ORG_ID`: Vercel organization ID
- `VERCEL_PROJECT_ID`: Vercel project ID
- `NVD_API_KEY`: National Vulnerability Database API key (optional)

## Troubleshooting

### Build fails on Vercel
- Check environment variables are set
- Verify pnpm is being used (not npm)
- Check build logs in Vercel dashboard

### Security scan fails
- Review artifact reports in GitHub Actions
- Check for exposed secrets with Gitleaks
- Update vulnerable dependencies

### Preview deployment not working
- Verify VERCEL_TOKEN has correct permissions
- Check GitHub Actions logs
- Ensure Vercel project is linked to GitHub repo

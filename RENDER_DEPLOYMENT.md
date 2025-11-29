# Render Deployment Guide

## Quick Start

### 1. Create Render Account
- Go to [render.com](https://render.com)
- Sign up with GitHub

### 2. Connect Your Repository
- Click "New +" → "Static Site"
- Connect your GitHub repository
- Select the branch to deploy (e.g., `main`)

### 3. Configure Build Settings

**Name:** `ijt-app` (or your preferred name)

**Root Directory:** `ijt-app` (if your app is in a subdirectory)

**Build Command:**
```bash
npm install && npm run build
```

**Publish Directory:**
```
dist
```

**Auto-Deploy:** Yes (recommended)

### 4. Add Environment Variables

In Render Dashboard → Environment:

```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

**How to get Firebase values:**
1. Go to Firebase Console
2. Select your project
3. Click ⚙️ Settings → Project Settings
4. Scroll to "Your apps" → Web app
5. Copy the config values

### 5. Deploy

Click **"Create Static Site"**

Render will:
1. Clone your repository
2. Install dependencies
3. Run `npm run build`
4. Deploy the `dist` folder
5. Give you a live URL (e.g., `https://ijt-app.onrender.com`)

## Using render.yaml (Alternative Method)

The `render.yaml` file in your project root allows Infrastructure as Code deployment:

```yaml
services:
  - type: web
    name: ijt-app
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

**Benefits:**
- Version control your deployment config
- Automatic configuration on connect
- Easier team collaboration

## Firebase Configuration

### Update Firebase Authorized Domains

1. Go to Firebase Console → Authentication → Settings
2. Scroll to "Authorized domains"
3. Add your Render domain:
   ```
   ijt-app.onrender.com
   ```

### Update Firestore Security Rules

Your rules already allow authenticated users, no changes needed.

## Troubleshooting

### Build Fails

**Error: "Module not found"**
- Ensure all dependencies are in `package.json`
- Run `npm install` locally to verify

**Error: "vite: command not found"**
- Check `package.json` scripts has `"build": "vite build"`
- Vite should be in devDependencies

### Routing Issues (404 on refresh)

**Problem:** Refreshing `/exam/ssc-gd` returns 404

**Solution:** The `public/_redirects` file handles this:
```
/*    /index.html   200
```

This tells Render to serve `index.html` for all routes, allowing React Router to handle routing.

### Environment Variables Not Working

**Symptoms:**
- Firebase errors in console
- "Firebase not initialized"

**Fix:**
1. Verify all `VITE_` prefixed variables are set in Render
2. Redeploy after adding variables
3. Check browser console for actual values (they're public in client-side code)

### Blank Page After Deploy

**Check:**
1. Browser console for errors
2. Render build logs for warnings
3. Verify `dist/` folder contains `index.html`
4. Check asset paths in `vite.config.js`

## Custom Domain (Optional)

### Add Custom Domain

1. Render Dashboard → Settings → Custom Domains
2. Add your domain (e.g., `www.ijtexam.com`)
3. Update DNS records at your registrar:
   ```
   CNAME www <your-site>.onrender.com
   ```
4. Render provides free SSL automatically

### Update Firebase

Add custom domain to Firebase Authorized Domains:
```
www.ijtexam.com
ijtexam.com
```

## Performance Optimization

### Enable Compression

Render automatically enables gzip/brotli compression for static sites.

### Caching Headers

Render automatically sets appropriate cache headers:
- HTML: No cache (always fresh)
- JS/CSS with hashes: 1 year cache
- Images: 1 year cache

### Content Delivery

Render uses a global CDN for static sites automatically.

## Monitoring

### View Logs

Render Dashboard → Logs:
- Build logs (during deployment)
- HTTP access logs
- Error logs

### Analytics

Consider adding:
- Google Analytics
- Firebase Analytics (already configured if using Firebase)

## Deployment Workflow

### Automatic Deploys

Every push to `main` branch triggers:
1. Render pulls latest code
2. Runs build
3. Deploys if successful
4. Rollback if build fails

### Manual Deploy

Render Dashboard → Manual Deploy → "Deploy latest commit"

### Rollback

Render Dashboard → Events → Select previous deploy → "Rollback to this deploy"

## Cost

**Free Tier:**
- ✅ Unlimited static sites
- ✅ Custom domains
- ✅ Free SSL
- ✅ Global CDN
- ⚠️ Sites sleep after inactivity (doesn't apply to static sites)

**Paid Tier ($7/month):**
- Priority builds
- More build minutes
- Team features

## Production Checklist

Before going live:

- [ ] All environment variables set in Render
- [ ] Firebase authorized domains updated
- [ ] Test all routes (login, signup, exams, tests)
- [ ] Test Firebase authentication (email, Google)
- [ ] Verify progress tracking works
- [ ] Test on mobile devices
- [ ] Check browser console for errors
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure custom domain (optional)
- [ ] Add analytics (optional)

## Support

**Render Issues:**
- [Render Documentation](https://render.com/docs/static-sites)
- [Render Community](https://community.render.com)

**Firebase Issues:**
- [Firebase Documentation](https://firebase.google.com/docs)
- Check `FIREBASE_SETUP.md` in this repo

## Quick Commands

**Local build test:**
```bash
npm run build
npm run preview  # Preview production build locally
```

**Check build output:**
```bash
ls -la dist/
```

**Verify environment variables:**
```bash
cat .env  # Should match Render settings
```

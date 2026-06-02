# Deploy Rozgar Map Quiz

## Architecture
- Backend: Vercel (serverless Node.js)
- Frontend: Netlify (React SPA)
- Database: MongoDB Atlas (already connected)

---

## STEP 1: Push to GitHub (GitHub Desktop)

1. Open GitHub Desktop
2. File -> Add local repository -> Choose `rozgar-map-quiz` folder
3. Commit message: "Initial commit"
4. Publish repository as `rozgar-map-quiz`

---

## STEP 2: Deploy Backend to Vercel

1. Go to https://vercel.com -> Sign up with GitHub
2. Add New -> Project -> Import `rozgar-map-quiz`
3. Configure:
   - Framework Preset: `Other`
   - Root Directory: `server`
   - Build Command: `npm install`
4. Add Environment Variables:
   - MONGODB_URI: (from server/.env)
   - JWT_SECRET: (from server/.env)
   - NODE_ENV: `production`
   - CLIENT_URL: `https://localhost:3000` (update after Netlify deploy)
5. Click Deploy
6. Copy backend URL: `https://your-backend.vercel.app`

---

## STEP 3: Setup Admin

```bash
curl -X POST https://your-backend.vercel.app/api/admin/setup   -H "Content-Type: application/json"   -d '{"username":"admin","password":"YourPass123"}'
```

---

## STEP 4: Deploy Frontend to Netlify

1. Go to https://netlify.com -> Sign up with GitHub
2. Add new site -> Import from GitHub -> Select `rozgar-map-quiz`
3. Configure:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add Environment Variable:
   - VITE_API_URL: `https://your-backend.vercel.app/api`
5. Click Deploy
6. Copy frontend URL: `https://your-site.netlify.app`

---

## STEP 5: Update CORS

1. Go to Vercel backend project -> Settings -> Environment Variables
2. Update CLIENT_URL to your Netlify URL:
   - CLIENT_URL: `https://your-site.netlify.app`
3. Redeploy backend

---

## Done!

- Frontend: https://your-site.netlify.app
- Backend: https://your-backend.vercel.app/api
- Admin: https://your-site.netlify.app/admin/login

---

## Updating Code

1. Make changes locally
2. GitHub Desktop -> Commit -> Push
3. Both Vercel and Netlify auto-deploy!

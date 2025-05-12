# Deployment Guide

## Frontend (Netlify)

1. Push your code to a GitHub/GitLab/Bitbucket repository
2. Sign in to [Netlify](https://app.netlify.com/)
3. Click "Add new site" > "Import an existing project"
4. Select your Git provider and repository
5. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist/public`
   - Node version: 20
6. Add environment variables (from `.env.production`)
7. Click "Deploy site"

## Backend (Render)

1. Push your code to a GitHub/GitLab/Bitbucket repository
2. Sign in to [Render](https://dashboard.render.com/)
3. Click "New" > "Web Service"
4. Connect your repository
5. Configure the service:
   - Name: your-service-name
   - Region: choose the closest to your users
   - Branch: main/master
   - Build command: `npm install && npm run build`
   - Start command: `node dist/index.js`
   - Environment: Node
   - Node version: 20
6. Add environment variables:
   - `NODE_ENV=production`
   - `DATABASE_URL=your_database_url`
   - `SESSION_SECRET=your_session_secret`
7. Click "Create Web Service"

## Environment Variables

### Frontend (Netlify)
- `VITE_API_BASE_URL`: Your Render backend URL (e.g., https://your-render-backend-url.ondigitalocean.app)

### Backend (Render)
- `NODE_ENV=production`
- `DATABASE_URL`: Your PostgreSQL database URL
- `SESSION_SECRET`: A secure random string for session encryption
- `PORT`: The port your server should listen on (default: 10000)

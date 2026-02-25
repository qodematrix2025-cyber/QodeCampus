# Complete Deployment Guide: Qode Campus ERP on Hostinger + CyberPanel

## 📋 Project Overview
- **Frontend**: React + TypeScript + Vite (runs on port 3000 locally, needs production build)
- **Backend**: Node.js + Express + MongoDB (runs on port 5000)
- **Database**: MongoDB (requires cloud connection like MongoDB Atlas)

---

## 🚀 PHASE 1: Preparation (Before Deployment)

### 1.1 Prerequisites
- Hostinger account with CyberPanel installed
- MongoDB Atlas account (free tier available at https://www.mongodb.com/cloud/atlas)
- Git installed on your local machine
- Node.js 16+ installed on your local machine

### 1.2 Set Up MongoDB Atlas
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new project named "Qode"
4. Create a cluster (free tier M0)
5. Create a database user with a strong password
6. Get your connection string (looks like: `mongodb+srv://user:password@cluster.mongodb.net/dbname`)
7. Save this connection string - you'll need it for server setup

### 1.3 Prepare Environment Files

Create `.env` file for backend with MongoDB connection string:
```
MONGO_URI=mongodb+srv://your_username:your_password@cluster-name.mongodb.net/qode_db?retryWrites=true&w=majority
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=production
```

Create `.env` file for frontend (optional, for build-time variables):
```
VITE_API_URL=https://api.yourdomain.com
GEMINI_API_KEY=your_gemini_api_key
```

---

## 🌐 PHASE 2: Deploy Backend on CyberPanel

### 2.1 Connect via SSH to Your Hostinger Server
```bash
# On your local machine, open terminal/PowerShell
ssh root@your_server_ip
# Or use your FTP credentials
```

### 2.2 Create Backend Directory Structure
```bash
# Create application directory
mkdir -p /home/qode-backend
cd /home/qode-backend

# Create subdirectories
mkdir -p logs
mkdir -p public
```

### 2.3 Upload Backend Code via Git or SCP
**Option A: Using Git (Recommended)**
```bash
cd /home/qode-backend
git clone https://github.com/YOUR_USERNAME/qode-project.git .
cd backend\ erp
```

**Option B: Using SCP (File Upload)**
```bash
# From your local machine, upload the backend folder
scp -r "C:\Users\mahes\Desktop\Qode\backend erp" root@your_server_ip:/home/qode-backend/
```

### 2.4 Install Backend Dependencies
```bash
cd /home/qode-backend
npm install --production

# If you get permission errors, use:
sudo npm install --production
```

### 2.5 Create .env File on Server
```bash
nano .env
```

Paste your environment variables:
```
MONGO_URI=mongodb+srv://your_username:your_password@cluster-name.mongodb.net/qode_db?retryWrites=true&w=majority
PORT=5000
GEMINI_API_KEY=your_actual_gemini_api_key
NODE_ENV=production
```

Save: `Ctrl+O`, `Enter`, `Ctrl+X`

### 2.6 Create Node.js Application in CyberPanel
1. Log in to CyberPanel (usually https://your_server_ip:8090)
2. Go to **Application Management** → **Node.js Applications**
3. Click **New Application**
4. Configure:
   - **Application Name**: qode-backend
   - **Application Root**: /home/qode-backend
   - **Application Startup File**: index.js
   - **Port**: 5000 (or any available port)
   - **Node Version**: 18 (or higher)
   - **Application Mode**: production
5. Click **Create Application**

### 2.7 Create a Domain/Subdomain for Backend API
1. In CyberPanel: **Websites** → Select your domain
2. Go to **Addon Domains** or **Subdomains**
3. Create: `api.yourdomain.com` pointing to the Node.js app
4. Configure SSL certificate (Let's Encrypt - free)

### 2.8 Set Up Process Manager (PM2)
```bash
# Install PM2 globally
npm install -g pm2

# Start your backend with PM2
cd /home/qode-backend
pm2 start index.js --name qode-api

# Save PM2 config to restart on reboot
pm2 save

# Enable startup on reboot
pm2 startup

# Check status
pm2 status
pm2 logs qode-api
```

---

## 🎨 PHASE 3: Deploy Frontend on CyberPanel

### 3.1 Build Frontend for Production (On Your Local Machine)
```bash
# Navigate to project root
cd "C:\Users\mahes\Desktop\Qode"

# Install dependencies
npm install

# Create production build
npm run build

# Output will be in "dist" folder
```

### 3.2 Create Frontend Directory on Server
```bash
# Via SSH
mkdir -p /home/qode-frontend
cd /home/qode-frontend
```

### 3.3 Upload Built Frontend Files
**Option A: Via SCP**
```bash
# From your local machine
scp -r "C:\Users\mahes\Desktop\Qode\dist\*" root@your_server_ip:/home/qode-frontend/
```

**Option B: Via Git + Build on Server**
```bash
cd /home/qode-frontend
git clone https://github.com/YOUR_USERNAME/qode-project.git .
npm install --production
npm run build
# Copy dist contents to public_html
cp -r dist/* /home/qode-frontend/public/
```

### 3.4 Create Website in CyberPanel
1. Log in to CyberPanel
2. Go to **Websites** → **New Website**
3. Configure:
   - **Domain**: yourdomain.com
   - **PHP Version**: Any (frontend doesn't need PHP)
   - **Website Root**: /home/qode-frontend
4. Click **Create**

### 3.5 Configure Web Server (Nginx/Apache)
The frontend build creates static files. Configure your web server to:
1. Serve static files from `/home/qode-frontend/dist` or `/home/qode-frontend/public`
2. Route all `api/*` requests to your backend (api.yourdomain.com)
3. Handle SPA routing (redirect non-file requests to index.html)

**Nginx Configuration** (if available in CyberPanel):
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    root /home/qode-frontend/dist;
    index index.html;
    
    location / {
        try_files $uri /index.html;
    }
    
    location /api/ {
        proxy_pass https://api.yourdomain.com;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/json;
}
```

---

## 🔗 PHASE 4: Connect Frontend to Backend API

### 4.1 Update Frontend API Configuration
Modify your frontend environment or API service to point to production backend:

**In your frontend code** (services/apiService.ts):
```typescript
const API_BASE_URL = process.env.VITE_API_URL || 'https://api.yourdomain.com';

// All API calls will use this base URL
export const apiService = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});
```

### 4.2 Update CORS Settings in Backend (if needed)
Edit `backend erp/index.js`:
```javascript
app.use(cors({
  origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'school-id']
}));
```

### 4.3 Rebuild & Redeploy Frontend
```bash
# After updating config
npm run build

# Upload new dist folder to server
scp -r "C:\Users\mahes\Desktop\Qode\dist\*" root@your_server_ip:/home/qode-frontend/
```

---

## 🔐 PHASE 5: SSL Certificates & Security

### 5.1 Install Free SSL Certificate
1. In CyberPanel: **SSL**
2. Select your domain
3. Click **Auto-Install Let's Encrypt**
4. Wait for certificate installation

### 5.2 Enable HTTPS Redirect
In CyberPanel:
1. **Websites** → Your domain
2. **Settings** → Enable "Force HTTPS"

### 5.3 Update Frontend API URL to HTTPS
```typescript
const API_BASE_URL = 'https://api.yourdomain.com';
```

---

## ✅ PHASE 6: Testing & Verification

### 6.1 Test Backend API
```bash
# From your local machine
curl https://api.yourdomain.com/api/health

# Expected response
# { "status": "Online", "timestamp": "2026-02-23T..." }
```

### 6.2 Test Frontend
1. Open https://yourdomain.com in browser
2. Check browser console for any errors (F12 → Console)
3. Test login functionality
4. Verify API calls are going to https://api.yourdomain.com

### 6.3 Check Backend Logs
```bash
pm2 logs qode-api
```

### 6.4 Monitor Application
```bash
pm2 monit    # Real-time monitoring
pm2 status   # Quick status check
```

---

## 🛠️ PHASE 7: Maintenance & Updates

### 7.1 Update Backend Code
```bash
cd /home/qode-backend
git pull origin main
npm install --production
pm2 restart qode-api
```

### 7.2 Update Frontend Code
```bash
cd /home/qode-frontend
git pull origin main
npm install --production
npm run build
cp -r dist/* /home/qode-frontend/public/
```

### 7.3 View Application Logs
```bash
pm2 logs qode-api --lines 100
```

### 7.4 Restart Application
```bash
pm2 restart qode-api
pm2 restart all
```

---

## 🐛 Troubleshooting

### Issue: Backend connection fails
- Check MongoDB Atlas whitelist IP (add server IP)
- Verify .env file has correct MONGO_URI
- Check firewall rules on Hostinger

### Issue: Frontend shows blank page
- Check browser console (F12)
- Verify dist files are uploaded correctly
- Check nginx/apache is serving index.html for SPA routing

### Issue: API calls return 404
- Verify backend is running: `pm2 status`
- Check CORS configuration
- Verify API subdomain resolves: `nslookup api.yourdomain.com`

### Issue: High memory usage
- Restart PM2: `pm2 restart all`
- Check for memory leaks: `pm2 monit`
- Consider increasing server resources

---

## 📱 Environment Variables Checklist

**Backend (.env):**
- [ ] MONGO_URI
- [ ] PORT
- [ ] GEMINI_API_KEY
- [ ] NODE_ENV=production

**Frontend (.env):**
- [ ] VITE_API_URL=https://api.yourdomain.com
- [ ] GEMINI_API_KEY

---

## 🚢 Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Backend code uploaded to server
- [ ] Backend .env file configured
- [ ] PM2 process manager installed
- [ ] Node.js app created in CyberPanel
- [ ] API subdomain created and SSL enabled
- [ ] Frontend built locally
- [ ] Frontend files uploaded to server
- [ ] Website created in CyberPanel for main domain
- [ ] Nginx/Apache configured for SPA routing
- [ ] Frontend API URL updated to production
- [ ] SSL certificates installed for both domains
- [ ] CORS settings verified
- [ ] Backend API tested
- [ ] Frontend loaded and tested
- [ ] User login tested end-to-end

---

## 📞 Support Resources

- **CyberPanel Docs**: https://docs.cyberpanel.io/
- **MongoDB Atlas**: https://docs.atlas.mongodb.com/
- **PM2 Documentation**: https://pm2.keymetrics.io/docs/
- **Vite Build Guide**: https://vitejs.dev/guide/build.html

---

**Last Updated**: February 23, 2026

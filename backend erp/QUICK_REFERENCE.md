# 🚀 QUICK REFERENCE: Qode Deployment on Hostinger CyberPanel

## 📦 What You Need Before Starting

```
✅ Hostinger VPS with CyberPanel installed
✅ MongoDB Atlas free account (cloud database)
✅ Your domain name pointing to Hostinger servers
✅ SSH access to your server
✅ Git installed on server
✅ Node.js 16+ installed on server
✅ A Gemini API key (for AI chatbot)
```

---

## ⚡ 5-Minute Quick Deploy (if dependencies are ready)

### Step 1: SSH into Server
```bash
ssh root@your_server_ip
# or use Hostinger File Manager
```

### Step 2: Deploy Backend
```bash
cd /home/qode-backend
npm install --production
npm install -g pm2
pm2 start index.js --name qode-api
pm2 save
pm2 startup
```

### Step 3: Create .env File
```bash
nano /home/qode-backend/.env
```

Paste this (update values):
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/qode_db
PORT=5000
GEMINI_API_KEY=your_api_key
NODE_ENV=production
```

Save: Ctrl+O, Enter, Ctrl+X

### Step 4: Deploy Frontend
```bash
# On your local machine
npm run build

# Upload dist folder to server (via SCP or CyberPanel File Manager)
# Or: git clone your repo and npm run build on server
```

### Step 5: Create Websites in CyberPanel
1. Main site: yourdomain.com → Frontend files
2. API subdomain: api.yourdomain.com → Node.js app (port 5000)

### Step 6: SSL Certificates
```bash
# In CyberPanel: SSL → Auto-Install Let's Encrypt
```

---

## 🔧 Common Tasks After Deployment

### Check Backend Status
```bash
pm2 status
pm2 logs qode-api --lines 100
pm2 monit
```

### Restart Backend
```bash
pm2 restart qode-api
# Or full restart
pm2 restart all
```

### View Backend Logs
```bash
pm2 logs qode-api
tail -f /var/log/qode/output.log
```

### Update Backend Code
```bash
cd /home/qode-backend
git pull origin main
npm install --production
pm2 restart qode-api
```

### Update Frontend
```bash
# Build locally
npm run build

# Upload new dist files or rebuild on server
```

---

## 🧪 Testing Deployment

### Test Backend
```bash
curl https://api.yourdomain.com/api/health

# Expected output:
# {"status":"Online","timestamp":"2026-02-23T..."}
```

### Test Frontend
1. Open https://yourdomain.com in browser
2. Press F12 to open Developer Tools
3. Check Console tab for errors
4. Network tab should show API calls to https://api.yourdomain.com

### Test Login
1. Try logging in with test credentials
2. Check if network requests go to backend
3. Verify cookies are set

---

## 🚨 Troubleshooting Quick Fixes

### Backend not running?
```bash
pm2 status                # Check status
pm2 restart qode-api      # Restart
pm2 logs qode-api         # Check logs
```

### MongoDB connection error?
- Check .env MONGO_URI is correct
- Verify your IP in MongoDB Atlas whitelist
- Test connection: mongodb+srv://user:pass@cluster...

### API returns 404?
- Verify backend is running: `pm2 status`
- Check API URL is correct: `curl https://api.yourdomain.com/api/health`
- Verify subdomain DNS is pointing correctly

### Frontend shows blank page?
- Check browser console (F12)
- Verify dist files uploaded correctly
- Check web server is serving /index.html for SPA routing

### CORS errors?
- Check CORS settings in backend index.js
- Update to allow your domain
- Restart backend: `pm2 restart qode-api`

---

## 📊 Environment Files Location

```
Frontend (.env)
/home/qode-frontend/.env
Example values:
  VITE_API_URL=https://api.yourdomain.com
  VITE_GEMINI_API_KEY=xxx

Backend (.env)
/home/qode-backend/.env
Example values:
  MONGO_URI=mongodb+srv://...
  PORT=5000
  GEMINI_API_KEY=xxx
  NODE_ENV=production
```

---

## 📋 Pre-Flight Checklist

Before going live:

- [ ] MongoDB Atlas cluster created and working
- [ ] .env files created with correct values on server
- [ ] Backend running with PM2
- [ ] Backend API responds to health check
- [ ] Frontend built and uploaded
- [ ] Domain DNS pointing to Hostinger
- [ ] SSL certificates installed
- [ ] CORS configured for your domain
- [ ] Tested login functionality
- [ ] Tested API calls from frontend
- [ ] Checked logs for errors
- [ ] Set up log rotation (optional)
- [ ] Enabled backups
- [ ] Set up monitoring

---

## 🔐 Security Checklist

- [ ] .env files are NOT in git repository
- [ ] Database credentials are strong
- [ ] MONGO_URI uses credentials, not IP whitelist
- [ ] HTTPS enabled on both domains
- [ ] CORS only allows your domain (not *)
- [ ] JWT secret is strong and random
- [ ] Gemini API key is secure
- [ ] Password reset functionality works
- [ ] No sensitive data in console logs
- [ ] File upload size limits set

---

## 📞 Useful Links & Commands

### Server Commands
```bash
# Check Node processes
ps aux | grep node

# Check ports in use
netstat -tlnp | grep LISTEN

# Check disk space
df -h

# Check memory usage
free -h

# Check logs
journalctl -xe
```

### Git Commands
```bash
# Pull latest code
git pull origin main

# Check status
git status

# View logs
git log --oneline -5
```

### PM2 Commands
```bash
pm2 list              # List all processes
pm2 status            # Status
pm2 logs              # View logs
pm2 logs --lines 50   # Last 50 lines
pm2 delete qode-api   # Delete app
pm2 kill              # Kill all
pm2 resurrect         # Restore after kill
```

---

## 📈 Monitoring & Maintenance

### Monitor Resources
```bash
pm2 monit
```

### Rotate Logs (prevent disk full)
Create `/etc/logrotate.d/qode`:
```
/var/log/qode/*.log {
    daily
    rotate 7
    compress
    delaycompress
    notifempty
    create 0640 qode qode
    sharedscripts
    postrotate
        pm2 restart qode-api > /dev/null 2>&1 || true
    endscript
}
```

### Regular Updates
```bash
# Weekly: check for package updates
npm outdated

# Update npm packages (test first!)
npm update

# Restart backend
pm2 restart qode-api
```

---

## 🎯 Success Indicators

✅ You're ready if:
1. `https://yourdomain.com` loads your app
2. `https://api.yourdomain.com/api/health` returns status
3. Login works without errors
4. Student/Teacher dashboards load data
5. Network tab shows API calls going to correct URL
6. No CORS errors in console
7. No 404 errors on assets

---

**Need more help?** Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed information.

Last Updated: February 23, 2026

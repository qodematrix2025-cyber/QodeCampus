#!/bin/bash
# Qode Frontend Deployment Script for CyberPanel/Hostinger
# Run this script on your server to set up the frontend

set -e

echo "🎨 Qode Frontend Deployment Script"
echo "===================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Check root
if [[ $EUID -ne 0 ]]; then
   log_error "This script must be run as root (use sudo)"
fi

# Variables
FRONTEND_DIR="/home/qode-frontend"
FRONTEND_USER="qode-web"
DIST_DIR="$FRONTEND_DIR/dist"
PUBLIC_DIR="$FRONTEND_DIR/public"

log_info "Starting frontend deployment..."

# Step 1: Create system user and directory
log_info "Creating frontend user and directory..."
if ! id "$FRONTEND_USER" &>/dev/null; then
    useradd -m -s /bin/bash "$FRONTEND_USER"
    log_info "Created user: $FRONTEND_USER"
fi

mkdir -p "$FRONTEND_DIR"
mkdir -p "$PUBLIC_DIR"
chown -R "$FRONTEND_USER:$FRONTEND_USER" "$FRONTEND_DIR"
chmod 755 "$FRONTEND_DIR"

# Step 2: Check Node.js (only needed if building on server)
log_info "Option 1: Build locally and upload dist folder (RECOMMENDED)"
log_info "Option 2: Clone repo and build on server"
echo ""
read -p "Choose option (1 or 2): " BUILD_OPTION

if [ "$BUILD_OPTION" = "2" ]; then
    log_info "Checking Node.js..."
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Install it or choose Option 1."
    fi
    
    # Clone and build
    log_info "Cloning repository..."
    read -p "Enter repo URL: " REPO_URL
    cd "$FRONTEND_DIR"
    sudo -u "$FRONTEND_USER" git clone "$REPO_URL" .
    
    log_info "Installing dependencies..."
    sudo -u "$FRONTEND_USER" npm install --production-only
    
    log_info "Building frontend..."
    sudo -u "$FRONTEND_USER" npm run build
    
    log_info "Copying build to public directory..."
    if [ -d "$DIST_DIR" ]; then
        cp -r "$DIST_DIR"/* "$PUBLIC_DIR/"
        log_info "✅ Build files copied to $PUBLIC_DIR"
    else
        log_error "Build failed. Check npm run build logs."
    fi
fi

# Step 3: Verify index.html exists
if [ ! -f "$PUBLIC_DIR/index.html" ]; then
    log_error "index.html not found in $PUBLIC_DIR"
fi

# Step 4: Set permissions
log_info "Setting file permissions..."
chown -R "$FRONTEND_USER:$FRONTEND_USER" "$FRONTEND_DIR"
find "$PUBLIC_DIR" -type f -exec chmod 644 {} \;
find "$PUBLIC_DIR" -type d -exec chmod 755 {} \;

# Step 5: Create .env if needed
if [ ! -f "$FRONTEND_DIR/.env" ]; then
    log_warn "No .env found. Creating template..."
    cat > "$FRONTEND_DIR/.env" << EOF
VITE_API_URL=https://api.yourdomain.com
VITE_GEMINI_API_KEY=your_key_here
VITE_ENV=production
EOF
    log_info "Created .env - update with your values"
fi

# Step 6: Configure web server
log_info "Frontend deployment ready!"
echo ""
echo "⚠️  IMPORTANT: Configure your web server!"
echo ""
echo "In CyberPanel:"
echo "1. Create new website for yourdomain.com"
echo "2. Set public root to: $PUBLIC_DIR"
echo "3. Configure Nginx/Apache for SPA routing:"
echo ""
echo "Nginx config example:"
cat << 'NGINX'
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /home/qode-frontend/public;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css text/javascript application/json application/javascript;
}
NGINX

echo ""
echo "🎉 Frontend files ready at: $PUBLIC_DIR"
echo ""
echo "Useful commands:"
echo "  ls -la $PUBLIC_DIR              # List files"
echo "  du -sh $PUBLIC_DIR              # Check size"
echo ""

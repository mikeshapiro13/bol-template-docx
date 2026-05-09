#!/bin/bash

# Build and deploy script for BOL Template Docx app
# Assumes SSH access to server at 10.27.0.4 with key-based auth

# Configuration
SERVER="10.27.0.4"
REMOTE_USER="mike"  # Replace with your SSH username
REMOTE_PATH="/var/www/bol-app"  # Adjust to your nginx web root path
SSH_KEY="~/.ssh/id_ed25519"      # Path to your SSH private key

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Building the application...${NC}"

# Build the app
if npm run build; then
    echo -e "${GREEN}Build successful!${NC}"
else
    echo -e "${RED}Build failed!${NC}"
    exit 1
fi

echo -e "${YELLOW}Deploying to server...${NC}"

# Deploy using rsync (preserves permissions and only transfers changes)
if rsync -avz --delete -e "ssh -i $SSH_KEY" dist/ $REMOTE_USER@$SERVER:$REMOTE_PATH/; then
    echo -e "${GREEN}Deployment successful!${NC}"
    echo -e "${GREEN}App updated at app.home.lan${NC}"
else
    echo -e "${RED}Deployment failed!${NC}"
    exit 1
fi

echo -e "${GREEN}Done!${NC}"
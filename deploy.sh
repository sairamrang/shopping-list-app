#!/bin/bash

# Deployment script for shopping-list-app
# Usage: ./deploy.sh "Your commit message"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting deployment...${NC}"

# Get commit message from argument or use default
COMMIT_MSG="${1:-Update: deploy latest changes}"

# Stage all changes
echo -e "${BLUE}📦 Staging changes...${NC}"
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
  echo -e "${RED}⚠️  No changes to commit${NC}"
else
  # Commit changes
  echo -e "${BLUE}💾 Committing changes...${NC}"
  git commit -m "$COMMIT_MSG"
fi

# Push to GitHub
echo -e "${BLUE}📤 Pushing to GitHub...${NC}"
git push

# Deploy to Vercel
echo -e "${BLUE}🌐 Deploying to Vercel...${NC}"
vercel --prod

echo -e "${GREEN}✅ Deployment complete!${NC}"

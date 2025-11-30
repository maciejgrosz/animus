#!/bin/bash

# Interactive GitHub Issues Manager
# Creates and manages GitHub issues for Animus project

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════╗"
echo "║   Animus GitHub Issues Manager                ║"
echo "║   Automated Task Creation                     ║"
echo "╚═══════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI (gh) is not installed${NC}"
    echo ""
    echo "Install it with:"
    echo "  brew install gh"
    echo ""
    exit 1
fi

# Check authentication
echo -e "${YELLOW}🔐 Checking GitHub authentication...${NC}"
if ! gh auth status &> /dev/null; then
    echo -e "${RED}❌ Not authenticated with GitHub${NC}"
    echo ""
    echo "Please run:"
    echo -e "  ${GREEN}gh auth login${NC}"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓ Authenticated${NC}"
echo ""

# Menu
echo "What would you like to do?"
echo ""
echo "  1) Create ALL 20 issues (recommended)"
echo "  2) Create only CRITICAL issues (4 issues)"
echo "  3) Create only HIGH PRIORITY issues (5 issues)"
echo "  4) List existing issues"
echo "  5) Cancel"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo -e "${BLUE}📝 Creating all 20 issues...${NC}"
        ./gh-scripts/create-github-issues.sh
        ;;
    2)
        echo -e "${BLUE}📝 Creating 4 critical issues...${NC}"
        
        # Task 1
        gh issue create --title "🚨 Fix Three.js Memory Leaks & Cleanup" \
          --label "bug,performance,critical" \
          --body "See ROADMAP.md Task #1 for details" || true
        
        # Task 2
        gh issue create --title "🧹 Audit & Fix All Three.js Preset Cleanup" \
          --label "bug,performance,critical" \
          --body "See ROADMAP.md Task #2 for details" || true
        
        # Task 4
        gh issue create --title "🛡️ Add React Error Boundaries" \
          --label "bug,ux,high-priority" \
          --body "See ROADMAP.md Task #4 for details" || true
        
        # Task 5
        gh issue create --title "📊 Add Performance Monitoring" \
          --label "performance,tooling" \
          --body "See ROADMAP.md Task #5 for details" || true
        
        echo -e "${GREEN}✅ Created 4 critical issues${NC}"
        ;;
    3)
        echo -e "${BLUE}📝 Creating 5 high priority issues...${NC}"
        
        # Tasks 1, 2, 3, 4, 8
        gh issue create --title "🚨 Fix Three.js Memory Leaks & Cleanup" \
          --label "bug,performance,critical" \
          --body "See ROADMAP.md Task #1" || true
        
        gh issue create --title "🧹 Audit & Fix All Three.js Preset Cleanup" \
          --label "bug,performance,critical" \
          --body "See ROADMAP.md Task #2" || true
        
        gh issue create --title "🔄 Replace Global Refs with React Context" \
          --label "refactor,architecture,high-priority" \
          --body "See ROADMAP.md Task #3" || true
        
        gh issue create --title "🛡️ Add React Error Boundaries" \
          --label "bug,ux,high-priority" \
          --body "See ROADMAP.md Task #4" || true
        
        gh issue create --title "🎯 Optimize BroadcastChannel Usage" \
          --label "performance,optimization" \
          --body "See ROADMAP.md Task #8" || true
        
        echo -e "${GREEN}✅ Created 5 high priority issues${NC}"
        ;;
    4)
        echo -e "${BLUE}📋 Listing existing issues...${NC}"
        echo ""
        gh issue list
        echo ""
        echo "View in browser:"
        echo "  https://github.com/maciejgrosz/animus/issues"
        ;;
    5)
        echo -e "${YELLOW}Cancelled${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✨ Done!${NC}"
echo ""
echo "Next steps:"
echo "  1. View issues: gh issue list"
echo "  2. Start work: git checkout -b fix/issue-1"
echo "  3. Use Copilot to help with implementation"
echo ""

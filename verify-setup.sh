#!/bin/bash

# KiteMate Setup Verification Script
# Runs basic checks to ensure the development environment is ready

set -e

echo "🔍 KiteMate Setup Verification"
echo "=============================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if in correct directory
if [ ! -f "Taskfile.yml" ]; then
    echo -e "${RED}❌ Error: Run this script from the project root${NC}"
    exit 1
fi

echo "📁 Project Structure"
echo "-------------------"
[ -d "backend" ] && echo -e "${GREEN}✓${NC} backend/" || echo -e "${RED}✗${NC} backend/"
[ -d "frontend" ] && echo -e "${GREEN}✓${NC} frontend/" || echo -e "${RED}✗${NC} frontend/"
[ -f "Taskfile.yml" ] && echo -e "${GREEN}✓${NC} Taskfile.yml" || echo -e "${RED}✗${NC} Taskfile.yml"
echo ""

echo "📦 Backend Dependencies"
echo "----------------------"
if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules installed"
    echo "   $(cd backend && npm list --depth=0 2>/dev/null | grep -c '├──\|└──') packages"
else
    echo -e "${RED}✗${NC} node_modules not found"
    echo "   Run: cd backend && npm install"
fi
echo ""

echo "📦 Frontend Dependencies"
echo "-----------------------"
if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules installed"
    echo "   $(cd frontend && npm list --depth=0 2>/dev/null | grep -c '├──\|└──') packages"
else
    echo -e "${RED}✗${NC} node_modules not found"
    echo "   Run: cd frontend && npm install"
fi
echo ""

echo "🔧 Backend TypeScript"
echo "--------------------"
cd backend
if npx tsc --noEmit 2>/dev/null; then
    echo -e "${GREEN}✓${NC} TypeScript compiles successfully"
else
    echo -e "${RED}✗${NC} TypeScript compilation errors"
fi
cd ..
echo ""

echo "🎨 Frontend Svelte"
echo "-----------------"
cd frontend
if npx svelte-check --threshold error 2>/dev/null | grep -q "0 errors"; then
    echo -e "${GREEN}✓${NC} Svelte checks pass"
else
    echo -e "${YELLOW}⚠${NC}  Svelte checks have warnings"
fi
cd ..
echo ""

echo "⚙️  Environment Files"
echo "--------------------"
[ -f "backend/.env" ] && echo -e "${GREEN}✓${NC} backend/.env exists" || echo -e "${YELLOW}⚠${NC}  backend/.env missing (copy from .env.example)"
[ -f "frontend/.env.local" ] && echo -e "${GREEN}✓${NC} frontend/.env.local exists" || echo -e "${YELLOW}⚠${NC}  frontend/.env.local missing (copy from .env.local.example)"
echo ""

echo "🎯 Ready to Start?"
echo "-----------------"
echo ""
echo "Start development servers:"
echo "  ${GREEN}task dev${NC}         - Start both backend and frontend"
echo "  ${GREEN}task dev:backend${NC}  - Start Encore backend only"
echo "  ${GREEN}task dev:frontend${NC} - Start SvelteKit frontend only"
echo ""
echo "Run tests:"
echo "  ${GREEN}task test${NC}        - Run all tests"
echo ""
echo "For more commands:"
echo "  ${GREEN}task --list${NC}"
echo ""
echo "=============================="
echo "✨ Setup verification complete!"


#!/bin/bash
# Script to commit and push all changes to main branch

echo "Checking for changes..."
git status

echo ""
echo "Staging all changes..."
git add -A

echo ""
echo "Checking what will be committed..."
git status

echo ""
echo "Committing changes..."
git commit -m "feat: Apply Cursor AI changes and updates"

echo ""
echo "Pushing to main branch..."
git push origin main

echo ""
echo "✅ Done! All changes have been committed and pushed."


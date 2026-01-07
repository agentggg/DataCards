#!/usr/bin/env bash
set -e

# --------------------------------------------
# Usage:
#   ./deploy.sh
#   ./deploy.sh --commit-source "commit message"
# --------------------------------------------

COMMIT_SOURCE=false
SOURCE_MESSAGE="source update"

if [[ "$1" == "--commit-source" ]]; then
  COMMIT_SOURCE=true
  if [[ -n "$2" ]]; then
    SOURCE_MESSAGE="$2"
  fi
fi

# If committing source, do it explicitly
if [[ "$COMMIT_SOURCE" == true ]]; then
  if git diff --quiet && git diff --cached --quiet; then
    echo "ℹ️ No source changes to commit."
  else
    echo "📦 Committing source changes..."
    git add .
    git commit "-m "$SOURCE_MESSAGE""
    git push
  fi
else
  # Enforce clean tree if not committing source
  if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "❌ Working tree not clean. Commit your source changes first, or run:"
    echo "   ./deploy.sh --commit-source \"your message\""
    exit 1
  fi
fi

# Build frontend
cd my-react-app
npm run build
cd ..

# Deploy build output
rm -rf docs
mv my-react-app/dist docs
cp docs/index.html docs/404.html
touch docs/.nojekyll

git add docs
git commit -m "deploy"
git push

echo "✅ Deployment complete."
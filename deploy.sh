#!/usr/bin/env bash
set -e

cd my-react-app
npm run build
cd ..

rm -rf docs
mv my-react-app/dist docs
cp docs/index.html docs/404.html
touch docs/.nojekyll

git add docs
git commit -m "deploy"
git push

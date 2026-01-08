#!/bin/zsh
set -e

cd my-react-app
npm ci
npm run build
cd ..

rm -rf ./index.html ./assets
cp -R my-react-app/dist/* .

git add index.html assets
git commit -m "Auto-deploy $(date '+%Y-%m-%d %H:%M')" || exit 0
git push

# cd my-react-app && npm ci && npm run build && cd ..
# rm -rf ./index.html ./assets
# cp -R my-react-app/dist/* .
# git add index.html assets
# git commit -m "Deploy $(date '+%Y-%m-%d %H:%M')"
# git push
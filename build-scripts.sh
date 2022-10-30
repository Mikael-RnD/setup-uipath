npm init -y
npm install
npm install @actions/core
npm install @actions/github
npm i -g @vercel/ncc
npm ci
npm run prepare
ncc build index.js -o dist --source-map --license licenses.txt
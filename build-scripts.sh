npm init -y
npm install
npm install @actions/core
npm install @actions/github
npm i -g @vercel/ncc
npm run prepare
ncc build index.js --license licenses.txt
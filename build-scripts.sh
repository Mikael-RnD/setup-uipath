npm init -y
npm install @actions/core
npm install @actions/github
npm i -g @vercel/ncc
ncc build index.js --license licenses.txt
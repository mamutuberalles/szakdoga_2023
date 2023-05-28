cd crypto-gaze
npm i
cds deploy --to sqlite
cd ..
cd react-ui
npm i --legacy-peer-deps
npm run build
cd ..
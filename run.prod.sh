#!/bin/bash
sudo docker-compose -f docker-compose.yml down
sudo docker-compose -f docker-compose.dev.yml down

mkdir -p files files-prod
chmod 777 files files-prod

# Build backend
# cd centre/backend
# rm -rf dist
# npm i
# npm run build
# cd ../..

# Build frontend
cd centre/frontend
rm -rf dist build
npm i
npm run build
cd ../..

sudo docker-compose -f docker-compose.yml down
sudo docker-compose -f docker-compose.yml up --build -d

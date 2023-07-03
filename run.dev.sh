#!/bin/bash

mkdir -p files files-prod
chmod 777 files files-prod
mkdir -p ./files/scan-logs/ ./files-prod/scan-logs/

sudo docker-compose -f docker-compose.yml down
sudo docker-compose -f docker-compose.dev.yml down
sudo docker-compose -f docker-compose.dev.yml up --build -d

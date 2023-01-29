#!/bin/bash
sudo docker-compose -f docker-compose.yml down
sudo docker-compose -f docker-compose.dev.yml down

mkdir -p files files-prod
chmod 777 files files-prod

sudo docker-compose -f docker-compose.yml down
sudo docker-compose -f docker-compose.yml up --build -d

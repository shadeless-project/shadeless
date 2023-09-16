#!/bin/bash

mkdir -p files
chmod 777 files

# sudo docker-compose -f docker-compose.yml down
# sudo docker-compose -f docker-compose.dev.yml down
# sudo docker-compose -f docker-compose.dev.yml up --build -d

sudo docker compose -f docker-compose.yml down
sudo docker compose -f docker-compose.dev.yml down
sudo docker compose -f docker-compose.dev.yml up --build -d
#!/bin/bash

#    .---------- constant part!
#    vvvv vvvv-- the code from above
PURPLE='\033[0;35m'
NC='\033[0m' # No Color
#   ------------

myPrint () {
    printf "${PURPLE}[`basename $0`]${NC} $1\n"
}

stopDockers() {
    sudo docker stop shadeless-db
    sudo docker stop shadeless-ui
    sudo docker stop shadeless-centre
    sudo docker stop shadeless-nginx
    sudo docker rm shadeless-db
    sudo docker rm shadeless-ui
    sudo docker rm shadeless-centre
    sudo docker rm shadeless-nginx
}

myPrint "initializing static folder"
mkdir -p files files-prod
chmod 777 files files-prod

if ! command -v docker-compose &> /dev/null
then
    myPrint "docker-compose could not be found"
    myPrint "trying to use docker compose instead"
    myPrint "stopping running containers"
    sudo docker compose -f docker-compose.yml down
    sudo docker compose -f docker-compose.yml stop
    sudo docker compose -f docker-compose.dev.yml down
    sudo docker compose -f docker-compose.dev.yml stop
    stopDockers

    myPrint "starting Shadeless service"
    sudo docker compose -f docker-compose.yml up --build -d
else
    myPrint "docker-compose found"
    myPrint "stopping running containers"
    sudo docker-compose -f docker-compose.yml down
    sudo docker-compose -f docker-compose.yml stop
    sudo docker-compose -f docker-compose.dev.yml down
    sudo docker-compose -f docker-compose.dev.yml stop
    stopDockers

    myPrint "starting Shadeless service"
    sudo docker-compose -f docker-compose.yml up --build -d
fi

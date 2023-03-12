#!/bin/bash

#    .---------- constant part!
#    vvvv vvvv-- the code from above
PURPLE='\033[0;35m'
NC='\033[0m' # No Color
#   ------------

myPrint () {
    printf "${PURPLE}[`basename $0`]${NC} $1\n"
}

res_config_account=1
config_account_env() {
    if [ "$(docker ps | grep $1)" ]; then
        myPrint "$1 is running"
        myPrint "running account configuration on $1"
        sudo docker exec -it $1 npm run devtool:acc
    else
        myPrint "$1 not running"
        res_config_account=0
    fi
}

config_account_env shadeless-centre
if [ $res_config_account -eq 0 ]; then
    config_account_env app-centre
fi

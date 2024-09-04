#!/bin/sh

source .env
react-scripts build
if [[-n $PM2_PROCESS_NAME]]; then
    pm2 delete $PM2_PROCESS_NAME
    if [[-n $PORT]]; then
        pm2 serve build $PORT --spa --name $PM2_PROCESS_NAME
    else
        pm2 serve build 3000 --spa --name $PM2_PROCESS_NAME
    fi
else
    pm2 delete "WEB"
    if [[-n $PORT]]; then
        pm2 serve build $PORT --spa --name "WEB"
    else
        pm2 serve build 3000 --spa --name "WEB"
    fi
fi
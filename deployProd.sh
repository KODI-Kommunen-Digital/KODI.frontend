#!/bin/sh

source .env
react-scripts build
if [[-n $PM2_PROCESS_NAME]]; then
    pm2 serve build $PORT --spa --name $PM2_PROCESS_NAME
else
    pm2 serve build $PORT --spa --name "WEB"
fi
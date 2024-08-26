#!/bin/sh

source .env
react-scripts build
pm2 serve build $PORT --spa --name $PM2_PROCESS_NAME
#!/bin/bash

cd ./nginx
echo --nginx -s stop
./nginx -s stop
echo

echo --nginx
nohup ./nginx
cd ..
echo

echo success
#!/bin/bash

cd ./nginx
echo --nginx -s stop
./nginx -s stop
echo

echo --nginx
./nginx
cd ..
echo

echo success
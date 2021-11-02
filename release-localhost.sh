#!/bin/bash

echo --nginx stop
cd ./nginx
rm -rf ./logs/*.log
taskkill -f -im nginx.exe
cd ..
echo

echo --set config.debug=1
sed -i "s/config.debug=.*/config.debug=1/g" ./src/config.js
echo

echo --start http://127.0.0.1/index.html
start http://127.0.0.1/index.html
echo

echo --nginx start
cd ./nginx
./nginx
cd ..
echo
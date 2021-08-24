#!/bin/bash

echo --nginx stop
cd ./nginx
rm -rf ./logs/*.log
taskkill -f -im nginx.exe
echo

echo --start http://127.0.0.1/index.html
start http://127.0.0.1/index.html
echo

echo --nginx start
./nginx
cd ..
echo
#!/bin/bash

echo --nginx
cd ./nginx
rm -rf ./logs/*
./nginx
cd ..
echo
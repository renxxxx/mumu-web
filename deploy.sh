#!/bin/bash
#admin / asdfj12#!@jweoiqr$@1482DF3ewrjOY

echo "-assign version"
date=`date +%y%m%d`
version=$date
echo version: $version
sed -i "s/^  version: \".*\",$/  version: \"$version\",/g" ./app.js
echo

echo "-git add ."
git add .
echo

echo "-git commit -am 1"
git commit -am 1
echo

echo "-git pull"
git pull
echo

echo "-git push"
git push
echo

cd ./src
../zip -q -r ../dist/renx-mumu-web-$version.zip ./
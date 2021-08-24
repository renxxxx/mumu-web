#!/bin/bash
#admin / Dd34ja9VJ768O4t5t3218sfGFTEKJk

versionMsg=$1
if [ -z "$versionMsg" ]; then
 versionMsg='更新'
fi

echo "-assign version"
date=`date +%y%m%d`
version=$date
echo version: $version
sed -i "s/^  version: \".*\",$/  version: \"$version\",/g" ./app.js
echo

echo "-git add"
git add .
echo

echo "-git commit"
git commit -am "$versionMsg"
echo

echo "-git pull"
git pull
echo

echo "-git push"
git push
echo

echo "-package"
commitid=`git rev-parse --short HEAD`
env=/home/admin/renx
packageName="renx-mumu-web-$version-$commitid.zip"
echo $packageName
cd ./src
../zip -q -r ../dist/$packageName ./
cd ..
echo

echo "-remote push"
scp -P 22 ./dist/$packageName admin@39.99.246.175:$env
echo

echo "-remote deploy"
ssh -p 22 -t admin@39.99.246.175 "unzip -q -o $env/$packageName -d $env/webroot/mumu"
echo

start https://renx.cc/mumu/index.html

echo success

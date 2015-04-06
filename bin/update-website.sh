#!/bin/sh

mkdir build && cd build/

git clone https://github.com/nicroto/viktor.git

cd viktor

git checkout gh-pages

rm -rf *

cp -R ../../src/server/client/ .

git add --all

git commit -m "update website"

git push
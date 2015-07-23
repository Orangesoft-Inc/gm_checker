#!/bin/sh
rm -rf ./build
mkdir ./build
cp -r app/ build/
cd build

files=(`ls -1 *.js`)

for file in ${files[@]}
do
echo uglifyjs -o ${file} ../app/${file} 
uglifyjs -o ${file} ../app/${file}
done

cd ..
cp -v app/jquery*.js build/
zip -r app.zip build/*

exit 0

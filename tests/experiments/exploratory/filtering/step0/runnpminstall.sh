#!/bin/bash

BENCH_FOLDER=/downloads/benchmarks
cd $BENCH_FOLDER
for proj in `ls -d */`
do
	echo "Running npm for ${proj}"
    cd "$BENCH_FOLDER/$proj"
    npm install
done
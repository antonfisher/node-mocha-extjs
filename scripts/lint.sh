#!/usr/bin/env bash

./node_modules/.bin/standard \
    gulpfile.js \
    mocha-extjs.js \
    ./src/**/*.js \
    ./test/suites/**/*.js \
    ./test/sandbox/app/**/*.js \
    | ./node_modules/.bin/snazzy;

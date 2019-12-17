// This script runs all tests, and go on running the guided execution 100 times
// for the tests that have some callback interleaving. 

const runAll = require('./run-all');
const benchmarkDir = require('../../benchmark_config')();

// 6 tests, 6 tests with interleavings
runAll('bull', '', `${benchmarkDir}/exploratory`);

// 842 tests, 2 tests with interleavings
runAll('markdown-it', '', `${benchmarkDir}/exploratory`);

// 33 tests, 4 tests with interleavings
runAll('mongo-express', '', `${benchmarkDir}/exploratory`);

// 325 tests, 21 tests with interleavings
runAll('nedb', '', `${benchmarkDir}/exploratory`);

// 28 tests, 23 tests with interleavings
runAll('node-archiver', '', `${benchmarkDir}/exploratory`);

// 110 tests, 24 tests with interleavings
// Use this.postponeTick = false in lib/control/strategies/random1.js
runAll('node-http-proxy', '', `${benchmarkDir}/exploratory`, '-c noderacer-settings.json');

// 161 tests, 60 tests with interleavings
runAll('node-serialport', '', `${benchmarkDir}/exploratory`);

// 1362 tests, 19 tests with interleavings
runAll('objection.js', '--timeout 15000', `${benchmarkDir}/exploratory`);
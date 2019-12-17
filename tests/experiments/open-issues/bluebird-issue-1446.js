const benchmarkDir = require('../benchmark_config')();
const runNodeRacer = require('../known-bugs/comparison-noderacer');

/**
 * for i in `seq 1 100`; do echo $i; node race.js; sleep .5; done
 *  
 * Node Vanilla - errors for most runs
 * 
 * NodeRacer: 72 / 100 (28 passing)
 * 
 * Fixed version
 * 
 * Node Vanilla - Bug reproduction ratio: 0 / 100
 * 
 * NodeRacer (fixed version): 0 / 100 
 * 
 * --Inversed case
 * 
 * for i in `seq 1 100`; do echo $i; node race-inverse-case.js; sleep .5; done
 * 
 * NodeRacer (fixed version): 34 / 100 
 */

// This project has two versions: buggy (timers.js.ORIG) and fixed (timers.js.FIXED)
// To run the buggy version, run the following command at the root of the project: 
// > cp node_modules/bluebird/js/release/timers.js.ORIG node_modules/bluebird/js/release/timers.js
// 
// To run the fixed version, run the following command at the root of the project: 
// > cp node_modules/bluebird/js/release/timers.js.FIXED node_modules/bluebird/js/release/timers.js

// header
console.log('iteration,runs,tool,benchmark,fails,firstfail');

runNodeRacer({
    iterations: 1,
    runs: 100,
    strategy: 'NodeRacer',
    strategyCommand: 'random',
    benchmarkName: 'bluebird',
    benchmarkDir: `${benchmarkDir}/open-issues/bluebird-2`,
    commandLog: 'node race.js -c config.json',
    command: 'node race.js',
    errorMessage: 'timed out',
    silent: false
});

// It explores a potential (challenged) issue (not confirmed) in the fixed version
runNodeRacer({
    iterations: 1,
    runs: 100,
    strategy: 'NodeRacer',
    strategyCommand: 'random',
    benchmarkName: 'bluebird',
    benchmarkDir: `${benchmarkDir}/open-issues/bluebird-2`,
    commandLog: 'node race-inverse-case.js -c config.json',
    command: 'node race-inverse-case.js',
    errorMessage: 'finished',
    silent: false
});
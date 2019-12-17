const benchmarkDir = require('../benchmark_config')();
const runNodeRacer = require('../known-bugs/comparison-noderacer');

/**
 * for i in `seq 1 100`; do echo $i; node race-test-short.js; sleep .5; done
 * 
 * Bug reproduction ratio: 0/100
 * 
 * NodeRacer: 0 / 100
 * 
 * 
 * for i in `seq 1 100`; do echo $i; node race-test.js; sleep .5; done
 * 
 * NodeRacer: 0 / 100
 * 
 * 
 * Benchmark 'live-server-potential-race' contains the fix proposed 
 * 
 * for i in `seq 1 100`; do echo $i; node race-root-dir-test.js; sleep .5; done
 * 
 * NodeRacer: 22 / 100
 */

// header
console.log('iteration,runs,tool,benchmark,fails,firstfail');

runNodeRacer({
    iterations: 1,
    runs: 100,
    strategy: 'NodeRacer',
    strategyCommand: 'random',
    benchmarkName: 'live-server',
    benchmarkDir: `${benchmarkDir}/open-issues/live-server-race`,
    command: 'node race-test-short.js',
    commandLog: 'node race-test-short.js -c config.json',
    errorMessage: 'Error: wrong final page',
    silent: false,
    noGlobal: true
});

runNodeRacer({
    iterations: 1,
    runs: 100,
    strategy: 'NodeRacer',
    strategyCommand: 'random',
    benchmarkName: 'live-server',
    benchmarkDir: `${benchmarkDir}/open-issues/live-server-race`,
    command: 'node race-test.js',
    commandLog: 'node race-test.js -c config.json',
    errorMessage: 'Error: wrong final page',
    silent: false,
    noGlobal: true
});

runNodeRacer({
    iterations: 1,
    runs: 100,
    strategy: 'NodeRacer',
    strategyCommand: 'random',
    benchmarkName: 'live-server',
    benchmarkDir: `${benchmarkDir}/open-issues/live-server-potential-race`,
    command: 'node race-root-dir-test.js',
    commandLog: 'node race-root-dir-test.js -c config.json',
    errorMessage: 'Error',
    silent: false,
    noGlobal: true
});
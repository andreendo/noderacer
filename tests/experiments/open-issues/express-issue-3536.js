const benchmarkDir = require('../benchmark_config')();
const runNodeRacer = require('../known-bugs/comparison-noderacer');

/**
 * for i in `seq 1 100`; do echo $i; node express01/server-test.js; sleep .5; done
 * 
 * Bug reproduction ratio: 0/100
 * 
 * NodeRacer: 62 / 100
 * 
 * NodeRacer (fixed version): 0 / 100 
 */

// header
console.log('iteration,runs,tool,benchmark,fails,firstfail');

runNodeRacer({
    iterations: 1,
    runs: 100,
    strategy: 'NodeRacer',
    strategyCommand: 'random',
    benchmarkName: 'express-user',
    benchmarkDir: `${benchmarkDir}/open-issues/nodesamples`,
    command: 'node express01/server-test.js',
    errorMessage: 'error',
    silent: false
});

runNodeRacer({
    iterations: 1,
    runs: 100,
    strategy: 'NodeRacer',
    strategyCommand: 'random',
    benchmarkName: 'express-user',
    benchmarkDir: `${benchmarkDir}/open-issues/nodesamples`,
    command: 'node express01/server-test-fixed.js',
    errorMessage: 'error',
    silent: false
});
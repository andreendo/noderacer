const benchmarkDir = require('../benchmark_config')();
const runNodeRacer = require('../known-bugs/comparison-noderacer');

/**
 * for i in `seq 1 100`; do echo $i; node triggerRace.js; sleep .5; done
 * 
 * Bug reproduction ratio: 0/100
 * 
 * NodeRacer: 17 / 100
 */

// header
console.log('iteration,runs,tool,benchmark,fails,firstfail');

runNodeRacer({
    iterations: 1,
    runs: 100,
    strategy: 'NodeRacer',
    strategyCommand: 'random',
    benchmarkName: 'get-port',
    benchmarkDir: `${benchmarkDir}/open-issues/get-port`,
    command: 'node triggerRace.js',
    errorMessage: ' already used',
    silent: false
});

runNodeRacer({
    iterations: 1,
    runs: 100,
    strategy: 'NodeRacer',
    strategyCommand: 'random',
    benchmarkName: 'get-port',
    benchmarkDir: `${benchmarkDir}/open-issues/get-port`,
    command: 'node fixedRace.js',
    errorMessage: ' already used',
    silent: false
});
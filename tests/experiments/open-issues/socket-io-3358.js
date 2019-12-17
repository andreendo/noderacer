const benchmarkDir = require('../benchmark_config')();
const runNodeRacer = require('../known-bugs/comparison-noderacer');

/**
 * For the original version: 
 * 
 * for i in `seq 1 100`; do echo $i; node race.js; sleep .5; done
 * 
 * Bug reproduction ratio: 100/100
 * 
 * We used NodeRacer to show that some interleaving produces the correct response
 * 
 * NodeRacer: 48 / 100 (48 out of 100 could provide the right answer)
 * 
 * For the proposed fix:
 * 
 * NodeRacer: 100 / 100 (100 out of 100 could provide the right answer)
 * 
 * 
 * - Change lines 107-108 of lib/socket.js to alter between the buggy and fixed versions
 */

// header
console.log('iteration,runs,tool,benchmark,fails,firstfail');

runNodeRacer({
    iterations: 1,
    runs: 100,
    strategy: 'NodeRacer',
    strategyCommand: 'random',
    benchmarkName: 'socket.io-client',
    benchmarkDir: `${benchmarkDir}/open-issues/socket.io-client`,
    command: 'node race.js',
    commandLog: 'node race.js -c noderacer-settings.json ',
    errorMessage: 'success',
    silent: false,
    noGlobal: true
});
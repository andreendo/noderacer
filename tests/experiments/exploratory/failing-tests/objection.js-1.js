/*
Original TC is not deterministic (use random numbers to set up timeouts). 
Therefore, the log and h-b phases are built on top of a run that it is not reproducible. 

To run it:
>> node tests/experiments/exploratory/failing-tests/<script-name>.js
*/
const benchmarkDir = require('../../benchmark_config')();
const runOneMochaTest = require('./runonemochatest');

runOneMochaTest({
    benchmarkFolder: `${benchmarkDir}/exploratory/objection.js`,
    runs: 100,
    strategy: 'random',  // 1-postpone-history (for diagnosis mode)
    checkInterleaving: true,
    file: `tests/unit/utils.js`,
    title: 'utils promiseUtils map should not start new operations after an error has been thrown', 
    parameters: '',
    settings: ''
});
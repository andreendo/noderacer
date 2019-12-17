/*
We refactored the test to removed the random timeouts but preserved the callback interleavings; 
no failure occurred in this case.

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
    title: 'utils promiseUtils map (Removing nondeterminism) should not start new operations after an error has been thrown', 
    parameters: '',
    settings: ''
});
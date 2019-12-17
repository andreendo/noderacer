/*
PR submitted: https://github.com/archiverjs/node-archiver/pull/388

The object hangs with a certain interleaving. 
Detailed description in the paper and the in the pull request.

To run it:
>> node tests/experiments/exploratory/failing-tests/<script-name>.js
*/
const benchmarkDir = require('../../benchmark_config')();
const runOneMochaTest = require('./runonemochatest');

runOneMochaTest({
    benchmarkFolder: `${benchmarkDir}/exploratory/node-archiver`,
    runs: 100,
    strategy: 'random',  // 1-postpone-history (for diagnosis mode)
    checkInterleaving: true,
    file: `test/archiver.js`,
    title: 'archiver api #errors should allow continue on stat failing', 
    parameters: '',
    settings: ''
});
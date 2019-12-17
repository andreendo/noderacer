/*
PR submitted: https://github.com/louischatriot/nedb/pull/610
Issue submitted: https://github.com/louischatriot/nedb/issues/609

Function ensureIndex() of Datastore.js is treated as sync, 
but it has an async cb when persistNewState() is called. 
Some interleaving may fail one assertion of the TC. 
There is also an inconsistency with the comments that states that it is a sync function.

To run it:
>> node tests/experiments/exploratory/failing-tests/<script-name>.js
*/
const benchmarkDir = require('../../benchmark_config')();
const runOneMochaTest = require('./runonemochatest');

runOneMochaTest({
    benchmarkFolder: `${benchmarkDir}/exploratory/nedb`,
    runs: 100,
    strategy: 'random',  // 1-postpone-history (for diagnosis mode)
    checkInterleaving: true,
    file: `test/db.test.js`,
    title: 'Database Using indexes ensureIndex and index initialization in database loading If a unique constraint is not respected, database loading will not work and no data will be inserted', 
    parameters: '',
    settings: ''
});
/*
Issue submitted: https://github.com/mongo-express/mongo-express/issues/499

The race is there and was temporarily patched with a timeout (that NodeRacer breaks).
The code has a comment indicating that the race is still there. 
Comments about this issue in https://github.com/mongo-express/mongo-express/pull/320 
and https://github.com/mongo-express/mongo-express/pull/315	

To run it:
>> node tests/experiments/exploratory/failing-tests/<script-name>.js
*/
const benchmarkDir = require('../../benchmark_config')();
const runOneMochaTest = require('./runonemochatest');

runOneMochaTest({
    benchmarkFolder: `${benchmarkDir}/exploratory/mongo-express`,
    runs: 100,
    strategy: 'random',  // 1-postpone-history (for diagnosis mode)
    checkInterleaving: true,
    file: `test/lib/routers/collectionSpec.js`,
    title: 'Router collection GET /db/<dbName>/<collection> should return html', 
    parameters: '',
    settings: ''
});
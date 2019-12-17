/*
Issue submitted: https://github.com/mongo-express/mongo-express/issues/500

It gives a different error: ""Admin database is not accessible
TypeError: Cannot read property 'listDatabases' of undefined"". 
Callback processOpenDatabase() can take long and a request arrive before it is called. 
In this case, router.js function (line 74) is called and function updateDatabases() 
is called with mongo.adminDb undefined.

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
    file: `test/lib/routers/databaseSpec.js`,
    title: 'Router database GET /db/<dbName> should return html', 
    parameters: '',
    settings: ''
});
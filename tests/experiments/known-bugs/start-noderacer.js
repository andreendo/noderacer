const benchmarkDir = require('../benchmark_config')();
const ITERATIONS = 30;  //number of repetitions/iterations (30 times used in the experiments) 
const RUNS = 100;       //number of runs for calculate bug reproduction ratio (100 used in experiments)
const runNodeRacer = require('./comparison-noderacer');

// To see the stdout of the tests, add property 'silent: false' to the object sent to function 'runNodeRacer'

// header
console.log('iteration,runs,tool,benchmark,fails,firstfail');

//------------------------------------------------------------------------------//
// #1 - AKA
runNodeRacer({
    iterations: ITERATIONS,
    runs: RUNS,
    strategy: 'NodeRacer',
    strategyCommand: 'random',
    benchmarkName: 'AKA',
    benchmarkDir: `${benchmarkDir}/known-bugs/agentkeepalive-23`,
    command: 'timeout 2 node fuzz_test/triggerRace.js',
    errorMessage: 'ECONNRESET'
});

//------------------------------------------------------------------------------//
// #2 - FPS
runNodeRacer({
    iterations: ITERATIONS,
    runs: RUNS,
    strategy: 'NodeRacer',
    strategyCommand: 'random',
    benchmarkName: 'FPS',
    benchmarkDir: `${benchmarkDir}/known-bugs/fiware-pep-steelskin`,
    command: './node_modules/.bin/mocha test/unit/race_simple.js --timeout 10000',
    errorMessage: '0 passing',
    logFileNumber: 2
});

//------------------------------------------------------------------------------//
// #3 - GHO
runNodeRacer({
    iterations: ITERATIONS,
    runs: RUNS,
    strategy: 'NodeRacer',
    strategyCommand: 'random',
    benchmarkName: 'GHO',
    benchmarkDir: `${benchmarkDir}/known-bugs/WhiteboxGhost`,
    command: 'node fuzz_test/add_mock.js',
    commandLog: 'node fuzz_test/add_mock.js -c fuzz_test/noderacer-settings.json',
    errorMessage: 'FAILURE'
});

//------------------------------------------------------------------------------//
// #4 - MKD
runNodeRacer({
    iterations: ITERATIONS,
    runs: RUNS,
    strategy: 'NodeRacer',
    strategyCommand: 'random',
    benchmarkName: 'MKD',
    benchmarkDir: `${benchmarkDir}/known-bugs/node-mkdirp`,
    command: 'node fuzz_test/race_subtle.js',
    errorMessage: 'Failed run'
});

//------------------------------------------------------------------------------//
// #5 - NES
runNodeRacer({
    iterations: ITERATIONS,
    runs: RUNS,
    strategy: 'NodeRacer',
    strategyCommand: 'random',
    benchmarkName: 'NES',
    benchmarkDir: `${benchmarkDir}/known-bugs/nes`,
    command: 'node_modules/lab/bin/lab -v test/client_TP.js',
    errorMessage: '1 of 1 tests failed'
});

//------------------------------------------------------------------------------//
// #6 - NLF
runNodeRacer({
    iterations: ITERATIONS,
    runs: RUNS,
    strategy: 'NodeRacer',
    strategyCommand: 'random',
    benchmarkName: 'NLF',
    benchmarkDir: `${benchmarkDir}/known-bugs/node-logger-file-1`,
    command: 'timeout 10 node fuzz_test/triggerRace.js 10',
    commandLog: 'node fuzz_test/triggerRace.js 10 -c noderacer-setttings.json',
    errorMessage: 'ERROR',
    silent: true
});

//------------------------------------------------------------------------------//
// #7 - SIO
runNodeRacer({
    iterations: ITERATIONS,
    runs: RUNS,
    strategy: 'NodeRacer',
    strategyCommand: 'random',
    benchmarkName: 'SIO',
    benchmarkDir: `${benchmarkDir}/known-bugs/socket.io-1862`,
    command: 'timeout 10 node fuzz_test/triggerRace.js',
    errorMessage: 'ERROR',
    silent: true
});

//------------------------------------------------------------------------------//
// #8 - DEL
runNodeRacer({
    iterations: ITERATIONS,
    runs: RUNS,
    strategy: 'NodeRacer',
    strategyCommand: 'random',
    benchmarkName: 'DEL',
    benchmarkDir: `${benchmarkDir}/known-bugs/del`,
    command: 'node testissue43.js',
    commandLog: 'node testissue43.js -c noderacer-setttings.json',
    errorMessage: 'Error: ENOENT:'
});

//------------------------------------------------------------------------------//
// #9 - LST
runNodeRacer({
    iterations: ITERATIONS,
    runs: RUNS,
    strategy: 'NodeRacer',
    strategyCommand: 'random',
    benchmarkName: 'LST',
    benchmarkDir: `${benchmarkDir}/known-bugs/linter-stylint`,
    command: 'node syntetic/test.js',
    errorMessage: 'showing wrong message:'
});

//------------------------------------------------------------------------------//
// #10 - NSC
runNodeRacer({
    iterations: ITERATIONS,
    runs: RUNS,
    strategy: 'NodeRacer',
    strategyCommand: 'random',
    benchmarkName: 'NSC',
    benchmarkDir: `${benchmarkDir}/known-bugs/node-simplecrawler-i298`,
    command: 'node merged-test.js',
    commandLog: 'node merged-test.js -c noderacer-setttings.json',
    errorMessage: 'no enough events performed before'
});

//------------------------------------------------------------------------------//
// #11 - XLS
runNodeRacer({
    iterations: ITERATIONS,
    runs: RUNS,
    strategy: 'NodeRacer',
    strategyCommand: 'random',
    benchmarkName: 'XLS',
    benchmarkDir: `${benchmarkDir}/known-bugs/xlsx-extract`,
    command: `./node_modules/mocha/bin/mocha test/tests.js -g 'should read all columns and rows'`,
    errorMessage: '0 passing',
    logFileNumber: 2,
    noGlobal: true
});
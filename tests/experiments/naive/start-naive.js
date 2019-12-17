// node tests/experiments/naive/start-naive.js > naive-bench.log 2>&1

const benchmarkDir = require('../benchmark_config')();
const ITERATIONS = 1;   //number of repetitions/iterations (1 time used in the experiments) 
const RUNS = 100;       //number of runs for calculate bug reproduction ratio (100 used in experiments)
const runNaiveRacer = require('./comparison-naive');

// header
console.log('iteration,runs,tool,benchmark,numberOfFails,numberOfFailuresWithHbViolations,numberOfRunsWithHbViolations,avgNeedlessPostpones,numOfCallbacks');

// Change property 'shouldRun' to false to not run some benchmarks

let benchmarks = [
    {
        // #1 - AKA
        shouldRun: true,
        iterations: ITERATIONS,
        runs: RUNS,
        strategy: 'NaiveRacer',
        strategyCommand: 'noHbRandom',
        benchmarkName: 'AKA',
        benchmarkDir: `${benchmarkDir}/known-bugs/agentkeepalive-23`,
        command: 'timeout 2 node fuzz_test/triggerRace.js',
        errorMessage: 'ECONNRESET',
        silent: false
    },
    {
        // #2 - FPS
        shouldRun: true,
        iterations: ITERATIONS,
        runs: RUNS,
        strategy: 'NaiveRacer',
        strategyCommand: 'noHbRandom',
        benchmarkName: 'FPS',
        benchmarkDir: `${benchmarkDir}/known-bugs/fiware-pep-steelskin`,
        command: './node_modules/.bin/mocha test/unit/race_simple.js --timeout 10000',
        errorMessage: '0 passing',
        logFileNumber: 2,
        silent: false
    },
    {
        // #3 - GHO
        shouldRun: true,
        iterations: ITERATIONS,
        runs: RUNS,
        strategy: 'NaiveRacer',
        strategyCommand: 'noHbRandom',
        benchmarkName: 'GHO',
        benchmarkDir: `${benchmarkDir}/known-bugs/WhiteboxGhost`,
        command: 'node fuzz_test/add_mock.js',
        commandLog: 'node fuzz_test/add_mock.js -c fuzz_test/noderacer-settings.json',
        errorMessage: 'FAILURE',
        silent: false
    },
    {
        // #4 - MKD
        shouldRun: true,
        iterations: ITERATIONS,
        runs: RUNS,
        strategy: 'NaiveRacer',
        strategyCommand: 'noHbRandom',
        benchmarkName: 'MKD',
        benchmarkDir: `${benchmarkDir}/known-bugs/node-mkdirp`,
        command: 'node fuzz_test/race_subtle.js',
        errorMessage: 'Failed run',
        silent: false
    },
    {
        // #5 - NES
        shouldRun: true,
        iterations: ITERATIONS,
        runs: RUNS,
        strategy: 'NaiveRacer',
        strategyCommand: 'noHbRandom',
        benchmarkName: 'NES',
        benchmarkDir: `${benchmarkDir}/known-bugs/nes`,
        command: 'node_modules/lab/bin/lab -v test/client_TP.js',
        errorMessage: '1 of 1 tests failed',
        silent: false
    },
    {
        // #6 - NLF
        // for this benchmark, set true to 'this.printAllTime' in lib/controller/strategies/noHbRandom.js
        shouldRun: true,
        iterations: ITERATIONS,
        runs: RUNS,
        strategy: 'NaiveRacer',
        strategyCommand: 'noHbRandom',
        benchmarkName: 'NLF',
        benchmarkDir: `${benchmarkDir}/known-bugs/node-logger-file-1`,
        command: 'timeout 10 node fuzz_test/triggerRace.js 10',
        commandLog: 'node fuzz_test/triggerRace.js 10 -c noderacer-setttings.json',
        errorMessage: 'ERROR',
        takeTheLast: true,
        silent: false
    },
    {
        // #7 - SIO
        // for this benchmark, set true to 'this.printAllTime' in lib/controller/strategies/noHbRandom.js
        shouldRun: true,
        iterations: ITERATIONS,
        runs: RUNS,
        strategy: 'NaiveRacer',
        strategyCommand: 'noHbRandom',
        benchmarkName: 'SIO',
        benchmarkDir: `${benchmarkDir}/known-bugs/socket.io-1862`,
        command: 'timeout 10 node fuzz_test/triggerRace.js',
        errorMessage: 'ERROR',
        takeTheLast: true,
        silent: false
    },
    {
        // #8 - DEL
        shouldRun: true,
        iterations: ITERATIONS,
        runs: RUNS,
        strategy: 'NaiveRacer',
        strategyCommand: 'noHbRandom',
        benchmarkName: 'DEL',
        benchmarkDir: `${benchmarkDir}/known-bugs/del`,
        command: 'node testissue43.js',
        commandLog: 'node testissue43.js -c noderacer-setttings.json',
        errorMessage: 'Error: ENOENT:',
        silent: false
    },
    {
        // #9 - LST
        shouldRun: true,
        iterations: ITERATIONS,
        runs: RUNS,
        strategy: 'NaiveRacer',
        strategyCommand: 'noHbRandom',
        benchmarkName: 'LST',
        benchmarkDir: `${benchmarkDir}/known-bugs/linter-stylint`,
        command: 'node syntetic/test.js',
        errorMessage: 'showing wrong message:',
        silent: false
    },
    {
        // #10 - NSC
        shouldRun: true,
        iterations: ITERATIONS,
        runs: RUNS,
        strategy: 'NaiveRacer',
        strategyCommand: 'noHbRandom',
        benchmarkName: 'NSC',
        benchmarkDir: `${benchmarkDir}/known-bugs/node-simplecrawler-i298`,
        command: 'node merged-test.js',
        commandLog: 'node merged-test.js -c noderacer-setttings.json',
        errorMessage: 'no enough events performed before',
        silent: false
    },
    {
        // #11 - XLS
        shouldRun: true,
        iterations: ITERATIONS,
        runs: RUNS,
        strategy: 'NaiveRacer',
        strategyCommand: 'noHbRandom',
        benchmarkName: 'XLS',
        benchmarkDir: `${benchmarkDir}/known-bugs/xlsx-extract`,
        command: `./node_modules/mocha/bin/mocha test/tests.js -g 'should read all columns and rows'`,
        errorMessage: '0 passing',
        logFileNumber: 2,
        noGlobal: true,
        silent: false
    }
];

benchmarks
    .filter(b => b.shouldRun)
    .forEach(b => runNaiveRacer(b));
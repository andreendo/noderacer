const benchmarkDir = require('../benchmark_config')();
const ITERATIONS = 30;  //number of repetitions/iterations (30 times used in the experiments) 
const RUNS = 100;       //number of runs for calculate bug reproduction ratio (100 used in experiments)
const runNodeFz = require('./comparison');

// To see the stdout of the tests, add property 'silent: false' to the object sent to function 'runNodeFz'

// header
console.log('iteration,runs,tool,benchmark,fails,firstfail');

let NODEFZ_COMMAND = `UV_THREADPOOL_SIZE=1 UV_SCHEDULER_TYPE=TP_FREEDOM UV_SCHEDULER_TP_DEG_FREEDOM=-1 UV_SCHEDULER_TP_MAX_DELAY=100 UV_SCHEDULER_TP_EPOLL_THRESHOLD=100 UV_SCHEDULER_TIMER_LATE_EXEC_TPERC=200 UV_SCHEDULER_IOPOLL_DEG_FREEDOM=-1 UV_SCHEDULER_IOPOLL_DEFER_PERC=10 UV_SCHEDULER_RUN_CLOSING_DEFER_PERC=5 UV_SILENT=1 UV_PRINT_SUMMARY=0 ${benchmarkDir}/NodeFz/out/Release/node`;

//------------------------------------------------------------------------------//
// #1 - AKA
runNodeFz({
    iterations: ITERATIONS,
    runs: RUNS,
    strategy: 'Node.fz',
    strategyCommand: NODEFZ_COMMAND,
    benchmarkName: 'AKA',
    benchmarkDir: `${benchmarkDir}/known-bugs/agentkeepalive-23`,
    command: 'fuzz_test/triggerRace.js',
    errorMessage: 'ECONNRESET'
});

//------------------------------------------------------------------------------//
// #2 - FPS
runNodeFz({
    iterations: ITERATIONS,
    runs: RUNS,
    strategy: 'Node.fz',
    strategyCommand: NODEFZ_COMMAND,
    benchmarkName: 'FPS',
    benchmarkDir: `${benchmarkDir}/known-bugs/fiware-pep-steelskin`,
    command: 'node_modules/.bin/mocha test/unit/race_simple.js --timeout 10000',
    errorMessage: '0 passing'
});

//------------------------------------------------------------------------------//
// #3 - GHO
runNodeFz({
    iterations: ITERATIONS,
    runs: RUNS,
    strategy: 'Node.fz',
    strategyCommand: NODEFZ_COMMAND,
    benchmarkName: 'GHO',
    benchmarkDir: `${benchmarkDir}/known-bugs/WhiteboxGhost`,
    command: 'fuzz_test/add_mock.js',
    errorMessage: 'FAILURE'
});

//------------------------------------------------------------------------------//
// #4 - MKD

runNodeFz({
    iterations: ITERATIONS,
    runs: RUNS,
    strategy: 'Node.fz',
    strategyCommand: NODEFZ_COMMAND,
    benchmarkName: 'MKD',
    benchmarkDir: `${benchmarkDir}/known-bugs/node-mkdirp`,
    command: 'fuzz_test/race_subtle.js',
    errorMessage: 'Failed run'
});

//------------------------------------------------------------------------------//
// #6 - NLF
let NODEFZ_COMMAND_CLF = `UV_THREADPOOL_SIZE=1 UV_SCHEDULER_TYPE=TP_FREEDOM UV_SCHEDULER_TP_DEG_FREEDOM=-1 UV_SCHEDULER_TP_MAX_DELAY=100 UV_SCHEDULER_TP_EPOLL_THRESHOLD=100 UV_SCHEDULER_TIMER_LATE_EXEC_TPERC=200 UV_SCHEDULER_IOPOLL_DEG_FREEDOM=-1 UV_SCHEDULER_IOPOLL_DEFER_PERC=10 UV_SCHEDULER_RUN_CLOSING_DEFER_PERC=5 UV_SILENT=1 UV_PRINT_SUMMARY=0 timeout 10 ${benchmarkDir}/NodeFz/out/Release/node`;

runNodeFz({
    iterations: ITERATIONS,
    runs: RUNS,
    strategy: 'Node.fz',
    strategyCommand: NODEFZ_COMMAND_CLF,
    benchmarkName: 'NLF',
    benchmarkDir: `${benchmarkDir}/known-bugs/node-logger-file-1`,
    command: 'fuzz_test/triggerRace.js 10',
    errorMessage: 'ERROR'
});

//------------------------------------------------------------------------------//
// #7 - SIO
let NODEFZ_COMMAND_SIO = `UV_THREADPOOL_SIZE=1 UV_SCHEDULER_TYPE=TP_FREEDOM UV_SCHEDULER_TP_DEG_FREEDOM=-1 UV_SCHEDULER_TP_MAX_DELAY=100 UV_SCHEDULER_TP_EPOLL_THRESHOLD=100 UV_SCHEDULER_TIMER_LATE_EXEC_TPERC=200 UV_SCHEDULER_IOPOLL_DEG_FREEDOM=-1 UV_SCHEDULER_IOPOLL_DEFER_PERC=10 UV_SCHEDULER_RUN_CLOSING_DEFER_PERC=5 UV_SILENT=1 UV_PRINT_SUMMARY=0 timeout 10 ${benchmarkDir}/NodeFz/out/Release/node`;
runNodeFz({
    iterations: ITERATIONS,
    runs: RUNS,
    strategy: 'Node.fz',
    strategyCommand: NODEFZ_COMMAND_SIO,
    benchmarkName: 'SIO',
    benchmarkDir: `${benchmarkDir}/known-bugs/socket.io-1862`,
    command: 'fuzz_test/triggerRace-orig.js',
    errorMessage: 'ERROR'
});

//------------------------------------------------------------------------------//
// #10 - simple-crawler

runNodeFz({
    iterations: ITERATIONS,
    runs: RUNS,
    strategy: 'Node.fz',
    strategyCommand: NODEFZ_COMMAND,
    benchmarkName: 'NSC',
    benchmarkDir: `${benchmarkDir}/known-bugs/node-simplecrawler-i298`,
    command: 'merged-test.js',
    errorMessage: 'no enough events performed before'
});

//------------------------------------------------------------------------------//
// #5 - NES
runNodeFz({
    iterations: ITERATIONS,
    runs: RUNS,
    strategy: 'Node.fz',
    strategyCommand: NODEFZ_COMMAND,
    benchmarkName: 'NES',
    benchmarkDir: `${benchmarkDir}/known-bugs/nes`,
    command: 'node_modules/lab/bin/lab -v test/client_TP.js',
    errorMessage: '1 of 1 tests failed',
    silent: false
});

// ERROR
// Node.fz shows an error:
// default run gives a segmentation fault
// message: Segmentation fault (core dumped)

//------------------------------------------------------------------------------//
// #8 - DEL
runNodeFz({
    iterations: ITERATIONS,
    runs: RUNS,
    strategy: 'Node.fz',
    strategyCommand: NODEFZ_COMMAND,
    benchmarkName: 'DEL',
    benchmarkDir: `${benchmarkDir}/known-bugs/del`,
    command: 'testissue43.js',
    errorMessage: 'Error: ENOENT:',
    silent: false
});

// ERROR
// Node.fz shows an error:
// node: ../deps/v8/src/isolate.cc:2678: void v8::internal::Isolate::RunMicrotasks(): Assertion `!"Isolate::RunMicrotasks: Not yet supported"' failed.
// Aborted (core dumped)

//------------------------------------------------------------------------------//
// #9 - LST
runNodeFz({
    iterations: ITERATIONS,
    runs: RUNS,
    strategy: 'Node.fz',
    strategyCommand: NODEFZ_COMMAND,
    benchmarkName: 'LST',
    benchmarkDir: `${benchmarkDir}/known-bugs/linter-stylint`,
    command: 'syntetic/test.js',
    errorMessage: 'showing wrong message:',
    silent: false
});

// ERROR
// Node.fz did not support new features of JavaScript integrated in newer versions of Node.js
// 
// Message:
// const { spawn } = require('child_process');
//       ^
// SyntaxError: Unexpected token {
//     at exports.runInThisContext (vm.js:53:16)
//     at Module._compile (module.js:413:25)
//     at Object.Module._extensions..js (module.js:452:10)
//     at Module.load (module.js:355:32)
//     at Function.Module._load (module.js:310:12)
//     at Module.require (module.js:365:17)
//     at require (module.js:384:17)
//     at Object.<anonymous> (/home/git/noderacer-benchmark/linter-stylint/syntetic/test.js:1:78)
//     at Module._compile (module.js:434:26)
//     at Object.Module._extensions..js (module.js:452:10)

//------------------------------------------------------------------------------//
// #11 - XLS
runNodeFz({
    iterations: ITERATIONS,
    runs: RUNS,
    strategy: 'Node.fz',
    strategyCommand: NODEFZ_COMMAND,
    benchmarkName: 'XLS',
    benchmarkDir: `${benchmarkDir}/known-bugs/xlsx-extract`,
    command: `node_modules/.bin/mocha test/tests.js -g 'should read all columns and rows'`,
    errorMessage: '0 passing',
    silent: false
});

// ERROR
// Node.fz did not support new features of JavaScript integrated in newer versions of Node.js
// 
// Message:
// :~/git/noderacer$ node tests/benchmarks/nodefz/start-nodefz.js
// /xlsx-extract/node_modules/mocha/bin/mocha:12
// const {deprecate, warn} = require('../lib/utils');
//       ^
// SyntaxError: Unexpected token {
//     at exports.runInThisContext (vm.js:53:16)
//     at Module._compile (module.js:413:25)
//     at Object.Module._extensions..js (module.js:452:10)
//     at Module.load (module.js:355:32)
//     at Function.Module._load (module.js:310:12)
//     at Function.Module.runMain (module.js:475:10)
//     at startup (node.js:117:18)
//     at node.js:952:3
// /home/git/noderacer-benchmark/xlsx-extract/node_modules/mocha/bin/mocha:12
// const {deprecate, warn} = require('../lib/utils');
//       ^
// SyntaxError: Unexpected token {
//     at exports.runInThisContext (vm.js:53:16)
//     at Module._compile (module.js:413:25)
//     at Object.Module._extensions..js (module.js:452:10)
//     at Module.load (module.js:355:32)
//     at Function.Module._load (module.js:310:12)
//     at Function.Module.runMain (module.js:475:10)
//     at startup (node.js:117:18)
//     at node.js:952:3
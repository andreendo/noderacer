const benchmarkDir = require('../benchmark_config')();
const runNodeFz = require('../known-bugs/comparison');

/**
 * for i in `seq 1 100`; do echo $i; node race.js; sleep .5; done
 *  
 * Node Vanilla - errors for most runs
 * 
 * NodeRacer: 72 / 100 (28 passing)
 * NodeFz: 28 / 100
 * 
 * Fixed version
 * 
 * Node Vanilla - Bug reproduction ratio: 0 / 100
 * 
 * NodeRacer (fixed version): 0 / 100 
 * 
 * --Inversed case
 * 
 * for i in `seq 1 100`; do echo $i; node race-inverse-case.js; sleep .5; done
 * 
 * NodeRacer (fixed version):  / 100 
 */

// This project has two versions: buggy (timers.js.ORIG) and fixed (timers.js.FIXED)
// To run the buggy version, run the following command at the root of the project: 
// > cp node_modules/bluebird/js/release/timers.js.ORIG node_modules/bluebird/js/release/timers.js
// 
// To run the fixed version, run the following command at the root of the project: 
// > cp node_modules/bluebird/js/release/timers.js.FIXED node_modules/bluebird/js/release/timers.js

let NODEFZ_COMMAND = `UV_THREADPOOL_SIZE=1 UV_SCHEDULER_TYPE=TP_FREEDOM UV_SCHEDULER_TP_DEG_FREEDOM=-1 UV_SCHEDULER_TP_MAX_DELAY=100 UV_SCHEDULER_TP_EPOLL_THRESHOLD=100 UV_SCHEDULER_TIMER_LATE_EXEC_TPERC=200 UV_SCHEDULER_IOPOLL_DEG_FREEDOM=-1 UV_SCHEDULER_IOPOLL_DEFER_PERC=10 UV_SCHEDULER_RUN_CLOSING_DEFER_PERC=5 UV_SILENT=1 UV_PRINT_SUMMARY=0 ${benchmarkDir}/NodeFz/out/Release/node`;

// header
console.log('iteration,runs,tool,benchmark,fails,firstfail');

runNodeFz({
    iterations: 1,
    runs: 10,
    strategy: 'Node.fz',
    strategyCommand: NODEFZ_COMMAND,
    benchmarkName: 'Bluebird',
    benchmarkDir: `${benchmarkDir}/open-issues/bluebird-2`,
    command: 'race.js',
    errorMessage: 'timed out',
    silent: false
});
const shell = require('shelljs');
const glob = require('glob');

function runNaiveRacer(args) {
    args.commandLog = args.commandLog || args.command;
    args.logFileNumber = args.logFileNumber || 1;
    args.noGlobal = args.noGlobal ? '--ng' : '';
    if (args.silent === undefined) args.silent = true;
    args.takeTheLast = args.takeTheLast || false;

    shell.cd(`${args.benchmarkDir}`);

    for (let i = 1; i <= args.iterations; i++)
        runIteration(i, args);
}

function runIteration(iteration, args) {
    let output = [];
    output.push(iteration, args.runs, args.strategy, args.benchmarkName);
    let numberOfFails = 0, numberOfRunsWithHbViolations = 0, numberOfFailuresWithHbViolations = 0;
    let numOfCallbacks = 0, avgNeedlessPostpones = 0;

    shell.rm('-R', 'log');

    // observation
    shell.exec(`noderacer log ${args.commandLog}`, { silent: args.silent });
    
    // hb
    let hbfile;
    glob.sync(`log/*/noderacer${args.logFileNumber}.log.json`).forEach(logfile => {
        shell.exec(`noderacer hb ${logfile} -i ${args.noGlobal}`, { silent: args.silent });
        hbfile = logfile.replace('.log.json', '.hb.json');
    });

    for (let i = 1; i <= args.runs; i++) {
        // control
        let execOut = shell.exec(`noderacer control -s ${args.strategyCommand} -r 1 -h ${hbfile} ${args.command}`, { silent: args.silent });
        let cInfo;
        if (args.takeTheLast)
            cInfo = extractCollectedInfoLast(execOut.stdout);
        else
            cInfo = extractCollectedInfo(execOut.stdout);
        console.log(cInfo);
        numOfCallbacks = cInfo.callbacks;
        avgNeedlessPostpones += cInfo.needlessPostpones;

        if (cInfo.hbViolations > 0)
            numberOfRunsWithHbViolations++;

        if (execOut.stdout.includes(args.errorMessage) || execOut.code === 124) {
            numberOfFails++;
            if (cInfo.hbViolations > 0)
                numberOfFailuresWithHbViolations++;
        }
        shell.exec(`sleep 0.5`);
    }
    avgNeedlessPostpones = avgNeedlessPostpones / args.runs;
    output.push(numberOfFails, numberOfFailuresWithHbViolations, numberOfRunsWithHbViolations);
    output.push(avgNeedlessPostpones, numOfCallbacks);
    console.log(output.join(','));
}

function extractCollectedInfo(output) {
    let part = output.split('#NR#')[1];
    part = part.trim().replace('needless-postpones:', '');
    part = part.replace('hb-violations:', '');
    part = part.replace('callbacks:', '');
    part = part.split(',');
    return {
        needlessPostpones: Number(part[0]),
        hbViolations: Number(part[1]),
        callbacks: Number(part[2])
    };
}

function extractCollectedInfoLast(output) {
    let part = output.split('#NR#');
    if (part.length === 1)
    return {
        needlessPostpones: 0,
        hbViolations: 0,
        callbacks: 0
    };

    part = part[part.length - 1];
    part = part.trim().replace('needless-postpones:', '');
    part = part.replace('hb-violations:', '');
    part = part.replace('callbacks:', '');
    part = part.split(',');
    return {
        needlessPostpones: Number(part[0]),
        hbViolations: Number(part[1]),
        callbacks: Number(part[2])
    };
}

module.exports = runNaiveRacer;
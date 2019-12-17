const shell = require('shelljs');
const glob = require('glob');

function runNodeRacer(args) {
    args.commandLog = args.commandLog || args.command;
    args.logFileNumber = args.logFileNumber || 1;
    args.noGlobal = args.noGlobal ? '--ng' : '';
    if (args.silent === undefined) args.silent = true;

    shell.cd(`${args.benchmarkDir}`);

    for (let i = 1; i <= args.iterations; i++)
        runIteration(i, args);
}

function runIteration(iteration, args) {
    let output = [];
    output.push(iteration, args.runs, args.strategy, args.benchmarkName);
    let numberOfFails = 0;
    let firstFail = 0;
    shell.rm('-R', 'log');

    // observation
    shell.exec(`noderacer log ${args.commandLog}`, { silent: args.silent });
    
    // hb
    let hbfile;
    glob.sync(`log/*/noderacer${args.logFileNumber}.log.json`).forEach(logfile => {
        shell.exec(`noderacer hb ${logfile} ${args.noGlobal} -i`, { silent: args.silent });
        hbfile = logfile.replace('.log.json', '.hb.json');
    });

    for (let i = 1; i <= args.runs; i++) {
        // guided execution
        let execOut = shell.exec(`noderacer control -s ${args.strategyCommand} -r 1 -h ${hbfile} ${args.command}`, { silent: args.silent });
        if (execOut.stdout.includes(args.errorMessage) || execOut.code === 124) {
            numberOfFails++;
            if (firstFail === 0)
                firstFail = i;
        }
        shell.exec(`sleep 0.5`);
    }
    output.push(numberOfFails, firstFail);
    console.log(output.join(','));
}

module.exports = runNodeRacer;
const shell = require('shelljs');

function runNodeFz(args) {
    args.preCommand = args.preCommand || '';
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
    for (let i = 1; i <= args.runs; i++) {
        // console.log(`${args.strategyCommand} ${args.command}`);
        let execOut = shell.exec(`${args.preCommand} ${args.strategyCommand} ${args.command}`, { silent: args.silent });
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

module.exports = runNodeFz;
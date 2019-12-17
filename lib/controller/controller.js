const Runner = require('./runner');

const fs = require('fs');
const path = require('path');

let strategies = ['random', 'noPostpone', '1-postpone-history', 'noHbRandom'];

function controller(args) {
    // arguments' validation
    if (!strategies.find((s) => s === args.strategy))
        throw 'inexistent strategy';
    if (!Number.isInteger(args.runs) || args.runs <= 0)
        throw 'invalid number of runs';
    if (!fs.existsSync(args.file))
        throw `file ${args.file} does not exist.`;

    args.file = path.resolve(args.file);
    let logDir = path.dirname(args.file);
    let runner = new Runner(args.file, args.runs, args.command, logDir,  args.strategy);
    runner.start();
}

module.exports = controller;
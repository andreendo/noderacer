const wrapper = require.resolve('./controlwrap.js');
const { determineUniquePathName, createDir } = require('../util/utils');

const path = require('path');
const foreground = require('foreground-child');
const sw = require('spawn-wrap');

class Runner {
    constructor(hbfile, runs, command, logDir, strategy) {
        this.hbfile = hbfile;
        this.runs = runs;
        this.command = command;
        this.origLogDir = logDir;
        this.logDir = determineUniquePathName(logDir, 'exec');
        this.strategy = strategy;
    }

    start() {
        console.log('Strategy: ' + this.strategy);
        console.log('Command: ' + this.command.join(' '));
        console.log('Runs: ' + this.runs);
        console.log('Log dir: ' + this.logDir);

        createDir(this.logDir);
        this.memoryPath = path.join(this.origLogDir, 'memory.json');
        process.setMaxListeners(0); //remove warning
        this.unwrap = null;
        this.run(1, this.runs);
    }

    run(current, times) {
        if (current <= times) {
            let p = new Promise((resolve, reject) => {  // eslint-disable-line no-unused-vars
                if (this.unwrap)
                    this.unwrap();

                this.unwrap = sw([wrapper], {
                    run: current,
                    logDir: this.logDir,
                    hbfile: this.hbfile,
                    strategy: this.strategy,
                    memory: this.memoryPath
                });
                foreground(this.command, () => {
                    resolve();
                });
            });
            p.then(() => {
                this.run(current + 1, times);
            });
        }
    }
}

module.exports = Runner;
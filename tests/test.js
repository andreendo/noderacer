const glob = require('glob');
const shell = require('shelljs');

const NODERACER = './lib/cli/cli.js';
const expectedErrors = [`open 'tmp.txt'`, `change-2 not in file`, `2 msgs expected`];

describe('NodeRacer - Micro-benchmark', function () {
    glob.sync('./tests/micro-benchmark/*/*-test.js').forEach(function (test) {
        describe(test, function () {
            it('observation', function () {
                this.timeout(5000);
                shell.exec(`rm -R log`, { silent: true });
                let exec = shell.exec(`${NODERACER} log node ${test}`, { silent: true });
                if (exec.stderr) throw 'error in observation';
            });

            it('happens-before', function () {
                let logFile = glob.sync('./log/*/*.log.json')[0];
                let exec = shell.exec(`${NODERACER} hb ${logFile} -i`, { silent: true });
                if (exec.stderr) throw 'error in happens-before';
            });

            it('guided execution', function () {
                this.timeout(50000);
                let hbFile = glob.sync('./log/*/*.hb.json')[0];
                let stderr = shell.exec(`${NODERACER} control -s random -r 10 -h ${hbFile} node ${test}`, { silent: true }).stderr;
                if (stderr) {
                    let hasError = expectedErrors.find((error) => stderr.includes(error));
                    if (!hasError) throw 'error in guided execution';
                }
            });
        });
    });
});
const shell = require('shelljs');
const glob = require('glob');
const path = require('path');

function runOneMochaTest(t) {
    t.status = [];
    t.file = path.join(t.benchmarkFolder, t.file);
    shell.cd(`${t.benchmarkFolder}`);
    shell.rm('-R', 'log');

    let pure_command = `mocha --exit -t 20000 -R spec ${t.parameters} ${t.file} -f "${sanitize(t.title)}"`;
    let log_command = `noderacer log ${pure_command} ${t.settings}`;

    try {
        let execOut = shell.exec(log_command, { silent: false });
        if (execOut.stdout.includes('0 passing'))
            t.status.push('fail in log');
        else {
            glob.sync('log/*/noderacer*.log.json').forEach(hbfile => {
                let hb_command = `timeout 60 noderacer hb ${hbfile} -i --ng`;
                let execOut = shell.exec(hb_command, { silent: false });
                if (execOut.code === 124 || execOut.code === 134) { //timeout
                    //try with no globals
                    let hb_command2 = `timeout 60 noderacer hb ${hbfile} -i --ng`;
                    let execOut = shell.exec(hb_command2, { silent: false });
                    if (execOut.code === 124 || execOut.code === 134) //timeout
                        t.status.push('timeout without global');
                    else
                        runControlPhase(t, pure_command, hbfile.replace('.log.json', '.hb.json'), t.runs);
                }
                else
                    runControlPhase(t, pure_command, hbfile.replace('.log.json', '.hb.json'), t.runs);
            });
        }
    } catch (error) {
        t.status.push('exception launched');
    }

    console.log(t);
}

function sanitize(str) {
    str = str.replace(/`/g, '\\`');
    str = str.replace(/"/g, '\\"');
    str = str.replace(/\$/g, '\\$');
    return str;
}

function runControlPhase(t, command, hbfile, times) {
    let susp_command = `noderacer susp ${hbfile} -m cmio`;
    let execOut = shell.exec(susp_command, { silent: false });
    if (execOut.stdout.includes('CMIO: 0.00') && t.checkInterleaving)     // check for interleavings
        t.status.push('no interleaving');
    else {
        let control_command = `noderacer control -s ${t.strategy} -r ${times} -h ${hbfile} ${command}`;
        let execOut = shell.exec(control_command, { silent: false });
        if (execOut.stdout.includes('0 passing')) {
            t.status.push('fail TC');
            t.fails = execOut.stdout.match(/0 passing/g).length;
        }
        else {
            t.status.push('success');
            t.fails = 0;
        }
    }
}

module.exports = runOneMochaTest;
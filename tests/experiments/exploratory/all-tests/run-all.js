const shell = require('shelljs');
const fs = require('fs');
const glob = require('glob');

function runAll(project, parameters, benchmarkDir, logSeettings) {
    logSeettings = logSeettings || '';
    shell.cd(`${benchmarkDir}/${project}`);

    let tc = JSON.parse(fs.readFileSync(`nr-passing-tcs-4-control.json.log`, 'utf8'));
    let consideredTests = tc.filter(t => t.status && t.status.includes('success'));
    let projStats = {
        name: project,
        consideredTests: consideredTests.length,
        testsWithInterleaving: 0,
        successfulTests: 0,
        failingTests: 0
    };

    consideredTests.forEach(t => {
        console.log('file: ' + t.file);
        console.log('title: ' + t.title);
        shell.rm('-R', 'log');
        let pure_command = `mocha --exit -t 20000 -R spec ${parameters} ${t.file} -f "${sanitize(t.title)}"`;
        let command = `noderacer log ${pure_command} ${logSeettings}`;

        t.status = [];
        try {
            let execOut = shell.exec(command, { silent: true });
            if (execOut.stdout.includes('0 passing')) {
                t.status.push('fail in log');
            }
            else {
                //H-B
                glob.sync('log/*/noderacer*.log.json').forEach(hbfile => {
                    let hb_command = `timeout 30 noderacer hb ${hbfile}`;
                    let execOut = shell.exec(hb_command, { silent: false });
                    if (execOut.code === 124) { //timeout
                        //try with no globals
                        let hb_command2 = `timeout 60 noderacer hb ${hbfile} --ng`;
                        let execOut = shell.exec(hb_command2, { silent: false });
                        if (execOut.code === 124) //timeout
                            t.status.push('timeout without global');
                        else {
                            runControlPhase(t, pure_command, hbfile.replace('.log.json', '.hb.json'), projStats);
                        }
                    }
                    else {
                        runControlPhase(t, pure_command, hbfile.replace('.log.json', '.hb.json'), projStats);
                    }
                });
            }
        } catch (error) {
            t.status.push('exception launched');
        }
    });
    console.log(`-------------------------------------`);
    console.log(projStats);
}

function sanitize(str) {
    str = str.replace(/`/g, '\\`');
    str = str.replace(/"/g, '\\"');
    str = str.replace(/\$/g, '\\$');

    return str;
}

function runControlPhase(t, command, hbfile, projStats) {
    // check for interleavings
    let susp_command = `noderacer susp ${hbfile} -m cmio`;
    let execOut = shell.exec(susp_command, { silent: false });
    if (execOut.stdout.includes('CMIO: 0.00')) {
        t.status.push('no interleaving');
    }
    else {
        projStats.testsWithInterleaving++;

        let control_command = `noderacer control -s random -r 100 -h ${hbfile} ${command}`;
        let execOut = shell.exec(control_command, { silent: false });
        if (execOut.stdout.includes('0 passing')) {
            projStats.failingTests++;
            t.status.push('fail TC');
            t.fails = execOut.stdout.match(/0 passing/g).length;
        }
        else {
            projStats.successfulTests++;
            t.status.push('success');
            t.fails = 0;
        }
    }
}

module.exports = runAll;
const shell = require('shelljs');
const fs = require('fs');
const glob = require('glob');

const BENCHMARK_FOLDER = '/downloads/benchmarks';
const PROJECTS_FILE = './tests/benchmarks/filtering/exploratory/res/projects-used.txt';

fs.readFileSync(PROJECTS_FILE, 'utf-8').split('\n').forEach(line => {
    line = line.split(',');
    let project = line[0], parameters = line[1] || '';

    shell.cd(`${BENCHMARK_FOLDER}/${project}`);

    let tc = JSON.parse(fs.readFileSync(`nr-passing-tcs-4-hb.json.log`, 'utf8'));
    let consideredTests = tc.filter(t => t.status && t.status.startsWith('success'));
    console.log(`-------------------------------------`);
    console.log(`${project}: ${consideredTests.length}`);

    consideredTests.forEach(t => {
        shell.rm('-R', 'log');
        let pure_command = `mocha --exit -t 20000 -R spec ${parameters} ${t.file} -f "${sanitize(t.title)}"`;
        let command = `noderacer log ${pure_command}`;

        console.log('TC: ', t.file, t.title);
        t.status = [];
        try {
            let execOut = shell.exec(command, { silent: true });
            if (execOut.stdout.includes('0 passing')) {
                t.status.push('fail in log');
            }
            else {
                //H-B
                glob.sync('log/*/noderacer*.log.json').forEach(hbfile => {
                    let hb_command = `timeout 60 noderacer hb ${hbfile} -i`;
                    let execOut = shell.exec(hb_command, { silent: false });
                    if (execOut.code === 124) { //timeout
                        //try with no globals
                        let hb_command2 = `timeout 60 noderacer hb ${hbfile} -i --ng`;
                        let execOut = shell.exec(hb_command2, { silent: false });
                        if (execOut.code === 124) //timeout
                            t.status.push('timeout without global');
                        else {
                            // t.status.push('success without global');

                            // RUN CONTROL PHASE
                            runControlPhase(t, pure_command, hbfile.replace('.log.json', '.hb.json'));
                        }

                    }
                    else {
                        // t.status.push('success with global');

                        // RUN CONTROL PHASE
                        runControlPhase(t, pure_command, hbfile.replace('.log.json', '.hb.json'));
                    }


                });
            }
        } catch (error) {
            t.status.push('exception launched');
        }
        console.log(t.status);
    });

    fs.writeFileSync('nr-passing-tcs-4-control.json.log', JSON.stringify(tc, null, 4), 'utf8');
});

function sanitize(str) {
    str = str.replace(/`/g, '\\`');
    str = str.replace(/"/g, '\\"');
    str = str.replace(/\$/g, '\\$');

    return str;
}

function runControlPhase(t, command, hbfile) {
    let control_command = `noderacer control -s noPostpone -r 1 -h ${hbfile} ${command}`;
    let execOut = shell.exec(control_command, { silent: false });
    if (execOut.stdout.includes('0 passing')) {
        t.status.push('fail TC');
    }
    else {
        if (execOut.stdout.includes('1 passing') ||
            execOut.stdout.includes('2 passing') || 
            execOut.stdout.includes('3 passing'))
            t.status.push('success');
        else
            t.status.push('fail error');
    }
}
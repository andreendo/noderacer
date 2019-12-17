const shell = require('shelljs');
const fs = require('fs');
const glob = require('glob');

const BENCHMARK_FOLDER = '/downloads/benchmarks';
const PROJECTS_FILE = './tests/benchmarks/exploratory/filtering/res/projects-used.txt';

fs.readFileSync(PROJECTS_FILE, 'utf-8').split('\n').forEach(line => {
    line = line.split(',');
    let project = line[0], parameters = line[1] || '';

    shell.cd(`${BENCHMARK_FOLDER}/${project}`);

    let tc = JSON.parse(fs.readFileSync(`nr-passing-tcs-4-log.json.log`, 'utf8'));
    let consideredTests = tc.filter(t => t.runIsolated && t.log);
    console.log(`-------------------------------------`);
    console.log(`${project}: ${consideredTests.length}`);
    let errors = 0;
    consideredTests.forEach(t => {
        shell.rm('-R', 'log');
        let command = `noderacer log mocha --exit -t 20000 -R spec ${parameters} ${t.file} -f "${sanitize(t.title)}"`;
        console.log('TC: ', t.file, t.title);
        try {
            let execOut = shell.exec(command, { silent: true });
            if (execOut.stdout.includes('0 passing')) {
                t.status = 'fail in log';
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
                            t.status = 'timeout without global';
                        else
                            t.status = 'success without global';
                    }
                    else
                        t.status = 'success with global';

                });
            }
        } catch (error) {
            t.status = 'exception launched';
        }
        console.log(t.status);
        if (t.status && !t.status.startsWith('success'))
            errors++;
    });
    console.log(errors);
    fs.writeFileSync('nr-passing-tcs-4-hb.json.log', JSON.stringify(tc, null, 4), 'utf8');
});

function sanitize(str) {
    str = str.replace(/`/g, '\\`');
    str = str.replace(/"/g, '\\"');
    str = str.replace(/\$/g, '\\$');

    return str;
}

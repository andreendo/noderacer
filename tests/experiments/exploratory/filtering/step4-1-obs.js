const shell = require('shelljs');
const fs = require('fs');

const BENCHMARK_FOLDER = '/downloads/benchmarks';
const PROJECTS_FILE = './tests/benchmarks/exploratory/filtering/res/projects-used.txt';

fs.readFileSync(PROJECTS_FILE, 'utf-8').split('\n').forEach(line => {
    line = line.split(',');
    let project = line[0], parameters = line[1] || '';

    shell.cd(`${BENCHMARK_FOLDER}/${project}`);
    shell.rm('-R', 'log');

    let tc = JSON.parse(fs.readFileSync(`nr-passing-tcs-3.json.log`, 'utf8'));
    console.log(`${project}: ${tc.length}`);
    let errors = 0;
    tc.filter(t => t.runIsolated).forEach(t => {
        let command = `noderacer log mocha --exit -t 20000 -R spec ${parameters} ${t.file} -f "${sanitize(t.title)}"`;
        t.log = true;
        try {
            let execOut = shell.exec(command, { silent: true });
            if (execOut.stdout.includes('0 passing')) {
                errors++;
                t.log = false;
                console.log(command);
                console.log(execOut.stdout);
            }
        } catch (error) {
            errors++;
            t.log = false;
        }
    });
    console.log(errors);
    fs.writeFileSync('nr-passing-tcs-4-log.json.log', JSON.stringify(tc, null, 4), 'utf8');
});

function sanitize(str) {
    str = str.replace(/`/g, '\\`');
    str = str.replace(/"/g, '\\"');
    str = str.replace(/\$/g, '\\$');

    return str;
}

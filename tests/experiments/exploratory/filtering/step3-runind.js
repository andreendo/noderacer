const shell = require('shelljs');
const fs = require('fs');

const BENCHMARK_FOLDER = '/downloads/benchmarks';
const PROJECTS_FILE = './tests/benchmarks/exploratory/filtering/res/projects-used.txt';

fs.readFileSync(PROJECTS_FILE, 'utf-8').split('\n').forEach(line => {
    line = line.split(',');
    let project = line[0], parameters = line[1] || '';

    shell.cd(`${BENCHMARK_FOLDER}/${project}`);

    let tc = JSON.parse(fs.readFileSync(`nr-passing-tcs.json.log`, 'utf8'));
    console.log(`${project}: ${tc.length}`);
    let errors = 0;
    tc.forEach(t => {
        let command = `mocha --exit -R spec ${parameters} ${t.file} -f "${sanitize(t.title)}"`;
        t.runIsolated = true;

        try {
            let execOut = shell.exec(command, { silent: true });
            if (execOut.stdout.includes('0 passing')) {
                t.runIsolated = false;
                errors++;
                console.log(command);
                console.log(execOut.stdout);
            }    
        }catch(error) {
            t.runIsolated = false;
            errors++;
        }
    });
    console.log(errors);
    fs.writeFileSync('nr-passing-tcs-3.json.log', JSON.stringify(tc, null, 4), 'utf8');
});

function sanitize(str) {
    str = str.replace(/`/g, '\\`');
    str = str.replace(/"/g, '\\"');
    str = str.replace(/\$/g, '\\$');

    return str;
}
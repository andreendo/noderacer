const shell = require('shelljs');
const fs = require('fs');

const BENCHMARK_FOLDER = '/downloads/benchmarks';
const PROJECTS_FILE = './tests/benchmarks/exploratory/filtering/res/projects-used.txt';

console.log(`app,#TCs,#IsolatedTCs,#WithLogTCs`);
fs.readFileSync(PROJECTS_FILE, 'utf-8').split('\n').forEach(line => {
    line = line.split(',');
    let project = line[0];

    shell.cd(`${BENCHMARK_FOLDER}/${project}`);

    try {
        let tc = JSON.parse(fs.readFileSync(`nr-passing-tcs-4-log.json.log`, 'utf8'));
        let succ = tc.filter(t => t.runIsolated).length;
        let succ_log = tc.filter(t => t.runIsolated && t.log).length;
        // t.log;
        console.log(`${project},${tc.length},${succ},${succ_log}\n`);    
    }
    catch(error) {
        console.log(`${project},,,\n`);    
    }
});
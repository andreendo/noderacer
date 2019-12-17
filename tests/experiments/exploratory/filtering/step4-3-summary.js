const shell = require('shelljs');
const fs = require('fs');

const BENCHMARK_FOLDER = '/downloads/benchmarks';
const PROJECTS_FILE = './tests/benchmarks/exploratory/filtering/res/projects-used.txt';

console.log(`app,#TCs,#SuccLog,#SuccGlobal,#SuccNoGlobal,#FailTimeout,#SuccHB`);
fs.readFileSync(PROJECTS_FILE, 'utf-8').split('\n').forEach(line => {
    line = line.split(',');
    let project = line[0];

    shell.cd(`${BENCHMARK_FOLDER}/${project}`);

    try {
        let tc = JSON.parse(fs.readFileSync(`nr-passing-tcs-4-control.json.log`, 'utf8'));
        let considered = tc.filter(t => t.status).length;
        let succ = tc.filter(t => t.status && t.status.includes('success')).length;
        console.log(`${project},${tc.length},${considered},${succ}\n`);    
    }
    catch(error) {
        console.log(`${project},,,\n`);    
    }
});
const shell = require('shelljs');
const fs = require('fs');

const BENCHMARK_FOLDER = '/downloads/benchmarks';
const PROJECTS_FILE = './tests/benchmarks/exploratory/filtering/res/projects-used.txt';

console.log(`app,#TCs,#SuccessIsolatedTCs,#FailIsolatedTCs`);
fs.readFileSync(PROJECTS_FILE, 'utf-8').split('\n').forEach(line => {
    line = line.split(',');
    let project = line[0];

    shell.cd(`${BENCHMARK_FOLDER}/${project}`);

    let tc = JSON.parse(fs.readFileSync(`nr-passing-tcs-3.json.log`, 'utf8'));
    let succ = tc.filter(t => t.runIsolated).length;
    let fail = tc.length - succ;
    console.log(`${project},${tc.length},${succ},${fail}\n`);
});
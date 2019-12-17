const shell = require('shelljs');
const fs = require('fs');

const BENCHMARK_FOLDER = '/downloads/benchmarks';
const PROJECTS_FILE = './tests/benchmarks/exploratory/filtering/res/projects-used.txt';

let projs = [];

fs.readFileSync(PROJECTS_FILE, 'utf-8').split('\n').forEach(line => {
    line = line.split(',');
    let project = line[0];

    shell.cd(`${BENCHMARK_FOLDER}/${project}`);
    let tc = JSON.parse(fs.readFileSync(`nr-passing-tcs.json.log`, 'utf8'));
    projs.push(tc);
    console.log(`${project}: ${tc.length}`);
});

console.log(projs.reduce((acc, tc) => acc + tc.length, 0));
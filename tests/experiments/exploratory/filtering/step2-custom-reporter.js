// It runs Mocha with a customized report 

const shell = require('shelljs');
const fs = require('fs');

const BENCHMARK_FOLDER = '/downloads/benchmarks';
const PROJECTS_FILE =   './tests/benchmarks/exploratory/filtering/res/projects-1-passed.txt';
// const PROJECTS_FILE = './tests/benchmarks/exploratory/filtering/res/projects-1-1-command.txt';
const CUSTOM_REPORTER = `./tests/benchmarks/exploratory/filtering/mochaReporter.js`;

fs.readFileSync(PROJECTS_FILE, 'utf-8').split('\n').forEach(line => {
    line = line.split(',');
    let project = line[0], parameters = line[1] || '';

    shell.cd(`${BENCHMARK_FOLDER}/${project}`);
    console.log(`processing project: ${project}`);
    let out = shell.exec(`mocha --exit -R ${CUSTOM_REPORTER} ${parameters}`, { silent: false });
});
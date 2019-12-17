// It checks if the projects run with a vanilla Mocha test runner
// Some projects have some parameters that need to be provided to Mocha

const shell = require('shelljs');
const fs = require('fs');

const BENCHMARK_FOLDER = '/downloads/benchmarks';
// const PROJECTS_FILE = './tests/benchmarks/exploratory/filtering/res/projects-1-passed.txt';
const PROJECTS_FILE = './tests/benchmarks/exploratory/filtering/res/projects-1-1-command.txt';
const OUTPUT_FILE =   './tests/benchmarks/exploratory/filtering/res/output-1-command.txt'

fs.writeFileSync(OUTPUT_FILE, '');

let passed = 0, failed = 0;

fs.readFileSync(PROJECTS_FILE, 'utf-8').split('\n').forEach(line => {
    line = line.split(',');
    let project = line[0], parameters = line[1];
    shell.cd(`${BENCHMARK_FOLDER}/${project}`);

    let out = shell.exec(`mocha --exit -R spec ${parameters}`, { silent: false });
    let specOutput = out.stdout.includes('passing') || out.stdout.includes('failing');
    if (specOutput)
        passed++;
    else
        failed++;

    let toPrint = `${project},${out.code},${out.code === 0},${specOutput}\n`;
    console.log(toPrint);
    fs.appendFileSync(OUTPUT_FILE, toPrint, 'utf-8')
});

console.log(`passed: ${passed}, failed: ${failed}`);
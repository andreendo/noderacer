// It runs `npm test` and marks the projects that failed

const shell = require('shelljs');
const fs = require('fs');

const BENCHMARK_FOLDER = '/downloads/benchmarks';
const PROJECTS_FILE = './tests/benchmarks/exploratory/filtering/res/projects.txt';
const OUTPUT_FILE = './tests/benchmarks/exploratory/filtering/res/output-step1-1.txt'

fs.writeFileSync(OUTPUT_FILE, '');

let passed = 0, failed = 0;

fs.readFileSync(PROJECTS_FILE, 'utf-8').split('\n').forEach((project, index) => {
    shell.cd(`${BENCHMARK_FOLDER}/${project}`);
    console.log(index, shell.pwd().stdout);
    let out = shell.exec(`npm test`, { silent: true });
    if (out.code === 0)
        passed++;
    else
        failed++;

    let toPrint = `${project},${out.code},${out.code === 0}\n`;
    console.log(toPrint);
    fs.appendFileSync(OUTPUT_FILE, toPrint, 'utf-8')
});

console.log(`passed: ${passed}, failed: ${failed}`);
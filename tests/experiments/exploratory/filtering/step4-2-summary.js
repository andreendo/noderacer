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
        let tc = JSON.parse(fs.readFileSync(`nr-passing-tcs-4-hb.json.log`, 'utf8'));
        let succ_log = tc.filter(t => t.runIsolated && t.log).length;
        let succ_global = tc.filter(t => t.status && t.status === 'success with global').length;
        let succ_noGlobal = tc.filter(t => t.status && t.status === 'success without global').length;
        let fail_timeout = tc.filter(t => t.status && t.status === 'timeout without global').length;
        let succ_hb = succ_global + succ_noGlobal;
        // t.log;
        console.log(`${project},${tc.length},${succ_log},${succ_global},${succ_noGlobal},${fail_timeout},${succ_hb}\n`);    
    }
    catch(error) {
        console.log(`${project},,,\n`);    
    }
});
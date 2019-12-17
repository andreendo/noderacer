const { determineUniquePathName } = require('../util/utils');
const { calculateMetricsPerTestCase, fixBeforeWithNoInit } = require('../suspicious');

const fs = require('fs');

class Register {
    constructor(logFolder) {
        this.hrstart = process.hrtime();
        this.file = determineUniquePathName(logFolder, 'noderacer', '.log.json');
        this.entries = [];
        fs.openSync(this.file, 'w');    //make sure one log file per process
    }

    put(entry) {
        let self = this;
        if (entry.e === 'start-new-test-case') {
            if (!self.testCaseMode) {  // first test case
                self.testCaseMode = {
                    preamble_init: 0,
                    preamble_end: self.entries.length - 2,
                    tests: []
                };
            }

            self.testCaseMode.tests.push({
                name: entry.testCaseName,
                file: entry.testCaseFile,
                begin: self.entries.length + 2
            });
        }

        this.entries.push(entry);
    }

    dump() {
        let self = this;
        let tcObjects = [];
        if (self.testCaseMode) {
            let tc = self.testCaseMode.tests;
            // let preamble = self.entries.slice(self.testCaseMode.preamble_init, self.testCaseMode.preamble_end + 1);
            for (let i = 0; i < tc.length; i++) {
                // define the end index for each test case
                tc[i].end = i === tc.length - 1 ? self.entries.length - 1 : tc[i + 1].begin - 4;

                let tcObject = {
                    fileLogName: self.file.replace('.log.json', `-${i}.log.json`),
                    testCaseFile: tc[i].file,
                    testCaseName: tc[i].name,
                    // entries: preamble.concat(self.entries.slice(tc[i].begin, tc[i].end + 1))
                    entries: self.entries.slice(tc[i].begin, tc[i].end + 1)
                };
                fixBeforeWithNoInit(tcObject.entries, self.entries);
                fs.appendFileSync(tcObject.fileLogName, JSON.stringify(tcObject, null, 4), 'utf-8');
                tcObjects.push(tcObject);
            }

            calculateMetricsPerTestCase(tcObjects);
        }

        // save one file
        let runtime = process.hrtime(self.hrstart)[1] / 1000000;
        fs.appendFileSync(self.file, JSON.stringify({
            runtime,
            entries: self.entries
        }, null, 4), 'utf-8');
    }
}

module.exports = Register
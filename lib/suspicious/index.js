const AsyncObjectsBuilder = require('../hb/asyncobjectsbuilder');
const Relations = require('../hb/relations');
const applyRules = require('../hb/applyrules');
const reduceGraph = require('../hb/reducegraph');

// const path = require('path');
const basename = require('path').basename;
const fs = require('fs');
const Table = require('cli-table');

function calculateMetricsPerTestCase(tcs) {
    console.log('--------------------------------------------------------------------');
    console.log('-------------  NodeRacer - Suspicious Metrics  ---------------------');
    console.log('--------------------------------------------------------------------');
    console.log('CMIO - # of Callbacks that May Interleave with Others');
    console.log('AII - Average Individual Interleaving');
    let table = new Table({ head: ['LogId', 'File', 'TC Name', '#Entries', 'F/R', '#CBs', '#HB', 'CMIO', 'AII'] });
    tcs.forEach((tc, index) => {
        console.log(index, basename(tc.testCaseFile), tc.testCaseName);
        let fg, fullError = false;
        try {
            // this can take some time; include a skip after some timeout
            fg = generateFullGraph(tc.entries);
        } catch (error) {
            fullError = true;
        }
        let rg, reducedError = fullError;
        if (!fullError) {
            try {
                // this can take some time; include a skip after some timeout
                rg = reduceGraph(fg.asyncObjects, fg.relations);
            } catch (error) {
                reducedError = true;
            }
        }

        table.push([
            index,
            basename(tc.testCaseFile),
            tc.testCaseName,
            tc.entries.length,
            'F',
            ...getOutput(fg, fullError)
        ]);
        table.push([
            index,
            basename(tc.testCaseFile),
            tc.testCaseName,
            tc.entries.length,
            'R',
            ...getOutput(rg, reducedError)
        ]);

    });

    console.log(table.toString());
    saveCSVReport(table);
}

function generateFullGraph(entries) {
    let builder = new AsyncObjectsBuilder();
    let asyncObjects = builder.extract(entries);
    let relations = new Relations();
    // remove global to have a faster analysis - global can be used in the individual TC
    applyRules(entries, asyncObjects, relations, { global: false });
    return { asyncObjects, relations };
}

function getOutput(g, hasError) {
    if (hasError) return [-1, -1, -1, -1];  //some error during h-b inference

    return getMetrics(g);
}

function getMetrics({ asyncObjects, relations }) {
    let objs = asyncObjects.getAll();

    relations.startGraphLibDataStructure(objs);

    let numberOfCallbacksMayInterleave = new Array(objs.length).fill(0);
    for (let i = 0; i < objs.length - 1; i++) {
        for (let j = i + 1; j < objs.length; j++) {
            if (!relations.happensBeforeWithGraphLib(objs[i].id, objs[j].id)
                && !relations.happensBeforeWithGraphLib(objs[j].id, objs[i].id)) { //no relations
                numberOfCallbacksMayInterleave[i]++;
                numberOfCallbacksMayInterleave[j]++;
            }
        }
    }
    let cmio = 0;
    let aii = 0;

    numberOfCallbacksMayInterleave.forEach(cb => {
        if (cb > 0) cmio++;
        aii += cb;
    });

    aii = objs.length ? aii / objs.length : 0;
    return [
        asyncObjects.getAll().length,
        relations.hb.length,
        cmio.toFixed(2),
        aii.toFixed(2)
    ];
}

function saveCSVReport(table) {
    let toPrint = 'LogId,File,TC Name,#Entries,F/R,#CBs,#HB,CMIO,AII\n';
    table.forEach(line => {
        line[1] = `"${line[1]}"`;
        line[2] = `"${line[2]}"`;
        toPrint += line.join(',') + '\n';
    });
    // console.log(path.join(path.resolve('.'), 'report.csv'));
    fs.writeFileSync('report.csv', toPrint, 'utf-8');
}

function fixBeforeWithNoInit(entries, full_entries) {
    let first_entry = entries.find(e => e.e === 'AsyncHook-before');
    let corresponding_init = entries.find(e => e.e === 'AsyncHook-init' && e.id === first_entry.id);
    if (!corresponding_init) {
        corresponding_init = full_entries.find(e => e.e === 'AsyncHook-init' && e.id === first_entry.id);
        entries.unshift(corresponding_init);
    }
}

module.exports = { calculateMetricsPerTestCase, fixBeforeWithNoInit, getMetrics };
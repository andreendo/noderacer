const fs = require('fs');

const getMetrics = require('./index').getMetrics;
const readHBfile = require('../hb/util').read;

function suspicious(hbfile, metric) {
    if (!fs.existsSync(hbfile))
        throw 'File does not exist.';
    if (metric && !['cmio', 'aii'].includes(metric))
        throw 'Invalid metric.';

    let hbi = readHBfile(hbfile);
    let metrics = getMetrics(hbi);

    if (metric === 'cmio')
            console.log(`CMIO: ${metrics[2]}`);
    else if (metric === 'aai')
            console.log(`AII: ${metrics[3]}`);
    else {
        console.log(`callbacks: ${metrics[0]}`);
        console.log(`h-b relations: ${metrics[1]}`);
        console.log(`CMIO: ${metrics[2]}`);
        console.log(`AII: ${metrics[3]}`);
    }
}

module.exports = suspicious;
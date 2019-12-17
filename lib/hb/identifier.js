const fs = require('fs');
const path = require('path');
const AsyncObjectsBuilder = require('./asyncobjectsbuilder');
const Relations = require('./relations');
const applyRules = require('./applyrules');
const reduceGraph = require('./reducegraph');
const generateGraphImage = require('./graphvis');
const checker = require('./checker');

function identifier(args) {
    args.file = path.resolve(args.file);
    if (!fs.existsSync(args.file))
        throw 'file does not exist.';

    let { entries } = JSON.parse(fs.readFileSync(args.file));

    let builder = new AsyncObjectsBuilder();
    let asyncObjects = builder.extract(entries);

    let relations = new Relations();

    applyRules(entries, asyncObjects, relations, { global: !args.noglobal });

    //reduced graph only with callback nodes
    let rg = reduceGraph(asyncObjects, relations);

    let hbFileName = args.file.replace('.log.json', '.hb-full.json');
    console.log(hbFileName);
    fs.writeFileSync(hbFileName, JSON.stringify({ asyncObjects, relations }, null, 4), 'utf-8');

    let reducedHbFileName = args.file.replace('.log.json', '.hb.json');
    console.log(reducedHbFileName);
    fs.writeFileSync(reducedHbFileName, JSON.stringify({
        asyncObjects: rg.asyncObjects,
        relations: rg.relations
    }, null, 4), 'utf-8');

    if (args.image) {
        let figName = args.file.replace('.log.json', '.hb-graph-full.png');
        generateGraphImage(figName, { nodes: asyncObjects.getAll(), edges: relations.hb });

        figName = args.file.replace('.log.json', '.hb-graph-only-cbs.png');
        generateGraphImage(figName, { nodes: rg.asyncObjects.getAll(), edges: rg.relations.hb });
    }

    //validate current trace w.r.t. h-b relations
    let originalTrace = checker.extractOriginalTrace(rg.asyncObjects);
    if (!relations.hasPromiseRace &&                                    //optional edges are not considered
        !checker.satisfyHappensBefore(rg.relations, originalTrace)) {
        // console.log('Warning: Check inferred h-b relations');
    }
}

module.exports = identifier
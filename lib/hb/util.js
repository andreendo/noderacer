const AsyncObjects = require('./asyncobjects');
const Relations = require('./relations');

const fs = require('fs');

function read(file) {
    let hbinfo = JSON.parse(fs.readFileSync(file));
    return {
        asyncObjects: new AsyncObjects(hbinfo.asyncObjects.objects),
        relations: new Relations(hbinfo.relations.hb)
    };
}

function stats({ asyncObjects, relations }) {
    let statsret = {
        asyncobjects: asyncObjects.objects.length,
        relations: relations.hb.length,
        callbacks: getAsyncObjectsWithCallback(asyncObjects.objects),
        rules: statsByRule(relations.hb)
    };
    return statsret;
}

function statsByRule(relations) {
    let map = new Map();
    relations.forEach((r) => {
        if(r.type.startsWith('promise-race-'))
            r.type = 'promise-race';

        if (!map.has(r.type))
            map.set(r.type, 0);

        map.set(r.type, map.get(r.type) + 1);
    });

    let response = {};
    for (let [k, v] of map.entries()) 
        response[k] = v;

    return response;
}

function getAsyncObjectsWithCallback(asyncobjects) {
    return asyncobjects.filter(o => o.callback).length;
}

module.exports = { read, stats }
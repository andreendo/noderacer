const { attend } = require('./globalfifobytype');

function apply(entries, asyncObjects, relations, aoi, aoj) {
    let foundRelation = false;
    if (aoi.entry.timeout <= aoj.entry.timeout && attend(aoi, aoj, relations)) {
        relations.add(aoi.id, aoj.id, aoi.entry.type + '-g');
        foundRelation = true;
    }

    if (!foundRelation) {   //try the other way
        if (aoj.entry.timeout <= aoi.entry.timeout && attend(aoj, aoi, relations)) {
            relations.add(aoj.id, aoi.id, aoi.entry.type + '-g');
            foundRelation = true;
        }
    }
    return foundRelation;
}
module.exports = { apply }
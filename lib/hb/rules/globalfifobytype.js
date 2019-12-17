function apply(entries, asyncObjects, relations, aoi, aoj) {
    let foundRelation = false;
    if (attend(aoi, aoj, relations)) {
        relations.add(aoi.id, aoj.id, aoi.entry.type + '-g');
        foundRelation = true;
    }

    if (!foundRelation) {   //try the other way
        if (attend(aoj, aoi, relations)) {
            relations.add(aoj.id, aoi.id, aoi.entry.type + '-g');
            foundRelation = true;
        }
    }
    return foundRelation;
}

function attend(aoi, aoj, relations) {
    let parent_of_cbi, parent_of_cbj;
    if (aoi.entry.type === 'PROMISE') {
        parent_of_cbi = relations.resolvedIn(aoi.id);
        parent_of_cbj = relations.resolvedIn(aoj.id);

        //self-resolved then null
        //self-resolved in a promise created as a then.
        if (!parent_of_cbi)
            parent_of_cbi = relations.registeredIn(aoi.id);

        if (!parent_of_cbj)
            parent_of_cbj = relations.registeredIn(aoj.id);
    }
    else {
        parent_of_cbi = relations.registeredIn(aoi.id);
        parent_of_cbj = relations.registeredIn(aoj.id);

    }

    if (!parent_of_cbi || !parent_of_cbj)
        return false;

    return relations.happensBefore(parent_of_cbi, parent_of_cbj);
}

module.exports = { apply, attend }
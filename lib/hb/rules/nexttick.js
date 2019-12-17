function apply(entries, asyncObjects, relations, aoi, aoj) {
    if(aoj.entry.type === 'TickObject') {   // assume aoi is always the tickObject
        let temp = aoi;
        aoi = aoj;
        aoj = temp;
    }
    
    let foundRelation = false;
    if (attend(aoi, aoj, relations)) {
        relations.add(aoi.id, aoj.id, aoi.entry.type + '-difftype-g');
        foundRelation = true;
    }
    return foundRelation;
}

function attend(aoi, aoj, relations) {
    let parent_of_cbi = relations.registeredIn(aoi.id);
    if (!parent_of_cbi)
        return false;

    return relations.happensBefore(parent_of_cbi, aoj.id);
}

module.exports = { apply }
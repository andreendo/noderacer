const globalFifoByTypeRule = require('./globalfifobytype');
const globalFifoByTimeoutRule = require('./globalfifobytimeout');
const globalNextTickRule = require('./nexttick');

function apply(entries, asyncObjects, relations) {
    let newRelationsFound = false;  // eslint-disable-line no-unused-vars
    let asyncObj = asyncObjects.getAll();
    for (let i = 0; i < asyncObj.length; i++) {
        for (let j = i + 1; j < asyncObj.length; j++) {
            let aoi = asyncObj[i], aoj = asyncObj[j];
            //same type
            if (aoi.entry.type === aoj.entry.type &&
                !relations.happensBefore(aoi.id, aoj.id) &&
                !relations.happensBefore(aoj.id, aoi.id)) {
                switch (aoi.entry.type) {
                    case 'Immediate':
                    case 'TickObject':
                    case 'PROMISE':
                        if (globalFifoByTypeRule.apply(entries, asyncObjects, relations, aoi, aoj))
                            newRelationsFound = true;
                        break;
                    case 'Timeout':
                        if (globalFifoByTimeoutRule.apply(entries, asyncObjects, relations, aoi, aoj))
                            newRelationsFound = true;
                        break;
                }
            }

            //tick case
            if (isOneOfTick(aoi, aoj) &&
                !relations.happensBefore(aoi.id, aoj.id) &&
                !relations.happensBefore(aoj.id, aoi.id)) {
                if (globalNextTickRule.apply(entries, asyncObjects, relations, aoi, aoj))
                    newRelationsFound = true;
            }
        }
    }
    // REMOVE IT FOR SCALABILITY
    // if (newRelationsFound) //if a new relation is found, the process needs to be restarted
    //     apply(entries, asyncObjects, relations);
}

function isOneOfTick(aoi, aoj) {    //different types, but one is tick
    let itype = aoi.entry.type, jtype = aoj.entry.type;
    return itype !== jtype && (itype === 'TickObject' || jtype === 'TickObject');
}

module.exports = { apply }
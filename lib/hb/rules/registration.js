function apply(entries, asyncObjects, relations) {
    asyncObjects.getAll().forEach(asyncObj => {
        let parentObject = findAsyncObjectWhereRegistered(asyncObjects, asyncObj);
        if (parentObject)
            relations.add(parentObject.id, asyncObj.id, 'registration');
    });
}

function findAsyncObjectWhereRegistered(asyncObjects, asyncObj) {
    let triggers = asyncObjects.getByAsyncId(asyncObj.entry.trigger);

    //For this specific case, current should be used.
    if (asyncObj.entry.trigger !== asyncObj.entry.current && asyncObj.entry.type === 'TickObject') {
        triggers = asyncObjects.getByAsyncId(asyncObj.entry.current);        
    }

    if (triggers.length === 0)
        return null;

    //select the closest
    for (let i = 0; i < triggers.length - 1; i++) {
        if (asyncObj.entry.logindex > triggers[i].beforeindex
            && asyncObj.entry.logindex < triggers[i + 1].beforeindex)
            return triggers[i];
    }
    return triggers[triggers.length - 1];
}

module.exports = { apply }
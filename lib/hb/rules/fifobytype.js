function apply(entries, asyncObjects, relations) {
    ['TickObject', 'Immediate'].forEach((type) => {
        let obj = asyncObjects.getAll().filter((o) => o.entry.type === type);
        for (let i = 0; i < obj.length - 1; i++) {
            if (relations.registeredInSameTick(obj[i].id, obj[i + 1].id)) //registered in the same tick 
                relations.add(obj[i].id, obj[i + 1].id, type + '-l');
        }
    });

    // promises registered for the same 'p.then(cb1); p.then(cb2);' so cb1 -> cb2
    let promisesThen = entries.filter((entry) =>
            entry.e === 'AsyncHook-init' &&
            entry.type === 'PROMISE' &&
            entry.trigger !== entry.current);
    for (let i = 0; i < promisesThen.length - 1; i++) {
        let curr = promisesThen[i], next = promisesThen[i + 1];
        // registered in the same tick with same trigger promise
        if (curr.trigger === next.trigger && curr.current === next.current) { 
            let parent = asyncObjects.getByAsyncId(curr.id);
            let child = asyncObjects.getByAsyncId(next.id);
            relations.add(parent[0].id, child[0].id, 'promise-then');
            if (parent.length !== 1 || child.length !== 1) { throw "Error"; }            
        }
    }

    // promises - resolved in the same tick
    let entry = entries.filter((entry) => entry.e === 'AsyncHook-promiseResolve' && entry.id !== entry.current);
    for (let i = 0; i < entry.length - 1; i++) {
        if (resolvedInSameTick(asyncObjects, entry[i], entry[i + 1])) { //resolved in the same tick 
            let parent = asyncObjects.getByAsyncId(entry[i].id);
            let child = asyncObjects.getByAsyncId(entry[i + 1].id);
            relations.add(parent[0].id, child[0].id, 'promise-l');
            if (parent.length !== 1 || child.length !== 1) { throw "Error"; }
        }
    }
}

function resolvedInSameTick(asyncObjects, e1, e2) {
    let pe1 = findAsyncObjectWhereResolved(asyncObjects, e1);
    let pe2 = findAsyncObjectWhereResolved(asyncObjects, e2);
    return pe1.id === pe2.id;
}


function findAsyncObjectWhereResolved(asyncObjects, entry) {
    let triggers = asyncObjects.getByAsyncId(entry.current);
    if (triggers.length === 0)
        return null;

    //select the closest
    for (let i = 0; i < triggers.length - 1; i++) {
        if (entry.logindex > triggers[i].beforeindex
            && entry.logindex < triggers[i + 1].beforeindex)
            return triggers[i];
    }
    return triggers[triggers.length - 1];
}

module.exports = { apply }
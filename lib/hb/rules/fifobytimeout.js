function apply(entries, asyncObjects, relations) {
    let obj = asyncObjects.getAll().filter((o) => o.entry.type === 'Timeout');
    
    //group timeouts registered in the same tick
    let g = {};
    obj.forEach(e => {
        let tick = relations.registeredIn(e.id);
        if (!g[tick])
            g[tick] = [];

        //interval - only the first one is included
        if(! hasSomeWithAsyncId(g[tick], e.entry.id))
            g[tick].push(e);
    });

    for (let tick in g) {
        let t = g[tick]; //timeout objects in the same tick
        for (let i = 0; i < t.length - 1; i++) {
            for (let j = i + 1; j < t.length; j++) {
                //if timeout is less or equal, registration order is followed
                if (t[i].entry.timeout <= t[j].entry.timeout)   
                    relations.add(t[i].id, t[j].id, 'timeout-l');    
            }
        }
    }
}

function hasSomeWithAsyncId(arr, asyncId) {
    return arr.find((e) => e.entry.id === asyncId);
}

module.exports = { apply }
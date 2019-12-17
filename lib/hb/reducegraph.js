const AsyncObjects = require('./asyncobjects');
const Relations = require('./relations');

function reduceGraph(asyncObjects, relations) {
    let newObjs = [];
    let nr = new Relations();
    asyncObjects.getAll().forEach(obj => {
        if (obj.callback)
            newObjs.push(obj);
    });

    relations.startGraphLibDataStructure(asyncObjects.getAll());

    for (let i = 0; i < newObjs.length; i++) {
        for (let j = i + 1; j < newObjs.length; j++) {
            let oi = newObjs[i];
            let oj = newObjs[j];
            if (!nr.happensBefore(oi.id, oj.id) && !nr.happensBefore(oj.id, oi.id)) {   //no relations
                if (relations.happensBeforeWithGraphLib(oi.id, oj.id))
                    nr.add(oi.id, oj.id, '');
                else
                    if (relations.happensBeforeWithGraphLib(oj.id, oi.id))
                        nr.add(oj.id, oi.id, '');
            }
        }
    }

    //propagate promise race relations for optional edges (in controlled execution)
    if (relations.hasPromiseRace) {
        relations.hb
            .filter((r) => r.type.startsWith('promise-race-'))
            .forEach((r) => {
                let parent_a = relations.registeredIn(r.a);
                let resolved_parent_a = relations.resolvedIn(parent_a);
                let child_b = relations.getRegisteredBy(r.b);
                if (child_b.length === 1)
                    child_b = child_b[0];
                else
                    throw 'Error: promise race';

                if (resolved_parent_a) { 
                    let er = nr.findDirectRelation(resolved_parent_a, child_b);
                    if(er)
                        er.type = r.type;
                    else {
                        nr.add(resolved_parent_a, child_b, r.type);
                    }    
                }
            });
    }

    //some edges in nr are duplicated; try to remove them
    removeDuplicate(nr);

    return {
        asyncObjects: new AsyncObjects(newObjs),
        relations: nr
    };
}

function removeDuplicate(nr) {
    let allr = [...nr.hb];
    for (let r of allr) {
        if (!r.type) {          //not a optional edge
            // console.log(r);
            nr.remove(r.a, r.b);
            if (!nr.happensBefore(r.a, r.b)) {  //relation not preserved
                nr.add(r.a, r.b, '');   //put it back and continue
            }
        }
    }
}

module.exports = reduceGraph;
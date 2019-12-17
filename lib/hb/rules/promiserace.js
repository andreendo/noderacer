/**
 * Promise.race(n) creates n+1 promises
 * Promise 1 waits for some of promises 2..n+1 to resolve 
 */
function apply(entries, asyncObjects, relations) {
    let praceindex = 0;
    findPromiseRace(entries).forEach((p) => {
        praceindex++;
        let firstPromise = asyncObjects.getByAsyncId(p.shift())[0];
        relations.removeIncomingTo(firstPromise.id);    //remove incoming relations to firstPromise
        p.forEach((i) => {
            let iPromise = asyncObjects.getByAsyncId(i)[0];
            relations.hasPromiseRace = true;
            relations.add(iPromise.id, firstPromise.id, 'promise-race-' + praceindex);
        });
    });
}

function findPromiseRace(entries) {
    let ret = [];
    let curr = null;
    entries.forEach(logObj => {
        if (logObj.e === 'promise-race-begin') {
            curr = [];
        }
        else if (curr && logObj.e === 'AsyncHook-init' && logObj.type === 'PROMISE') {
            curr.push(logObj.id);
        }
        else if (logObj.e === 'promise-race-end') {
            ret.push(curr);
            curr = null;
        }
    });
    return ret;
}

module.exports = { apply }
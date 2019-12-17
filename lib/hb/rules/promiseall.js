/**
 * Promise.all(n) creates n+1 promises
 * Promise 1 waits for all promises 2..n+1 to resolve 
 */
function apply(entries, asyncObjects, relations) {
    findPromiseAll(entries).forEach((p) => {
        let firstPromise = asyncObjects.getByAsyncId(p.shift())[0];
        p.forEach((i) => {
            let iPromise = asyncObjects.getByAsyncId(i)[0];
            relations.add(iPromise.id, firstPromise.id, 'promise-all');
        });
    });
}

function findPromiseAll(entries) {
    let ret = [];
    let curr = null;
    entries.forEach(logObj => {
        if (logObj.e === 'promise-all-begin') {
            curr = [];
        }
        else if (curr && logObj.e === 'AsyncHook-init' && logObj.type === 'PROMISE') {
            curr.push(logObj.id);
        }
        else if (logObj.e === 'promise-all-end') {
            ret.push(curr);
            curr = null;
        }
    });
    return ret;
}

module.exports = { apply }
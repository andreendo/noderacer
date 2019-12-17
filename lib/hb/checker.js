function extractOriginalTrace(asyncObjects) {
    let cObjs = [...asyncObjects.objects];
    return cObjs
        .sort((a, b) => a.callback.logindex > b.callback.logindex ? 1 : -1)
        .map(x => x.id);
}

function satisfyHappensBefore(relations, trace) {
    for (let i = 0; i < trace.length - 1; i++) {
        for (let j = i + 1; j < trace.length; j++) {            
            if(relations.happensBefore(trace[j], trace[i])) {
                // console.log(trace[j] +' should happen before '+ trace[i]);
                return false;
            }
        }
    }
    return true;
}

module.exports = { extractOriginalTrace, satisfyHappensBefore }
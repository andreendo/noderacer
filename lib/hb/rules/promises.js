function apply(entries, asyncObjects, relations) {
    entries
        .filter((entry) => entry.e === 'AsyncHook-promiseResolve' && entry.id !== entry.current)
        .forEach(entry => {
            let parent = asyncObjects.getByCurrentId(entry);
            let child = asyncObjects.getByAsyncId(entry.id);
            if (!relations.happensBefore(child[0].id, parent.id))
                relations.add(parent.id, child[0].id, 'promise-resolve');
            if (child.length !== 1) { throw "Error"; }
        });
}

module.exports = { apply }
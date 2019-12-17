class AsyncObjects {
    constructor(pObjects) {
        this.objects = pObjects;
    }

    getAll() {
        return this.objects;
    }

    getByAsyncId(asyncId) {
        return this.objects.filter((obj) => obj.entry.id === asyncId);
    }

    getByCurrentId(entry) {
        let triggers = this.getByAsyncId(entry.current);
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

    hasFunction(f) {
        let ret = this.objects.find((obj) => obj.callback
            && obj.callback.file === f.file
            && obj.callback.name === f.name
            && obj.callback.line === f.line);
        return ret !== undefined;
    }

    findAsyncObjectsByFunction(fn) {
        return this.objects.filter((obj) => obj.callback
        && obj.callback.file === fn.file
        && obj.callback.name === fn.name
        && obj.callback.line === fn.line);
    }

    findAsyncObjectsById(id) {
        return this.objects.find((o) => o.id === id);
    }
}

module.exports = AsyncObjects
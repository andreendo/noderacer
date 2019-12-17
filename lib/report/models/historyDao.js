const path = require('path');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

class HistoryDAO {
    constructor() {
        const adapter = new FileSync(path.join('noderacer-db.json'));
        this.db = low(adapter);
        this.db.defaults({ logpaths: [] })
            .write();
    }

    getHistory() {
        return this.db.get('logpaths')
            .value();
    }

    addIfNotExists(name) {
        let pathname = this.db.get('logpaths')
            .find({ name })
            .value();
        if (!pathname)
            this.db.get('logpaths')
                .push({ name })
                .write();
    }
}

module.exports = HistoryDAO;
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const { stats } = require('../../hb/util');

class HbDAO {
    constructor(folder) {
        this.folder = folder;
    }

    collectFullStats() {
        return new Promise((resolve, reject) => {
            let files = glob.sync(path.join(this.folder, '/noderacer*.hb-full.json'));
            if (!files || files.length === 0)
                reject(new Error('No h-b file'));

            fs.readFile(files[0], (err, data) => {
                if (err) reject(err);

                resolve({ stats: stats(JSON.parse(data)) });
            });
        });
    }
}

module.exports = HbDAO;
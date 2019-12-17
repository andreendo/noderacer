const fs = require('fs');
const path = require('path');
const glob = require('glob');

class LogFileDAO {
    constructor(folder) {
        this.folder = folder;
    }

    getFiles() {
        let self = this;
        return new Promise((resolve, reject) => {
            glob(path.join(this.folder, '/noderacer*.log.json'), null, (err, files) => {
                if (err) reject(err);

                Promise
                    .all(files.map(file => self.collectFileData(file)))
                    .then(resolve);
            });
        });
    }

    collectFileData(file) {
        return new Promise((resolve, reject) => {
            fs.stat(file, (err, stat) => {
                if (err) reject(err);

                resolve({
                    filename: path.basename(file),
                    createdAt: stat.birthtime,
                    size: stat.size / 1000.0
                });
            });
        });
    }

    extractFile(file) {
        let canonicalpath = path.join(this.folder, file);
        return new Promise((resolve, reject) => {
            fs.readFile(canonicalpath, (err, data) => {
                if (err) reject(err);
                
                let { runtime, entries } = JSON.parse(data);
                let m_entries = entries.map((entry) => {
                    let type = entry.e;
                    delete entry.e;
                    return { type, content: JSON.stringify(entry, null, 2) };
                });
                resolve({ file, time: runtime, entries: m_entries });
            });
        });
    }
}

module.exports = LogFileDAO;
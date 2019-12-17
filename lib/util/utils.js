const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

function readlogfile(filepath, prefix) {
    let lineObjs = [];

    fs.readFileSync(filepath, 'utf8')
        .trim()
        .split('\n')
        .forEach((line) => {
            let lineObj = JSON.parse(line);
            if (prefix && lineObj.file)
                lineObj.file = lineObj.file.replace(prefix, '');

            lineObjs.push(lineObj);
        });

    return lineObjs;
}

function readJSONFrom(filepath) {
    if (! fs.existsSync(filepath))
        return null;

    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

function persistJSONTo(data, filepath) {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 4), 'utf-8');
}

function determineUniquePathName(folder, name, extension) {
    extension = extension || '';
    let i = 1;
    while (fs.existsSync(path.join(folder, name + i + extension))) i++;
    return path.join(folder, name + i + extension);
}

function createDir(dirpath) {
    mkdirp.sync(dirpath);
}

module.exports = { readlogfile, determineUniquePathName, createDir, readJSONFrom, persistJSONTo }
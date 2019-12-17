const path = require('path');
const fs = require('fs');

function retrieveConfigIfExists(hbfile) {
    let configfile = path.join(path.dirname(hbfile), 'settings.json');
    if (fs.existsSync(configfile))
        return JSON.parse(fs.readFileSync(configfile));
    else
        return null;
}

module.exports = { retrieveConfigIfExists }
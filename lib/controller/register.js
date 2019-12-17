const fs = require('fs');
const path = require('path');

class Register {
    constructor(logFolder, run) {
        this.file = path.join(logFolder, 'control-' + run + '.log.json');
        this.entries = [];
        fs.openSync(this.file, 'w');
        console.log('>>>run ' + run);
        console.log('>>>' + this.file);
    }

    put(e) {
        this.entries.push(e);
    }

    dump() {
        if (this.onExit) this.onExit();
        fs.appendFileSync(this.file, JSON.stringify(this.entries, null, 4), 'utf-8');
    }
}

module.exports = Register
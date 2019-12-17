'use strict';

const fs = require('fs');

class Register {
    constructor(file) {
        this.file = file;
        this.entries = [];
        fs.openSync(this.file, 'w');
    }

    put(e) {
        this.entries.push(e);
    }

    dump() {
        fs.appendFileSync(this.file, JSON.stringify(this.entries, null, 4), 'utf-8');
    }
}

module.exports = Register;
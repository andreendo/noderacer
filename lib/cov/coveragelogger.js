/* eslint-disable no-unused-vars */

'use strict';

const Register = require('../util/register');
const { createDir, determineUniquePathName } = require('../util/utils');

class CoverageLogger {
    constructor(hbfile) {
        this.hbfile = hbfile;
    }

    install() {
        throw 'Feature not implemented';

        // get hbfile folder
        // create /cov if do not exist
        // noderacer{X}.cov.json
        //set to register class

        /*
        let Formatter = require('../../njstrace/lib/formatter.js');
        function MyFormatter() { }
        require('util').inherits(MyFormatter, Formatter);
        MyFormatter.prototype.onEntry = function (args) {
            console.log(args.name);
        };
        MyFormatter.prototype.onExit = function () { };

        require('../../njstrace/njsTrace').inject({ formatter: new MyFormatter() });
        */
    }
}

module.exports = CoverageLogger;
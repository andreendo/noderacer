'use strict';

const CoverageLogger = require('./coveragelogger');

const sw = require('spawn-wrap');

let covlogger = new CoverageLogger(process.env.hbfile);
covlogger.install();

sw.runMain();
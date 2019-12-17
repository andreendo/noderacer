const logger = require('./logger');

const sw = require('spawn-wrap');

logger(process.env.LOG_FOLDER, process.env.COMMAND, process.env.CONFIGFILE);

sw.runMain();
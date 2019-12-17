const happensBeforeInfoUtil = require('../hb/util');
const logUtil = require('../logger/util');
const Random1Strategy = require('./strategies/random1');
const OnePostponeWithHistoryStrategy = require('./strategies/onePostpone');
const NoPostponeStrategy = require('./strategies/noPostpone');
const NoHbRandomStrategy = require('./strategies/noHbRandom');

const sw = require('spawn-wrap');

let hbi = happensBeforeInfoUtil.read(process.env.hbfile);
//try to find settings.json in the same folder of the hb file
let config = logUtil.retrieveConfigIfExists(process.env.hbfile);
//
let strategy;
switch (process.env.strategy) {
    case 'random':
        strategy = new Random1Strategy(hbi, process.env.run, process.env.logDir, config);
        break;
    case 'noPostpone':
        strategy = new NoPostponeStrategy(hbi, process.env.run, process.env.logDir, config);
        break;
    case '1-postpone-history':
        strategy = new OnePostponeWithHistoryStrategy(hbi, process.env.run, process.env.logDir, config);
        strategy.setMemoryPath(process.env.memory);
        break;
    case 'noHbRandom':
        strategy = new NoHbRandomStrategy(hbi, process.env.run, process.env.logDir, config);
        break;
}
strategy.install();
process.on('exit', () => { strategy.register.dump(); });

sw.runMain();
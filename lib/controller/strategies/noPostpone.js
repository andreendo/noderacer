const Random1Strategy = require('./random1');

/**
 * Strategy: noPostpone
 * - install instrumentation but do NOT perform postpones
 */
class NoPostponeStrategy extends Random1Strategy {
    constructor(hbi, runid, logDir, config) {
        super(hbi, runid, logDir, config);
        this.postpone = false;
    }

    makeDecision() {
        return false;
    }
}

module.exports = NoPostponeStrategy;
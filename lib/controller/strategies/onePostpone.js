const Random1Strategy = require('./random1');
const { readJSONFrom, persistJSONTo } = require('../../util/utils');

class OnePostponeWithHistoryStrategy extends Random1Strategy {
    setMemoryPath(memoryPath) {
        this.memoryPath = memoryPath;
        this.memory = readJSONFrom(memoryPath) || [];
        this.hasPostponed = false;
    }

    makeDecision(asyncObject) {
        // postpone once or already covered
        if (this.hasPostponed || this.memory.includes(asyncObject.id))  
            return false;

        //not covered previously
        console.log('1st postpone: ', asyncObject.id);
        this.memory.push(asyncObject.id);
        persistJSONTo(this.memory, this.memoryPath);
        this.hasPostponed = true;
        return true;
    }
}

module.exports = OnePostponeWithHistoryStrategy;
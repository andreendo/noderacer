const Random1Strategy = require('./random1');

const random = require('random');

/**
 * Strategy: noHbRandom
 * - Do not use h-b relations (only cbs' information)
 * - Each cb, postpone with 50/50 chance to after 0-500 ms
 */
class NoHbRandomStrategy extends Random1Strategy {
    constructor(hbi, runid, logDir, config) {
        super(hbi, runid, logDir, config);
        this.first = true;
        this.printAllTime = true; // print every time the updated data
        this.needlessPostpones = 0;
        this.hbViolations = 0;
        this.numberOfCallbacks = hbi.asyncObjects.getAll().length;
    }

    installStrategyFunctions() {
        let self = this;

        self.register.onExit = () => {
            console.log(`#NR# needless-postpones:${self.needlessPostpones},hb-violations:${self.hbViolations},callbacks:${self.numberOfCallbacks}`);
            self.register.put({ entry: 'needless_postpones', times: self.needlessPostpones });
            self.register.put({ entry: 'hb_violations', times: self.hbViolations });
        }

        self.isTopLevelCallbackExecuted = false;

        global.NR_SHOULD_POSTPONE = function (fn) {
            if (self.isCallBack()) {
                let postpone;
                let asyncObject = self.hbgraph.find(fn);

                if (self.first) {    // do not postpone the first
                    postpone = false;
                    self.first = false;
                }
                else {
                    if (asyncObject === null) {
                        self.register.put({ entry: 'no_callback_found', ...fn });
                        return {
                            isCallback: false,
                            postpone: false
                        };
                    }

                    postpone = self.makeDecision(); // 50/50 chance of postponing                   
                    global.NR_POSTPONE_TIME = random.int(0, 500); // decide timeout [0-500] ms

                    //check if it is needless
                    if (postpone && !self.hbgraph.mayPostpone(asyncObject)) {
                        self.needlessPostpones++;
                        if (self.printAllTime)
                            console.log(`#NR# needless-postpones:${self.needlessPostpones},hb-violations:${self.hbViolations},callbacks:${self.numberOfCallbacks}`);
                    }
                }
                self.register.put({ entry: 'should_postpone', postpone, timeout: global.NR_POSTPONE_TIME, asyncObject });
                return {
                    isCallback: true,
                    postpone,
                    asyncObjectId: asyncObject.id
                };
            }
            else {
                return {
                    isCallback: false,
                    postpone: false
                };
            }
        }

        global.NR_NOTIFY = function (fn, info) {
            self.isTopLevelCallbackExecuted = true;
            if (info.isCallback) {
                if (!self.hbgraph.mayHappen({ id: info.asyncObjectId })) {
                    self.hbViolations++;
                    if (self.printAllTime)
                        console.log(`#NR# needless-postpones:${self.needlessPostpones},hb-violations:${self.hbViolations},callbacks:${self.numberOfCallbacks}`);
                }
                self.hbgraph.notifyRunOf(info.asyncObjectId); //Remove it from th H-B graph
                self.register.put({ entry: 'run', ...fn });
            }
        }
    }
}

module.exports = NoHbRandomStrategy;
const registrationRule = require('./rules/registration');
const promisesRule = require('./rules/promises');
const fifoByTypeRule = require('./rules/fifobytype');
const fifoByTimeoutRule = require('./rules/fifobytimeout');
const intervalRule = require('./rules/interval');
const promiseAllRule = require('./rules/promiseall');
const promiseRaceRule = require('./rules/promiserace');
const globalRules = require('./rules/global');

function applyRules(entries, asyncObjects, relations, opts) {
    let defaultOpts = {
        registration: true,
        promises: true,
        fifoByType: true,
        fifoByTimeout: true,
        interval: true,
        promiseAll: true,
        promiseRace: true,
        global: true
    };
    opts = { ...defaultOpts, ...opts };

    if (opts.registration)
        registrationRule.apply(entries, asyncObjects, relations);
        
    if (opts.promises)
        promisesRule.apply(entries, asyncObjects, relations);

    if (opts.fifoByType)
        fifoByTypeRule.apply(entries, asyncObjects, relations);

    if (opts.fifoByTimeout)
        fifoByTimeoutRule.apply(entries, asyncObjects, relations);

    if (opts.interval)
        intervalRule.apply(entries, asyncObjects, relations);

    if (opts.promiseAll)
        promiseAllRule.apply(entries, asyncObjects, relations);

    if (opts.global)
        globalRules.apply(entries, asyncObjects, relations);

    //As promise.race introduces optional h-b relations, they should not be used to
    //infer global relations
    if (opts.promiseRace)
        promiseRaceRule.apply(entries, asyncObjects, relations);
}

module.exports = applyRules;
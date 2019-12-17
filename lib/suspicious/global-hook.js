/**
 * Global hook to be add in Mocha tests 
 * 
 * Via Mocha CLI, ask it to pick this by using '--file ../global-hook.js'
 * 
 * Reference: https://futurestud.io/tutorials/mocha-global-setup-and-teardown-before-after
 */
beforeEach(function () {    // eslint-disable-line no-undef
    // console.log('noderacer beforeEach hook');
    if (global.NR_MARK_STARTING_NEW_TC)
        global.NR_MARK_STARTING_NEW_TC(this.currentTest.title, this.currentTest.file);
});
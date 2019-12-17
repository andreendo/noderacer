const async_hooks = require('async_hooks');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const { generateId } = require('../util/id');
const Register = require('./register');

function logger(logFolder, command, configFile) {
    if (configFile && !fs.existsSync(configFile))
        throw 'config file does not exist';

    if (!fs.existsSync(logFolder)) {
        mkdirp.sync(logFolder);
    }
    let register = new Register(logFolder);
    process.on('exit', () => { register.dump() });

    //----------------------------------------------------------------------------------------
    //LIGHTWEIGHT FUNCTION CALL INSTRUMENTATION
    //----------------------------------------------------------------------------------------
    var Formatter = require('../../njstrace/lib/formatter.js');
    function MyFormatter() { }
    require('util').inherits(MyFormatter, Formatter);

    // the onEntry function method
    MyFormatter.prototype.onEntry = function (args) {
        register.put({
            e: 'call-entry',
            current: async_hooks.executionAsyncId(),
            trigger: async_hooks.triggerAsyncId(),
            function: args.name,
            file: args.file,
            line: args.line,
            args: generateId(args.args)
        });
    };
    // the onExit function method
    MyFormatter.prototype.onExit = function (args) {
        register.put({
            e: 'call-exit',
            current: async_hooks.executionAsyncId(),
            trigger: async_hooks.triggerAsyncId(),
            function: args.name,
            file: args.file,
            line: args.line
        });
    };

    //default files to track
    let tfiles = ['**/*.js', '!**/node_modules/**'];
    tfiles.push('!' + command.split(',')[1]); //do not track the test file
    if (configFile) {
        let config = JSON.parse(fs.readFileSync(configFile));
        tfiles = config.pattern || ['**/*.js', '!**/node_modules/**'];
        if (!config.testfile)
            tfiles.push('!' + command.split(',')[1]); //do not track the test file

        fs.writeFileSync(path.join(logFolder, 'settings.json'), JSON.stringify(tfiles, null, 4), 'utf-8');
    }

    require('../../njstrace').inject({
        formatter: new MyFormatter(),
        files: tfiles
    });

    //----------------------------------------------------------------------------------------
    //ASYNC HOOKS
    //----------------------------------------------------------------------------------------

    function before(asyncId) {
        register.put({
            e: 'AsyncHook-before',
            id: asyncId,
            trigger: async_hooks.triggerAsyncId(),
            current: async_hooks.executionAsyncId()
        });
    }

    function init(asyncId, type, triggerAsyncId, resource) {
        let entry = {
            e: 'AsyncHook-init',
            id: asyncId,
            trigger: triggerAsyncId,
            type: type,
            current: async_hooks.executionAsyncId()
        };

        if (type === 'Timeout')
            entry.timeout = resource._idleTimeout;

        register.put(entry);
    }

    function promiseResolve(asyncId) {
        register.put({
            e: 'AsyncHook-promiseResolve',
            id: asyncId,
            trigger: async_hooks.triggerAsyncId(),
            current: async_hooks.executionAsyncId()
        });
    }

    const asyncHook = async_hooks.createHook({ init, before, promiseResolve });
    asyncHook.enable();

    //----------------------------------------------------------------------------------------
    //MONKEY PATCHING
    //----------------------------------------------------------------------------------------
    let _PromiseAll = Promise.all;
    Promise.all = function () {
        register.put({
            e: 'promise-all-begin',
            current: async_hooks.executionAsyncId(),
            trigger: async_hooks.triggerAsyncId()
        });

        let ret = _PromiseAll.apply(this, arguments);

        register.put({
            e: 'promise-all-end',
            current: async_hooks.executionAsyncId(),
            trigger: async_hooks.triggerAsyncId()
        });

        return ret;
    };

    let _PromiseRace = Promise.race;
    Promise.race = function () {
        register.put({
            e: 'promise-race-begin',
            current: async_hooks.executionAsyncId(),
            trigger: async_hooks.triggerAsyncId()
        });

        let ret = _PromiseRace.apply(this, arguments);

        register.put({
            e: 'promise-race-end',
            current: async_hooks.executionAsyncId(),
            trigger: async_hooks.triggerAsyncId()
        });

        return ret;
    };

    //----------------------------------------------------------------------------------------
    //LOG DIVISION (by test case)
    //----------------------------------------------------------------------------------------
    // This function adds an entry in the log to mark the beginning of a new test case execution
    global.NR_MARK_STARTING_NEW_TC = function (testCaseName, testCaseFile) {
        register.put({
            e: 'start-new-test-case',
            testCaseName,
            testCaseFile
        });
    };
}

module.exports = logger
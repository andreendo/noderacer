const Register = require('../register');
const HBGraph = require('../hbgraph/hbgraph');
const installNjstrace = require('../helpers/installnjstrace');

const async_hooks = require('async_hooks');
const random = require('random');
const falafel = require('falafel');

/**
 * Strategy: random 1
 * - When a callback can be postponed, it decides randomly
 * - A callback may be postponed only once
 */
class Random1Strategy {
    constructor(hbi, runid, logDir, config) {
        this.hbi = hbi;
        this.hbgraph = new HBGraph(hbi);
        this.register = new Register(logDir, runid);
        this.installNjstrace = installNjstrace;
        this.config = config;
        this.postponeTick = true; //default value - true (used in experiments)
    }

    install() {
        this.installNjstrace(this.config);
        this.installAsyncHooks();
        this.installFunctionInstrumentation();
        this.installStrategyFunctions();
    }

    installAsyncHooks() {
        let self = this;
        function before() {
            self.isTopLevelCallbackExecuted = false;
        }
        const asyncHook = async_hooks.createHook({ before });
        asyncHook.enable();
    }

    installFunctionInstrumentation() {
        let self = this;

        global.NR_HACK_NJS_SHOULD_INSTRUMENT = function (file, name, line, node) {
            if (self.hbi.asyncObjects.hasFunction({ file, name, line })) {
                self.setGlobalVariablesForInstrumentation(file, name, line, node);
                return true;
            }
            return false;
        }
    }

    isCallBack() {
        return !this.isTopLevelCallbackExecuted;
    }

    makeDecision(asyncObject) {
        if (!this.postponeTick) {
            if(asyncObject.entry.type === 'TickObject')
                return false;
        }
        return random.int(1, 10) <= 5;
    }

    installStrategyFunctions() {
        let self = this;

        self.isTopLevelCallbackExecuted = false;

        global.NR_POSTPONE_TIME = 500;

        global.NR_SHOULD_POSTPONE = function (fn) {
            if (self.isCallBack()) {
                let asyncObject = self.hbgraph.find(fn);    //Find the callback in the h-b graph
                if (asyncObject === null) {
                    self.register.put({ entry: 'no_callback_found', ...fn });
                    return {
                        isCallback: false,
                        postpone: false
                    };
                }

                let postpone = false;

                if (self.hbgraph.mayHappen(asyncObject)) {  //no dependency on h-b
                    if (self.hbgraph.mayPostpone(asyncObject))
                        postpone = self.makeDecision(asyncObject);
                    else
                        postpone = false;   //only callback available, it should run
                }
                else {
                    if (!this.postponeTick && asyncObject.entry.type === 'TickObject') {
                        postpone = false;
                    }
                    else
                        postpone = true;    //postpone and hope its dependencies are resolved
                }
                self.register.put({ entry: 'should_postpone', postpone, asyncObject });
                return {
                    isCallback: true,
                    postpone: postpone,
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

        global.NR_NOTIFY = function (fn, info) {    // called every time a callback is actually executed
            self.isTopLevelCallbackExecuted = true;
            if (info.isCallback) {
                if (!self.hbgraph.mayHappen({ id: info.asyncObjectId })) {
                    self.register.put({ entry: 'error_cb_may_not_occur', asyncObjectId: info.asyncObjectId });
                }
                self.hbgraph.notifyRunOf(info.asyncObjectId); //Remove it from th H-B graph
                self.register.put({ entry: 'run', asyncObjectId: info.asyncObjectId, ...fn });
            }
        }
    }

    setGlobalVariablesForInstrumentation(file, name, line, node) {
        let nr_functionSignature = node.params.map(p => {
            if (p.type === 'RestElement') {
                return '...' + p.argument.name;
            }
            return p.name;
        }).join(',');
        // console.log('------------');
        // console.log(node.body.source());
        // console.log('------------');
        let nr_functionname = name;
        if (nr_functionname === '[Anonymous]')
            nr_functionname = 'NR_ANONYMOUS';

        nr_functionname = '__' + nr_functionname.replace(/\./g, '_');
        if (nr_functionname !== '__NR_ANONYMOUS') {
            this.dealWithRecursion(name, nr_functionname, node);
        }

        let nr_fileinfo = `{file : ${JSON.stringify(file)}, name : ${JSON.stringify(name)}, line : ${line}}`;

        if (node.type === 'ArrowFunctionExpression') {
            global.NR_HACK_NJS_ENTRY =
                ` let nr_myThis = this; 
                  let ${nr_functionname} = (${nr_functionSignature}) => { `;

            global.NR_HACK_NJS_EXIT =
                ` }; 
                  let nr_info = global.NR_SHOULD_POSTPONE(${nr_fileinfo});
                  if ( nr_info.postpone ) { 
                        let nr_p = new Promise(function (resolve, reject) {
                            setTimeout(() => { 
                                global.NR_NOTIFY(${nr_fileinfo}, nr_info);
                                resolve( ${nr_functionname}.call(nr_myThis, ${nr_functionSignature}) ); 
                            }, global.NR_POSTPONE_TIME); 
                        });                        
                        nr_p.then((v) => {
                            return v;
                        });
                        return nr_p;                         
                  } 
                  else { 
                        global.NR_NOTIFY(${nr_fileinfo}, nr_info);
                        let nr_ret = ${nr_functionname}.call(nr_myThis, ${nr_functionSignature}); 
                        return nr_ret; 
                  } `;
        }
        else {
            global.NR_HACK_NJS_ENTRY =
                ` let nr_myArgs = arguments; 
                  let nr_myThis = this; 
                  function ${nr_functionname}(${nr_functionSignature}) { `;

            global.NR_HACK_NJS_EXIT =
                ` }
                  ${nr_functionname} = ${nr_functionname}.bind(nr_myThis);
                  let nr_info = global.NR_SHOULD_POSTPONE(${nr_fileinfo}, nr_myArgs);
                  if ( nr_info.postpone ) { 
                        let nr_p = new Promise(function (resolve, reject) {
                            setTimeout(() => {
                                global.NR_NOTIFY(${nr_fileinfo}, nr_info);
                                resolve( ${nr_functionname}.apply(nr_myThis, nr_myArgs) ); 
                            }, global.NR_POSTPONE_TIME); 
                        });
                        nr_p.then((v) => {
                            return v;
                        });
                        return nr_p;
                  } 
                  else {
                      global.NR_NOTIFY(${nr_fileinfo}, nr_info); 
                      let nr_ret = ${nr_functionname}.apply(nr_myThis, nr_myArgs); 
                      return nr_ret; 
                  } `;
        }
    }

    dealWithRecursion(name, newname, node) {
        // any function call for the original function name should be changed to nr_functionname
        //check the function body for calls to the original name
        global.NR_RECURSION_BODY = undefined;
        let someRec = false;
        let origFuncBody = node.body.source();
        origFuncBody = origFuncBody.slice(1, origFuncBody.length - 1); // Remove the open and close braces "{}"

        origFuncBody = 'function ___test(){' + origFuncBody + '}';

        try {
            let output = falafel(origFuncBody, {
                ranges: true,
                locations: true,
                ecmaVersion: 9
            }, function processASTNode(node) {
                if (node.type === 'CallExpression' && node.callee.type === 'Identifier') {
                    if (node.callee.name === name) {
                        someRec = true;
                        node.callee.update(newname);
                    }
                }
            });

            if (someRec) {       //some recursion, change the body
                output = '' + output;
                output = output.replace('function ___test()', '');
                output = output.slice(1, output.length - 1);
                global.NR_RECURSION_BODY = output;
            }
        }
        catch (e) {
            console.log('Error: Dealing with recursion');
            console.log(e);
        }
    }
}

module.exports = Random1Strategy;
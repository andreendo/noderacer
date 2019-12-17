const util = require('util');
const hasha = require('hasha');

function generateId(args) {
    if(! args)
        return "EMPTY";
    
    if(args.length === 0)
        return "EMPTY";

    let raw = "";
    args.forEach(e => {
        if(e != null)
            raw += util.inspect(e);
    });
    if(raw === "")
        return "EMPTY";
        
    return hasha(raw);
    // console.log('-------');
    // let e = new Error();
    // // console.log(e.stack);
    // // console.log( util.inspect(argsObj) );

    // let raw = e.stack + '#' + util.inspect(argsObj);
    // console.log(e.stack);
    // // let raw = '#' + util.inspect(argsObj);

    // console.log(hasha(raw));

    // /*for (var i in thisObj) {
    //     console.log(i, typeof thisObj[i]);//, thisObj[i]);
    // }*/
    // console.log('-------');
}

module.exports = { generateId }

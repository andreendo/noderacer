const c = require('../happensbeforechecker')()
c
    .verify('foo', 'imm')
    .verify('imm', 'prom')

function foo() {
    c.notify('foo')
    let p = new Promise(function (resolve, reject) {
        setImmediate(function imm() {
            c.notify('imm')
            //...
            resolve();
        });
    });
    p.then(function prom() {
        c.notify('prom')
        //...
    });
}

module.exports = { foo }
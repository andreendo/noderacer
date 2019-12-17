const c = require('../happensbeforechecker')()
c
    .verify('ti01', 'ti02').verify('ti01', 'im01')
    .verify('ti02', 'im02')
    .verify('im01', 'im02')

function foo() {
    setTimeout(function ti01() {
        c.notify('ti01')
        setImmediate(function im01() {
            c.notify('im01')
            /*...*/
        });
    }, 10);
    setTimeout(function ti02() {
        c.notify('ti02')
        setImmediate(function im02() {
            c.notify('im02')
            /*...*/
        });
    }, 10);
}
module.exports = { foo }
const c = require('../happensbeforechecker')();
c.verify('cb0', 'cb1').verify('cb0', 'cb2').verify('cb1', 'cb2');

module.exports = {
    ex01: function () {
        console.log('ex01: start main');
        setImmediate(() => {
            c.notify('cb0');
            console.log('ex01: cb0');
        });
        setImmediate(() => {
            c.notify('cb1');
            console.log('ex01: cb1');
        });
        setImmediate(() => {
            c.notify('cb2');
            console.log('ex01: cb2');
        });
        console.log('ex01: end main');
    }
}
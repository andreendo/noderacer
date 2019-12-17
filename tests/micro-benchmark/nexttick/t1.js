const c = require('../happensbeforechecker')()
c
    .verify('cb0', 'cb1')
    .verify('cb1', 'cb2')
    .verify('cb2', 'cb0.0')

module.exports = {
    ex01: function () {
        console.log('ex01: start main')
        process.nextTick(() => {
            c.notify('cb0')
            console.log('ex01: cb0')
            process.nextTick(() => {
                c.notify('cb0.0')
                console.log('ex01: cb0.0')
            })
        });
        process.nextTick(() => {
            c.notify('cb1')
            console.log('ex01: cb1')
        })
        process.nextTick(() => {
            c.notify('cb2')
            console.log('ex01: cb2')
        })
        console.log('ex01: end main')
    }
}
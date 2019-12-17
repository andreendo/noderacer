const c = require('../happensbeforechecker')()
c
    .verify('cb0', 'cb1')
    .verify('cb1', 'cb2')
    .verify('cb2', 'cb3')
    .verify('cb3', 'cb4')

module.exports = {
    ex01: function () {
        setTimeout(() => {
            c.notify('cb0')
            console.log('ex01: cb0')
        })
        setTimeout(() => {
            c.notify('cb1')
            console.log('ex01: cb1')
        }, 100)
        setTimeout(() => {
            c.notify('cb2')
            console.log('ex01: cb2')
        }, 200)
        setTimeout(() => {
            c.notify('cb3')
            setTimeout(() => {
                c.notify('cb4')
                console.log('ex01: cb4')
            })
        }, 1000)
    }
}
'use strict';

const c = require('../happensbeforechecker')()
c
    .verify('cb1', 'cb2')
    .verify('cb2', 'immediate').verify('cb2', 'timeout')
    .verify('immediate', 'cb3')

module.exports = {
    ex01: function () {
        console.log('ex01: start main')

        let counter = 1
        function cb() {
            c.notifyInstanceOf('cb')
            counter++
            console.log(counter)
            if (counter < 3)
                process.nextTick(cb)
            else if (counter == 3)
                setImmediate(cb)
        }

        process.nextTick(cb)
        setImmediate(() => {
            c.notify('immediate')
            console.log('immediate')
        })
        setTimeout(() => {
            c.notify('timeout')
            console.log('timeout')
        }, 1000)

        console.log('ex01: end main')
    }
}
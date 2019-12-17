const c = require('../happensbeforechecker')()
c
    .verify('nt01', 'nt02')
    .verify('nt02', 'ti01').verify('nt02', 'ti02').verify('nt02', 'ti03')
    .verify('t01', 'ti03')
    .verify('t02', 'ti03')

function foo() {
    process.nextTick(function nt01() {
        c.notify('nt01')
    })
    process.nextTick(function nt02() {
        c.notify('nt02')
    })

    setTimeout(function ti01() {
        c.notify('ti01')
    }, 100)
    setTimeout(function ti02() {
        c.notify('ti02')
    }, 50)
    setTimeout(function ti03() {
        c.notify('ti03')
    }, 100)
}

module.exports = { foo }
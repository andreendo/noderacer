const c = require('../happensbeforechecker')()
c.verify('tick', 'immediate')

function ex() {
    var x = undefined;
    setImmediate(function () {
        c.notify('immediate')
        console.log(x.f)
    })

    process.nextTick(function () {
        c.notify('tick')
        x = { f: 'hello world' }
    })
}

module.exports = ex
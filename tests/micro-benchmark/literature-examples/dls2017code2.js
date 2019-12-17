const c = require('../happensbeforechecker')()
c.verify('resolveIt', 'f')

//adapted - original code does not work
function ex() {
    function f(val) {
        c.notify('f')
        console.log(val)
    }
    let r
    let p = new Promise(function (resolve, reject) {
        r = resolve
    })
    p.resolve = r
    p.then(f)

    function resolveIt() {
        c.notify('resolveIt')
        p.resolve('hi')
    }

    setImmediate(resolveIt)
}

module.exports = ex
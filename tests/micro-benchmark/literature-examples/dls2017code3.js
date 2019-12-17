const c = require('../happensbeforechecker')()
c.verify('timeout1', 'then1')

function foo() {
    const p = new Promise(function promise1(res) {
        setTimeout(function timeout1() {
            c.notify('timeout1')
            res(42)
        }, 200)
    })

    setImmediate(function immediate1() {
        c.notify('immediate1')
        p.then(function then1(val) {
            c.notify('then1')
            console.log('Hello Context World!')
        })
    })
}

module.exports = foo
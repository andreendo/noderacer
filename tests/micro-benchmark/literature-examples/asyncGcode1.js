const c = require('../happensbeforechecker')()
c.verify('tick', 'then').verify('tick', 'timeout')

function ex01() {
    let foo

    Promise.resolve({}).then((v) => {
        c.notify('then')
        foo = v
    })

    setTimeout(() => {
        c.notify('timeout')
        // foo.bar = function () { } //commented to pass
    }, 0)

    process.nextTick(() => {
        c.notify('tick')
        console.log(foo) // original: foo.bar(); changed to pass
    })
}
module.exports = ex01
const c = require('../happensbeforechecker')()
c.verify('interval1', 'timeout')
    .verify('interval1', 'interval2')
    .verify('interval1', 'immediate1')
    .verify('interval1', 'immediate2')
c.verify('immediate1', 'immediate2')
c.verify('interval2', 'immediate2')

module.exports = {
    ex01: function () {
        function foo() { }
        console.log('ex01: start main')
        let count = 0
        foo()

        setInterval(function interval() {
            c.notifyInstanceOf('interval')
            count++

            setImmediate(function immediate() {
                c.notifyInstanceOf('immediate')
            })

            if (count === 2)
                clearInterval(this)
        }, 1000)

        setTimeout(function timeout() {
            c.notify('timeout')
        }, 1000)
    }
}
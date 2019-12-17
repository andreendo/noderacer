const c = require('../happensbeforechecker')()
c
    .verify('interval1', 'timeout')
    .verify('interval1', 'interval2')

module.exports = {
    ex01: function () {
        function foo() { }
        console.log('ex01: start main')
        let count = 0
        foo()

        setInterval(function interval() {
            c.notifyInstanceOf('interval')
            count++
            console.log('ex01: cb' + count)
            if (count === 2)
                clearInterval(this)
        }, 1000)

        setTimeout(function timeout() { 
            c.notify('timeout')
        }, 2000)

        console.log('ex01: end main')
    }
}
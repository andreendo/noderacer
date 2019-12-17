const c = require('../happensbeforechecker')()
c.verify('foo2', 'foo3')

module.exports = {
    ex01: function () {
        function foo() {
            c.notifyInstanceOf('foo')
        }
        foo()
        setImmediate(foo)
        setImmediate(foo)
    }
}
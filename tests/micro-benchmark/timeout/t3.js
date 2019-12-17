const c = require('../happensbeforechecker')()
c
    .verify('t1', 't2')
    .verify('t2', ['t1_1', 't1_2'])
    .verify('t3', ['t1_1', 't1_2'])
    .verify('t1_1', 't2_1')
    .verify('t1_2', ['t2_1', 't2_2'])

module.exports = {
    ex01: function () {
        setTimeout(function t1() {
            c.notify('t1')
            setTimeout(function t1_1() {
                c.notify('t1_1')
            }, 1200)

            setTimeout(function t1_2() {
                c.notify('t1_2')
            }, 200)
        }, 100)

        setTimeout(function t2() {
            c.notify('t2')
            setTimeout(function t2_1() {
                c.notify('t2_1')
            }, 1250)

            setTimeout(function t2_2() {
                c.notify('t2_2')
            }, 200)
        }, 100)

        setTimeout(function t3() {
            c.notify('t3')
        }, 50)
    }

}
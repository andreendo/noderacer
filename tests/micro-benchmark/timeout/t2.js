const c = require('../happensbeforechecker')()
c
    .verify('tick', ['t1', 't2', 't3', 't4'])
    .verify(['t1', 't2', 't3'], 't4')

module.exports = {
    ex01: function () {
        function msleep(n) {
            Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
        }
        function sleep(n) {
            msleep(n * 1000)
        }

        setTimeout(function t1() {
            c.notify('t1')
            console.log('t1')
        }, 103)

        setTimeout(function t2() {
            c.notify('t2')
            console.log('t2')
        }, 102)

        setTimeout(function t3() {
            c.notify('t3')
            console.log('t3')
        }, 101)

        setTimeout(function t4() {
            c.notify('t4')
            console.log('t4')
        }, 104)

        //do something that takes 1 seconds
        process.nextTick(() => {
            c.notify('tick')
            console.log('wait 1 s')
            sleep(1)
        })
    }
}
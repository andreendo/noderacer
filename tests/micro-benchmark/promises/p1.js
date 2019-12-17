'use strict';

const c = require('../happensbeforechecker')()
c
    .verify('im', 't1')
    .verify('t1', 't2')
    .verify('t2', 'then')
    .verify('t2', 'catch')

module.exports = {
    ex01: function () {
        console.log('ex01: start main')
        let promise = new Promise(function (resolve, reject) {
            console.log('ex01: within')

            setImmediate(() => {
                c.notify('im')
                resolve("ex01: done!")
                process.nextTick(() => {
                    c.notify('t1')
                })
                process.nextTick(() => {
                    c.notify('t2')
                })
            });
        });

        promise
            .then((v) => {
                c.notify('then')
                console.log(v);
                throw new Error('aa');
            })
            .catch((e) => {
                c.notify('catch')
                console.log('ex01: error ' + e.message)
            })
        console.log('ex01: end main')
    }
}
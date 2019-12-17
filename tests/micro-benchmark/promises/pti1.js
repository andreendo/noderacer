'use strict';

const c = require('../happensbeforechecker')()
c
    .verify('cbPromise1', 'cbPromiseThen1')
    .verify('cbPromise1', 'cbPromise2')
    .verify('cbPromise2', 'cbPromiseThen2')
    .verify('cbPromise2', 'imm')

function foo() { }

function bar() { }

function ex01() {
    let counter = 0
    function cbPromise(resolve, reject) {
        foo()
        counter++
        bar()
        setImmediate(function cbPromise1() {
            c.notifyInstanceOf('cbPromise')
            foo()
            resolve(counter)
        })
    }

    for (let i = 1; i <= 2; i++) {
        let p1 = new Promise(cbPromise)

        p1.then(function cbPromiseThen(data) {
            c.notifyInstanceOf('cbPromiseThen')
            bar()
            console.log(data)
        })
    }
    setImmediate(() => {
        c.notify('imm')
        bar()
        console.log('immediate')
    })
    setTimeout(() => {
        console.log('timeout1')
        foo()
    }, 11)
    setTimeout(() => {
        console.log('timeout')
        bar()
    }, 10)

    console.log('end')
}

module.exports = { ex01 }
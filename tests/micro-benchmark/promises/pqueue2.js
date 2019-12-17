'use strict';

const c = require('../happensbeforechecker')()
c
    .verify('t1', 't2')
    .verify('p1', 'p2')
    .verify('p3', 'p4')

function ex01() {
    let v = []

    var promise1 = new Promise(function (resolve, reject) {
        v.push(resolve)
    })
    var promise2 = new Promise(function (resolve, reject) {
        v.push(resolve)
    })
    var promise3 = new Promise(function (resolve, reject) {
        v.push(resolve)
    })
    var promise4 = new Promise(function (resolve, reject) {
        v.push(resolve)
    })

    promise1.then(function p1_resolve() {
        c.notify('p1')
    })
    promise2.then(function p2_resolve() {
        c.notify('p2')
    })
    promise3.then(function p3_resolve() {
        c.notify('p3')
    })
    promise4.then(function p4_resolve() {
        c.notify('p4')
    })

    setTimeout(() => {
        c.notify('t1')
        v[0]()
        v[1]()
    }, 100)

    setTimeout(() => {
        c.notify('t2')
        v[2]()
        v[3]()
    }, 100)
}

module.exports = { ex01 }
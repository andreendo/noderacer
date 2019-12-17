'use strict';

const c = require('../happensbeforechecker')()
c
    .verify('tick', 'p3').verify('tick', 'im1')
    .verify('im1', 'im2')
    .verify('p3', 'p2')
    .verify('p2', 'p1')

function ex01() {
    let v = [];

    var promise1 = new Promise(function (resolve, reject) {
        v.push(resolve);
    });
    var promise2 = new Promise(function (resolve, reject) {
        v.push(resolve);
    });
    var promise3 = new Promise(function (resolve, reject) {
        v.push(resolve);
    });

    promise1.then(function p1_resolve() {
        c.notify('p1')
        console.log('p1');
    });
    promise2.then(function p2_resolve() {
        c.notify('p2')
        console.log('p2');
    });
    promise3.then(function p3_resolve() {
        c.notify('p3')
        console.log('p3');
    });

    setTimeout(() => {
        setImmediate(function im1() {
            c.notify('im1')
        });
        setImmediate(function im2() {
            c.notify('im2')
        });
        process.nextTick(function tick() {
            c.notify('tick')
        });

        v.reverse().forEach(p => p());
    }, 0);
}

module.exports = { ex01 }
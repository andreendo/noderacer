const c = require('../happensbeforechecker')();
c.verify('t1', 't2');

class A {
    constructor() {
        this.counter = 0;
    }

    foo() {
        this.counter++;
        console.log(this.counter);
    }
}

function ex01() {
    let a = new A();
    setTimeout(() => {
        c.notify('t1');
        a.foo();
    }, 100);
    setTimeout(() => {
        c.notify('t2');
        a.foo();
    }, 100);
}

module.exports = {
    ex01: ex01
}
const c = require('../happensbeforechecker')()
c
    .verify('asyncp1', 'pall')
    .verify('asyncp2', 'pall')
    .verify('asyncp3', 'pall')

function foo() {
    let p1 = new Promise((resolve, reject) => {
        setTimeout(function asyncp1() {
            c.notify('asyncp1')
            resolve();
        }, 100);
    });

    let p2 = new Promise((resolve, reject) => {
        setTimeout(function asyncp2() {
            c.notify('asyncp2')
            resolve();
        }, 50);
        
    });

    let p3 = new Promise((resolve, reject) => {
        setTimeout(function asyncp3() {
            c.notify('asyncp3')
            resolve();
        }, 10);        
    });

    Promise.all([p1, p2, p3]).then(function pall(values) {
        c.notify('pall')
        /*...*/
    });

    Promise.race([p1, p2]).then(function prace(value) {
        c.notify('prace')
        /*...*/
    });
}

module.exports = { foo }
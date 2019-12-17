const c = require('../happensbeforechecker')()
c
    .verify('tick01', 'im01')
    .verify('tick01', 'req')

const http = require('http');

function foo() {
    http.get('http://example.com/', function req(resp) {
        c.notify('req')
        console.log('req')
    })

    setImmediate(function im01() {
        c.notify('im01')
        /*...*/
        console.log('im01')
    })
    process.nextTick(function tick01() {
        c.notify('tick01')
        /*...*/ 
        console.log('tick01')
    })
}
module.exports = { foo }
const c = require('../happensbeforechecker')()
c.verify('delay1', 'delay2')

const Promise = require('bluebird')

function ex01() {
    Promise.delay(1000).then(function delay1() {
        c.notify('delay1')
    })

    Promise.delay(1000).then(function delay2() {
        c.notify('delay2')
    })
}

module.exports = {
    ex01: ex01
}
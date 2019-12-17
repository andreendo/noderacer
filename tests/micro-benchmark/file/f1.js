'use strict';

const c = require('../happensbeforechecker')()
c.verify('ex01', 'cb').verify('ex01', 'cb1').verify('ex01', 'timeout')
c.verify('cb', 'cb1')

const fs = require('fs')

module.exports = {
    ex01: function () {
        c.notify('ex01')
        console.log('ex01')

        var cb = (err, data) => {
            c.notify('cb')
            console.log('cb')

            if (err) throw err
            
            console.log('ex01: data len ' + data.length)
            fs.readFile('./package.json', 'utf8', (err, data) => {
                c.notify('cb1')
                console.log('cb1')
            })
        }

        var foo = () => { }

        foo()

        // console.log('ex01: start main')
        fs.readFile('./package.json', 'utf8', cb)
        setTimeout(function timeout() {
            c.notify('timeout')
            console.log('timeout')
        }, 2)
        // console.log('ex01: end main')
    }
}
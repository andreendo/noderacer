'use strict';
//example adapted from NodeAV paper - figure 01

const c = require('../happensbeforechecker')()
c.verify('immediate', 'exist').verify('exist', 'read')
c.verify('timeout', 'unlink')

const fs = require('fs')

module.exports = {
    ex01: function () {
        setImmediate(function cbImmediate() {
            c.notify('immediate')
            fs.exists('tmp.txt', function cbExist(exists) {
                c.notify('exist')
                if (exists)
                    fs.readFile('tmp.txt', 'utf8', function cbReadFile(err, data) {
                        c.notify('read')
                        if (err) throw err
                        console.log('file read : ' + data)
                    })
            })
        })

        setTimeout(function cbTimeout() {
            c.notify('timeout')
            fs.unlink('tmp.txt', function cbUnlink(err) {
                c.notify('unlink')
                if (err) throw err

                console.log('file removed')
            })
        }, 5)
    }
}
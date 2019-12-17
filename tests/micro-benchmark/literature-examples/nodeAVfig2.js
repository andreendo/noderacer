'use strict';
/**
 * adapted code from NodeAV paper, Figure 2
 */
const EventEmitter = require('events')
const fs = require('fs')

function ex01() {
    var x = { msg : undefined }

    class SubscribeEmitter extends EventEmitter {}
    let subscribeEmitter = new SubscribeEmitter()    

    subscribeEmitter.fileSnapshot = []

    subscribeEmitter.on('change', function cbSubscribe(message) {
        x.msg = message
        let f = this.fileSnapshot
        setTimeout(function cbTimeout() {
            console.log('timeout')
            if(x.msg) {
                f.push(x.msg) //record data sent to file
                fs.writeFile('log.txt', x.msg, function cbFs() {
                    console.log('fs')
                    x.msg = undefined
                })
            }
        }, 100)
        console.log('event change : ' + message)
    });    

    return subscribeEmitter
}

module.exports = { ex01 }
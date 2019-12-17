const c = require('../happensbeforechecker')()
c.verify('onEvent1', 'onEvent2')

const EventEmitter = require('events')

function ex01() {
  console.log('ex01: start main')
  class MyEmitter extends EventEmitter { }

  const myEmitter = new MyEmitter()
  myEmitter.on('event', () => {
    setImmediate(function onEvent() {
      c.notifyInstanceOf('onEvent')
    })
  })

  myEmitter.emit('event')
  myEmitter.emit('event')

  console.log('ex01: end main')
}

module.exports = {
  ex01: ex01
}
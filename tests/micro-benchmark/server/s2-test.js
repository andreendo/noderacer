const net = require('net')

let server = require('./s2').ex01()

let client1 = net.connect({ port: 8080 }, function c1_connect() {
    console.log('c1 connected to server!')
    client1.write('c1')
})

client1.on('data', function c1_onData(data) {
    console.log(data.toString())
})

let client2 = net.connect({ port: 8080 }, function c2_connect() {
    console.log('c2 connected to server!')
    client2.write('c2')
})

client2.on('data', function c2_onData(data) {
    console.log(data.toString())
})

setTimeout(function timeout() {
    client1.end()
    client2.end()

    server.close()
}, 3000)
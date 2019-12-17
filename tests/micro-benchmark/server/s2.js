const net = require('net');

function ex01() {
    let goodbye = 0
    const server = net.createServer(function s_socket(socket) {

        socket.on('data', function s_onData(data) {
            console.log('S>>client data: ' + data)
            socket.write('server-' + data)
        })

        goodbye++
        socket.write('goodbye ' + goodbye)
    })

    server.listen(8080, function s_onListen() {
        console.log('S>>opened server on', server.address())
    })

    return server
}

module.exports = { ex01 }
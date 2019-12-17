const http = require('http')

function ex01() {
    let count = 0

    function foo() { }

    function cb(req, res) {
        foo()
        res.writeHead(200, { 'Content-Type': 'text/html' })
        let txt = "Counter " + ++count
        console.log('server: ' + txt)
        res.end(txt)
    }

    return http.createServer(cb).listen(3000)
}

module.exports = { ex01 }
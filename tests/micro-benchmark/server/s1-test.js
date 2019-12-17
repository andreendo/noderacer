let server = require('./s1').ex01()

const rp = require('request-promise')

let req1 = rp('http://localhost:3000/').then((body) => {
    console.log(body)
})

let req2 = rp('http://localhost:3000/').then((body) => {
    console.log(body)
})

Promise.all([req1, req2]).then(() => {
    server.close()
})
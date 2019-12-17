module.exports = {
    ex01: function () {
        var p1 = new Promise(function p1_init_cb(resolve, reject) {
            setTimeout(function p1_resolve() {
                console.log('one')
                resolve('one')
            }, 2)
        })
        var p2 = new Promise(function p2_init_cb(resolve, reject) {
            setTimeout(function p2_resolve() {
                console.log('two')
                resolve('two')
            }, 1)
        })

        Promise.race([p1, p2])
            .then(function prace_cb(value) {
                console.log('race ' + value)
            })
    }
}
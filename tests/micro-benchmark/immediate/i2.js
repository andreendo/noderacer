const c = require('../happensbeforechecker')()
c.verify('imm01', 'imm02').verify('imm01', 'imm02_1').verify('imm01', 'imm02_2')
c.verify('imm02', 'imm01_1').verify('imm02', 'imm01_2')
c.verify('imm01_1', 'imm02_1').verify('imm01_1', 'imm02_2')
c.verify('imm01_2', 'imm02_1').verify('imm01_2', 'imm02_2')

module.exports = {
    ex01: function () {
        setImmediate(function imm01() {
            c.notify('imm01')
            setImmediate(function imm01_1() { 
                c.notify('imm01_1')
            })
            setImmediate(function imm01_2() { 
                c.notify('imm01_2')
            })
        })
        setImmediate(function imm02() {
            c.notify('imm02')
            setImmediate(function imm02_1() { 
                c.notify('imm02_1')
            })
            setImmediate(function imm02_2() { 
                c.notify('imm02_2')
            })
        })
    }
}
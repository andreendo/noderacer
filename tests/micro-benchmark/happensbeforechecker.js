'use strict';

class HappensBeforeChecker {
    constructor() {
        this.rules = new Map()
        this.happened = []
        this.instances = {}
    }

    verify(e1, e2) {
        let self = this
        if (!Array.isArray(e1)) e1 = [e1]
        if (!Array.isArray(e2)) e2 = [e2]

        e1.forEach(o1 => e2.forEach(o2 => self.addRule(o1, o2)))
        return self
    }

    addRule(e1, e2) {
        if (this.rules.has(e1))
            this.rules.get(e1).push(e2)
        else
            this.rules.set(e1, [e2])
    }

    notify(e) {
        let self = this
        let beforeList = this.rules.get(e) || []
        for (let ei of beforeList)
            if (self.happened.indexOf(ei) !== -1)
                throw `Violated order: ${ei} happens before ${e}`

        self.happened.push(e)
    }

    notifyInstanceOf(e) {
        this.instances[e] = this.instances[e] || 0
        this.instances[e]++
        this.notify(e + this.instances[e])
    }
}

module.exports = function () { return new HappensBeforeChecker() }
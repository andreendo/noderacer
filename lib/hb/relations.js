const _ = require('lodash');
const Graph = require('@dagrejs/graphlib').Graph;
const dijkstraAll = require('@dagrejs/graphlib').alg.dijkstraAll;

class Relations {
    constructor(pHb) {
        if (arguments.length === 0)
            this.hb = [];
        else
            this.hb = pHb;
    }

    add(a, b, type) {
        this.hb.push({ a, b, type });
    }

    remove(a, b) {
        _.remove(this.hb, (r) => r.a === a && r.b === b);
    }

    registeredInSameTick(aid, bid) {
        let pa = this.hb.find((h) => h.b === aid && h.type === 'registration');
        let pb = this.hb.find((h) => h.b === bid && h.type === 'registration');
        if (!pa || !pb)
            return false;

        return pa.a === pb.a;
    }

    registeredIn(aid) {
        let r = this.hb.find((h) => h.b === aid && h.type === 'registration');
        if (r)
            return r.a;
        return null;
    }

    resolvedIn(aid) {
        let r = this.hb.find((h) => h.b === aid && h.type === 'promise-resolve');
        if (r)
            return r.a;
        return null;
    }

    getRegisteredBy(aid) {
        return this.hb
            .filter((h) => h.a === aid && h.type === 'registration')
            .map((h) => h.b);
    }

    findDirectRelation(aoi, aoj) {
        return this.hb.find((r) => r.a === aoi && r.b === aoj);
    }

    happensBefore(aoi, aoj) {
        let visited = {};
        let rels = this.hb.filter(r => r.a === aoi);
        while (rels.length > 0) {
            let relation = rels.pop();
            if (!visited[relation.b]) {
                visited[relation.b] = true;

                if (relation.b === aoj)
                    return true;
                else {
                    let ind_rels = this.hb.filter(r => r.a === relation.b);
                    rels.push(...ind_rels);
                }
            }
        }
        return false;
    }

    startGraphLibDataStructure(nodes) {
        let graph = new Graph();
        nodes.forEach(n => graph.setNode(n.id));
        this.hb.forEach(r => graph.setEdge(r.a, r.b));
        this.graph = dijkstraAll(graph);
    }

    happensBeforeWithGraphLib(aoi, aoj) {
        return this.graph[aoi][aoj].distance > 0
            && this.graph[aoi][aoj].distance !== Number.POSITIVE_INFINITY;
    }

    removeIncomingTo(id) {
        _.remove(this.hb, (r) => r.b === id && r.type === 'promise-resolve');
    }
}

module.exports = Relations
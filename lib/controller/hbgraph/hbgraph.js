const Graph = require('./graph');

class HBGraph {
    constructor(hbi) {
        this.hbi = hbi;
        this.g = this.buildGraph(hbi);
        this.cleanupGraph();
    }

    buildGraph(hbi) {
        let g = new Graph();
        hbi.asyncObjects.getAll().forEach((obj) => {
            g.addNode(obj.id);
        });
        hbi.relations.hb.forEach((r) => {
            if (r.type && r.type.startsWith('promise-race-'))
                g.addEdge(r.a, r.b, r.type.replace('promise-race-', ''));
            else
                g.addEdge(r.a, r.b);
        });
        return g;
    }

    cleanupGraph() {
        let self = this;
        let noDepNodes = self.g.getNodesWithNoDependencies();
        let remove = false;
        noDepNodes.forEach((n) => {
            let asyncObject = self.hbi.asyncObjects.findAsyncObjectsById(n);
            if (!asyncObject.callback) {      //it is not a node with callback
                self.g.disable(n);
                remove = true;
            }
        });
        if (remove) this.cleanupGraph(); //by removing, others may attend the rule
    }

    find(fn) {
        let self = this;
        //findAllPossibleAsyncObjects(with fn) active in g and not used
        let objs = self.hbi.asyncObjects
            .findAsyncObjectsByFunction(fn)
            .filter((o) => !o.used);

        //make sure it is ordered by instance ascending
        objs.sort((a, b) => (a.callback.instance > b.callback.instance) ? 1 : -1);

        //select the first of the ones with no dependency first
        for (let obj of objs) {
            if (this.mayHappen(obj)) {
                obj.used = true;
                return obj;
            }
        }
        if (objs.length === 0) //cbs are all used (likely new cb shows up)
            return null;       //'error finding the callback';

        //otherwise, select the first of th ones with some dependency
        objs[0].used = true;
        return objs[0];
    }

    mayHappen(asyncObject) {
        let node = this.g.find(asyncObject.id);
        return node.indegree === 0;             //true - (no dependency on h-b)        
    }

    mayPostpone(asyncObject) {
        let nodes = this.g.getNodesWithNoDependencies();            //no dependency and
        return nodes.includes(asyncObject.id) && nodes.length > 1;  //other callbacks
    }

    notifyRunOf(asyncObjectId) {
        this.g.disable(asyncObjectId);
        this.cleanupGraph();
    }
}

module.exports = HBGraph;
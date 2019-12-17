class Graph {
    constructor() {
        this._nodes = [];
        this._edges = [];
    }

    addNode(n) {
        this._nodes.push({ n, indegree: 0, enabled: true });
    }

    addEdge(ni, nj, opt) {
        if (opt)
            this._edges.push({ ni, nj, enabled: true, opt });
        else
            this._edges.push({ ni, nj, enabled: true });
        let nnj = this.find(nj);
        if (nnj) nnj.indegree++;
    }

    getEdges() {
        return this._edges;
    }

    isEmpty() {
        return !this._nodes.find(n => n.enabled === true);
    }

    find(n) {
        return this._nodes.find(_ => _.n == n);
    }

    disable(n) {
        if (this.find(n).enabled) {
            this.find(n).enabled = false;
            this._edges.filter(e => e.ni === n).forEach(e => {
                this.disableEdge(e);
            });

            this._edges.filter(e => e.nj === n).forEach(e => {
                this.disableEdge(e);
            });
        }
    }

    enable(n) {
        this.find(n).enabled = true;
        this._edges.filter(e => e.ni === n).forEach(e => {
            this.find(e.nj).indegree++;
            e.enabled = true;
        });

        this._edges.filter(e => e.nj === n).forEach(e => {
            e.enabled = true;
        });
    }

    getNodesWithNoDependencies() {
        return this._nodes
            .filter(n => n.enabled && n.indegree === 0)
            .map(n => n.n);
    }

    disableEdge(e) {
        if (e.enabled) {
            let self = this;
            self.find(e.nj).indegree--;
            e.enabled = false;
            if (e.opt) {
                self._edges.filter(oe => oe.enabled && oe.opt && oe.opt === e.opt) //find all edges with same opt
                    .forEach(oe => {
                        oe.enabled = false;             //disable them
                        self.find(oe.nj).indegree--;
                    });
            }
        }
    }

    show() {
        console.log(this._nodes);
        console.log(this._edges);
    }
}

module.exports = Graph;
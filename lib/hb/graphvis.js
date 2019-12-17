let graphviz = require('graphviz');

function generateGraphImage(figName, { nodes, edges }) {
    let __ = (function() {
        let pref = calculatePrefix(nodes.filter((n) => n.callback).map((n) => n.callback.file));
        return function(s) {
            return s.replace(pref, '');
        }
    })();

    let vertex = {};
    let g = graphviz.digraph("G");
    g.set('ordering', 'in');
    nodes.forEach(e => {
        let label = `[${e.id} - ${e.entry.id}]`;
        if (e.callback) {
            label += ` ${e.callback.name} @ ${__(e.callback.file)} L:${e.callback.line} I:${e.callback.instance}`;
        }
        vertex[e.id] = g.addNode(label);
    });

    edges.forEach(e => {
        if (vertex[e.a] && vertex[e.b])
            g.addEdge(vertex[e.a], vertex[e.b], { label: e.type });
    });

    console.log(figName);
    g.output("png", figName);
}

function calculatePrefix(array) {
    let prefix = sharedStart(array);
    if(prefix.length !== array[0].length) {
        if(! prefix.endsWith('/')) {
            let t = prefix.split('/');
            t.pop();
            prefix = t.join('/') + '/';
        }
        return prefix;
    }   
    
    return array[0].replace(prefix.split('/').reverse()[0], '');        
}

function sharedStart(array) {
    var A = array.concat().sort(),
        a1 = A[0], a2 = A[A.length - 1], L = a1.length, i = 0;
    while (i < L && a1.charAt(i) === a2.charAt(i)) i++;
    return a1.substring(0, i);
}

module.exports = generateGraphImage;
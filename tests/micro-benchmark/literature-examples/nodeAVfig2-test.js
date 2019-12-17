'use strict';

let e = require('./nodeAVfig2').ex01();

setImmediate( () => e.emit('change', 'change-1') );
setTimeout( () => e.emit('change', 'change-2'), 200 );

process.on('exit', () => {
    if(e.fileSnapshot.length != 2)
        throw '2 msgs expected';
    if(e.fileSnapshot.indexOf('change-1') == -1)
        throw 'change-1 not in file';    
    if(e.fileSnapshot.indexOf('change-2') == -1)
        throw 'change-2 not in file';        
});
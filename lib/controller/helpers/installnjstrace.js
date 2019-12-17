function installNjstrace(config) {
    let Formatter = require('../../../njstrace/lib/formatter.js');
    function MyFormatter() { }
    require('util').inherits(MyFormatter, Formatter);
    MyFormatter.prototype.onEntry = function () { };
    MyFormatter.prototype.onExit = function () { };
    if (config)
        require('../../../njstrace/njsTrace').inject({ formatter: new MyFormatter(), files: config });
    else
        require('../../../njstrace/njsTrace').inject({ formatter: new MyFormatter() });

    global.NR_CONTROLLER_INSTRUMENTATION = true;
}

module.exports = installNjstrace;
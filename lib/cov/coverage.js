const wrapper = require.resolve('./covwrap.js');

const fs = require('fs');
const sw = require('spawn-wrap');
const foreground = require('foreground-child');

function coverage(args) {
    if (!fs.existsSync(args.hbfile))
        throw `file ${args.hbfile} does not exist.`;

    sw([wrapper], { hbfile: args.hbfile });
    foreground(args.command, (done) => {
        return done();
    });
}

module.exports = coverage;
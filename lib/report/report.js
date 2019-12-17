const fs = require('fs');
const open = require('open');

const HistoryDAO = require('./models/historyDao');

function report(args) {
    if (!fs.existsSync(args.dirpath))
        throw 'folder does not exist.';
    if (!fs.lstatSync(args.dirpath).isDirectory())
        throw 'it is not a folder.';

    //start express server (with dirpath)
    const app = require('./app');
    app.locals.__settings = { mainfolder: args.dirpath };
    const dao = new HistoryDAO();
    dao.addIfNotExists(args.dirpath);
    const server = app.listen(3000, () => {
        console.log(`Express is running on port ${server.address().port}`);

        //open browser
        open('http://localhost:3000');
    });
}

module.exports = report;
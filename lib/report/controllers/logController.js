const LogFileDao = require('../models/logFileDao');

exports.index = (req, res) => {
    const dao = new LogFileDao(req.app.locals.__settings.mainfolder);
    dao.getFiles().then((files) => {
        res.render('logger/log', { page: 'log', files });
    });
};

exports.file = (req, res) => {    
    const dao = new LogFileDao(req.app.locals.__settings.mainfolder);
    dao.extractFile(req.params.filename).then((result) => {
        res.render('logger/file', { page: 'log file', ...result });    
    });
};
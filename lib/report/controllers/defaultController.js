const fs = require('fs');
const HistoryDAO = require('../models/historyDao');
const dao = new HistoryDAO();

exports.index = (req, res) => {
    res.render('index', {
        mainFolder: req.app.locals.__settings.mainfolder,
        page: 'index',
        history: dao.getHistory()
    });
};

exports.changefolder = (req, res) => {
    fs.stat(req.body.path, (err, stat) => {
        if (!err && stat.isDirectory()) {
            req.app.locals.__settings.mainfolder = req.body.path;
            dao.addIfNotExists(req.body.path);
        }
        res.redirect('/');
    });
};
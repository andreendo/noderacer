const HbDAO = require('../models/hbDao');

exports.index = (req, res) => {
    res.render('hb/hb', { page: 'hb' });
};

exports.full = (req, res) => {
    const dao = new HbDAO(req.app.locals.__settings.mainfolder);
    dao.collectFullStats().then((result) => {
        res.render('hb/full', { page: 'hb - full', ...result });
    });
};

exports.reduced = (req, res) => {
    res.render('hb/reduced', { page: 'hb - reduced' });
};
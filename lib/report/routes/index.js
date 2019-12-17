const express = require('express');
const router = express.Router();

const { defaultController, logController, hbController, controlController } = require('../controllers');

router.get('/', defaultController.index);

router.post('/changefolder', defaultController.changefolder);

router.get('/log', logController.index);

router.get('/log/file/:filename', logController.file);

router.get('/hb', hbController.index);

router.get('/hb/full', hbController.full);

router.get('/hb/reduced', hbController.reduced);

router.get('/control', controlController.index);

module.exports = router;
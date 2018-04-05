const express = require('express');
const router = express.Router();
const logger = require('../config/winston');

router.get('/timestamp', function(req, res, next) {
    var redirect = req.query.redirect || '/home';
    var vse = req.query.vse;
    var timestamp = req.query.timestamp;
    logger.info('/preview');
    logger.debug('timestamp: ' + timestamp);
    logger.debug('vse: ' + vse);
    res.cookie('amplience-host', vse);
    res.cookie('timestamp', timestamp);
    res.redirect(redirect);
});

router.get('/current', function(req, res, next) {
    logger.info('/preview/current')
    var redirect = req.query.redirect || '/';
    res.clearCookie('amplience-host');
    res.clearCookie('timestamp');
    res.redirect('back');
});

module.exports = router;

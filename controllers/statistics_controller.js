var models = require('../models/models.js');

// GET /quizes/statistics
exports.index = function(req, res) {
    res.render('quizes/statistics', { quizes: quizes, errors: [] });
}

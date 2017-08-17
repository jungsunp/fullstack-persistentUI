var Promise = require('bluebird');
var router = require('express').Router();
var Hotel = require('../../models').Hotel;

module.exports = router;

router.get('/', (req, res) => {
  Hotel.findAll()
    .then(hotels => res.json(hotels));
});


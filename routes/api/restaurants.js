var Promise = require('bluebird');
var router = require('express').Router();
var Restaurant = require('../../models').Restaurant;

module.exports = router;

router.get('/', (req, res) => {
  Restaurant.findAll()
    .then(restaurants => res.json(restaurants));
});



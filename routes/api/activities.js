var Promise = require('bluebird');
var router = require('express').Router();
var Activity = require('../../models').Activity;

module.exports = router;

router.get('/', (req, res) => {
  Activity.findAll()
    .then(activities => res.json(activities));
});

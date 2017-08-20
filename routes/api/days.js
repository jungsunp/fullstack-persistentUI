var Promise = require('bluebird');
var router = require('express').Router();
var { Hotel, Restaurant, Activity, Day } = require('../../models');

module.exports = router;

// get all days with associated hotels, rests, acts
router.get('/', function(req, res, next){
  Day.findAll({
    include: [Hotel, Restaurant, Activity],  // eager loading
    order: ['number']
  })
    .then((days) => {
      res.status(200).send(days);
    })
    .catch(next);
});

// get a specific day
router.get('/:id', function(req, res, next){
  Day.findById(req.params.id)
    .then((day) => {
      res.stat(200).send(day);
    })
    .catch(next);
});

// create a new day
router.post('/', function(req, res, next){
  Day.create(req.body)
    .then((day) => {
      res.status(201).send(day);
    })
    .catch(next);
});

// delete a given day
router.delete('/:id', function(req, res, next){
  Day.findById(req.params.id)
    .then(day => {
      return day.destroy();  // you need to use it this way instead of Day.destroy({...}) so that beforeDestory hook on Day model runs
    })
    .then(() => {
      res.sendStatus(204); // no content
    })
    .catch(next);
});

// helper function to reduce redundancy
router.param('dayId', function (req, rex, next, theDayId) {
  Day.findById(theDayId)
    .then(function (foundDay) {
      req.day = foundDay;
      next();
    })
    .catch(next);
});

// resgister a hotel to a day
router.put('/:dayId/hotel/', function (req, res, next) {
  req.day.setHotel(req.body.hotelId)
    .then(day => {
      res.sendStatus(204);
    })
    .catch(next);
});

// resgister restaurant to a day
router.put('/:dayId/restaurants', function (req, res, next) {
  req.day.addRestaurant(req.body.restaurantId)
    .then(day => {
      res.sendStatus(204);
    })
    .catch(next);
});

// resgister activities to a day
router.put('/:dayId/activities', function (req, res, next) {
  req.day.addActivity(req.body.activityId)
    .then(day => {
      res.sendStatus(204);
    })
    .catch(next);
});

// remove a hotel from a day
router.delete('/:dayId/hotel', function (req, res, next) {
  req.day.setHotel(null)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
});

// remove restaurants from a day
router.delete('/:dayId/restaurants/:restaurantId', function (req, res, next) {
  req.day.removeRestaurant(req.params.restaurantId)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
});

// remove activities from a day
router.delete('/:dayId/activities/:activityId', function (req, res, next) {
  req.day.removeActivity(req.params.activityId)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
});


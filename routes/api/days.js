var Promise = require('bluebird');
var router = require('express').Router();
var { Hotel, Restaurant, Activity, Day } = require('../../models');

module.exports = router;

router.get('/', function(req,res,next){
  Day.findAll().then((days) => {
    console.log(days);
    res.json(days);
  })
})

router.get('/:id', function(req,res,next){
  Day.findById(req.params.id).then((day) => {
    res.json(day);
  })
})

router.delete('/:id', function(req,res,next){
  Day.findById(req.params.id).then((day) => {
    return day.destory()
  })
  .then(() => {
    res.sendStatus(200);
  })
})

router.post('/', function(req,res,next){
  Day.create(req.body)
  .then((day) => {
    res.json(day);
  })
})


router.post('/:dayId/restaurant/:restId', function (req, res) {
  Day.findById(req.params.dayId)
    .then(day => {
      return day.addRestaurant(req.params.restId);
    })
    .then(day => {
      res.json(day);
    });
})

router.post('/:dayId/hotel/:hotelId', function (req, res) {
  Day.findById(req.params.dayId)
    .then(day => {
      return day.addHotel(req.params.hotelId);
    })
    .then(day => {
      res.json(day);
    });
})

router.post('/:dayId/activity/:activityId', function (req, res) {
  Day.findById(req.params.dayId)
    .then(day => {
      return day.addActivity(req.params.activityId);
    })
    .then(day => {
      res.json(day);
    });
})

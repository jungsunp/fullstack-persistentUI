var Promise = require('bluebird');
var router = require('express').Router();
var { Hotel, Restaurant, Activity, Day } = require('../../models');

module.exports = router;

router.get('/', function(req,res,next){
  Day.findAll({
    include: [Hotel, Restaurant, Activity],
    order: ['number']
  })
    .then((days) => {
      res.json(days);
    });
});

router.get('/:id', function(req, res, next){
  Day.findById(req.params.id).then((day) => {
    res.json(day);
  });
});

router.delete('/:id', function(req, res, next){
  Day.findById(req.params.id).then((day) => {
    return day.destroy();
  })
  .then(() => {
    res.sendStatus(200);
  });
});

router.post('/', function(req,res,next){
  Day.create(req.body)
  .then((day) => {
    res.json(day);
  });
});

router.get('/:dayId/restaurants/', function (req, res) {
  Day.findById(req.params.dayId)
    .then(day => {
      return day.getRestaurants();
    })
    .then(restaurants => {
      res.json(restaurants);
    });
});

router.get('/:dayId/hotels/', function (req, res) {
  Day.findById(req.params.dayId)
    .then(day => {
      return day.getHotel();
    })
    .then(hotel => {
      res.json(hotel);
    });
});

router.get('/:dayId/activities/', function (req, res) {
  Day.findById(req.params.dayId)
    .then(day => {
      return day.getActivities();
    })
    .then(activities => {
      res.json(activities);
    });
});

router.post('/:dayId/restaurant/:restId', function (req, res) {
  Day.findById(req.params.dayId)
    .then(day => {
      return day.addRestaurant(req.params.restId);
    })
    .then(day => {
      return Restaurant.findById(req.params.restId);
    })
    .then(restaurant => {
      res.json(restaurant);
    })
    .catch(err => {
      console.log(err);
    });
});

router.post('/:dayId/hotel/:hotelId', function (req, res) {
  Day.findById(req.params.dayId)
    .then(day => {
      return day.setHotel(req.params.hotelId);
    })
    .then(day => {
      return Hotel.findById(req.params.hotelId);
    })
    .then(hotel => {
      console.log('hotel: ', hotel);
      res.json(hotel);
    })
    .catch(err => {
      console.log(err);
    });
});

router.post('/:dayId/activity/:activityId', function (req, res) {
  Day.findById(req.params.dayId)
    .then(day => {
      return day.addActivity(req.params.activityId);
    })
    .then(day => {
      return Activity.findById(req.params.activityId);
    })
    .then(activity => {
      res.json(activity);
    })
    .catch(err => {
      console.log(err);
    });
});

router.delete('/:dayId/restaurant/:restId', function (req, res) {
  Day.findById(req.params.dayId)
    .then(day => {
      return day.removeRestaurant(req.params.restId);
    })
    .then(() => {
      res.sendStatus(200);
    });
});

router.delete('/:dayId/hotel/:hotelId', function (req, res) {
  Day.findById(req.params.dayId)
    .then(day => {
      return day.removeHotel(req.params.hotelId);
    })
    .then(() => {
      res.sendStatus(200);
    });
});

router.delete('/:dayId/activity/:activityId', function (req, res) {
  Day.findById(req.params.dayId)
    .then(day => {
      return day.removeActivity(req.params.activityId);
    })
    .then(() => {
      res.sendStatus(200);
    });
});


var router = require('express').Router();

router.get('/', function(req, res, next) {

  res.render('index');

  // Promise.all([
  //   // Hotel.findAll(),
  //   // Restaurant.findAll(),
  //   // Activity.findAll()
  // ])
  // .spread(function(dbHotels, dbRestaurants, dbActivities) {
  //   // res.render('index', {
  //   //   templateHotels: dbHotels,
  //   //   templateRestaurants: dbRestaurants,
  //   //   templateActivities: dbActivities
  //   // });
  //   res.render('index');
  // })
  // .catch(next);
});

module.exports = router;

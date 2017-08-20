var Sequelize = require('sequelize');
var db = require('./_db');

var Day = db.define('day', {
  number: Sequelize.INTEGER
});

Day.beforeDestroy(dayBeingDestroyed => {
  Day.findAll({
    where: {
      number: {
        $gt: dayBeingDestroyed.number
      }
    }
  })
    .then( afterDays => {
      var updatingDayNumberPromises = afterDays.map(day => {
        day.number--;
        return day.save();
      });
      return Promise.all(updatingDayNumberPromises);
    });
});

module.exports = Day;



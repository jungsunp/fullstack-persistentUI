'use strict';
/* global $ dayModule attractionModule */

/**
 * A module for managing multiple days & application state.
 * Days are held in a `days` array, with a reference to the `currentDay`.
 * Clicking the "add" (+) button builds a new day object (see `day.js`)
 * and switches to displaying it. Clicking the "remove" button (x) performs
 * the relatively involved logic of reassigning all day numbers and splicing
 * the day out of the collection.
 *
 * This module has four public methods: `.load()`, which currently just
 * adds a single day (assuming a priori no days); `switchTo`, which manages
 * hiding and showing the proper days; and `addToCurrent`/`removeFromCurrent`,
 * which take `attraction` objects and pass them to `currentDay`.
 */

var tripModule = (function () {

  // application state

  var days = [],
    currentDay;

  // jQuery selections

  var $addButton, $removeButton;
  $(function () {
    $addButton = $('#day-add');
    $removeButton = $('#day-title > button.remove');
  });

  // method used both internally and externally

  function switchTo(newCurrentDay) {
    if (currentDay) currentDay.hide();
    currentDay = newCurrentDay;
    currentDay.show();
    console.log('current DAy:', currentDay)
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~
  // before calling `addDay` or `deleteCurrentDay` that update the frontend (the UI), we need to make sure that it happened successfully on the server
  // ~~~~~~~~~~~~~~~~~~~~~~~
  $(function () {
    $addButton.on('click', addDay);
    $removeButton.on('click', deleteCurrentDay);
  });



  // ~~~~~~~~~~~~~~~~~~~~~~~
  // `addDay` may need to take information now that we can persist days -- we want to display what is being sent from the DB
  // ~~~~~~~~~~~~~~~~~~~~~~~
  function addDay() {
    if (this && this.blur) this.blur(); // removes focus box from buttons

    $.post('/api/days', {
      number: days.length + 1
    })
      .then((day) => {
        var newDay = dayModule.create({ number: day.number, _id: day.id });
        days.push(newDay);
        switchTo(newDay);
      })
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~
  // Do not delete a day until it has already been deleted from the DB
  // ~~~~~~~~~~~~~~~~~~~~~~~
  function deleteCurrentDay() {
    // prevent deleting last day
    if (days.length < 2 || !currentDay) return;
    // remove from the collection
    var index = days.indexOf(currentDay),
      previousDay = days.splice(index, 1)[0],
      newCurrent = days[index] || days[index - 1];
    // fix the remaining day numbers
    days.forEach(function (day, i) {
      day.setNumber(i + 1);
    });
    switchTo(newCurrent);
    previousDay.hideButton();
  }

  // globally accessible module methods

  var publicAPI = {

    load: function () {

      // ~~~~~~~~~~~~~~~~~~~~~~~
      //If we are trying to load existing Days, then let's make a request to the server for the day. Remember this is async. For each day we get back what do we need to do to it?
      // ~~~~~~~~~~~~~~~~~~~~~~~

      $.get('/api/days')
        .then((dataDays) => {
          var newDay;
          if (dataDays.length === 0) {
            $.post('/api/days', {
              number: 1
            })
              .then((day) => {
                newDay = dayModule.create({ number: 1, _id: day.id });
                days.push(newDay);
                currentDay = newDay;
                switchTo(newDay);
              });
          }
          else {
            dataDays.forEach((day) => {
              newDay = dayModule.create({ number: day.number, _id: day.id });
              days.push(newDay);
            });
            currentDay = newDay;
            switchTo(newDay);

            days.forEach((day) => {

              let attraction;
              let types = ['restaurants', 'activities'];
              for (var i = 0; i < types.length; i++) {
                $.get(`/api/days/${day._id}/${types[i]}`)
                  .then(function (dbAttractions) {
                    if (!dbAttractions) return;
                    dbAttractions.forEach((dbAttraction) => {
                      attraction = attractionModule.create(dbAttraction);
                      day.addAttraction(attraction);
                    });
                  });
              }

              $.get(`/api/days/${day._id}/hotels`)
                .then(function (dbHotel) {
                  if (!dbHotel) return;
                  attraction = attractionModpromiseHotelule.create(dbHotel);
                  day.addAttraction(attraction);
                });
            });
          }
        });
    },

    switchTo: switchTo,

    addToCurrent: function (attraction) {
      $.post(`/api/days/${currentDay._id}/${attraction.type}/${attraction.id}`)
        .then((dbAttraction) => {
          let frontAttraction = attractionModule.create(dbAttraction);
          currentDay.addAttraction(frontAttraction);
        });
    },

    removeFromCurrent: function (attraction) {
      currentDay.removeAttraction(attraction);
    }

  };

  return publicAPI;

}());

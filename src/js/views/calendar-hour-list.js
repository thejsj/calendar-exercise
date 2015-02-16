'use strict';
var React = require('react');
var moment = require('moment');

var CalendarHourList = React.createClass({
  getAllHourStrings: function () {
    var allStrings = [];
    for (var i = 0; i <= 720; i += 30) {
      var time =  moment('9:00', 'HH:mm').add(i, 'minutes');
      allStrings.push({
        index: i,
        style: {
          top: (i - 7) + 'px',
        },
        isHourMark: (i % 60 === 0),
        timeString: time.format('h:mm'),
        amPmString: time.format('a'),
      });
    }
    return allStrings;
  },
  render: function() {
    var allTimeStrings = this.getAllHourStrings();
    return (
      <div className='calendar-hour-list-container'>
          {allTimeStrings.map(function(time, i) {
            return (
            <div key={ i }className={ 'hour is-hour-mark-' + time.isHourMark } style={ time.style } >
              <span className='time'>{ time.timeString }</span> <span className='am-or-pm'>{ time.amPmString }</span>
            </div>
            );
          }, this)}
      </div>
    );
  }
});

module.exports = CalendarHourList;
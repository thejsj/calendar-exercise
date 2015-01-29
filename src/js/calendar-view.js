'use strict';
var React = require('react');
var CalendarHourList = require('./calendar-hour-list');
var CalenderEventList = require('./calendar-event-list');

var CalendarView = React.createClass({
  render: function() {
    return (
      <div className='calendar-container'>
        <CalendarHourList />
        <CalenderEventList events={ this.props.eventCollection.events } />
      </div>
    );
  }
});

module.exports = CalendarView;
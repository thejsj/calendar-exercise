'use strict';
var React = require('react');
var _ = require('lodash');

var CalenderEventList = React.createClass({
  decorateDataForStyling: function (events) {
    _.forEach(events, function (calenderEvent) {
      calenderEvent.style =  {
        top: calenderEvent.start,
        height: calenderEvent.end - calenderEvent.start,
        left: (calenderEvent.xStart * 100) + '%',
        width: (calenderEvent.width * 100) + '%'
      };
    });
    return events;
  },
  render: function() {
    var calendarEvents = this.decorateDataForStyling(this.props.events);
    return (
      <div className='calendar-event-list-container'>
        <div className='calendar-event-list'>
          {calendarEvents.map(function(item, i) {
            return (
              <div key={ item.id } className='calendar-event' style={ item.style }>
                <div className='calendar-border'></div>
                <div className='calendar-content'>
                  <h3 className='calendar-event-header'>Sample Item</h3>
                  <p className='calendar-event-location'>Sample Location</p>
                </div>
              </div>
            );
          }, this)}
        </div>
      </div>
    );
  }
});

module.exports = CalenderEventList;
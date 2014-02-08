/** @jsx React.DOM */

Fresh.widgets.List = React.createClass({
  /**
   * Input: {
   *   widget: 'List',
   *   data: 'http://localhost/static/users.json'
   * }
   */
  mixins: [Fresh.mixins.SetIntervalMixin,
           Fresh.mixins.DataManagerMixin],
  render: function() {
    return (
      <ul className="List">
        {this.state.data.map(function(item, index) {
          var itemWidget = Fresh.getWidgetByName(item.widget);
          return <li key={index}>{itemWidget(item)}</li>
        })}
      </ul>
    );
  }
});

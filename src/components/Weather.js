import React, { PropTypes, Component } from 'react'

export default class Weather extends Component {
  render() {
    return (
      <pre>{JSON.stringify(this.props.weather, null, 2)}</pre>
    )
  }
}

Weather.propTypes = {
  weather: PropTypes.object.isRequired
}
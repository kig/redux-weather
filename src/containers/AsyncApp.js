import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { selectLocation, fetchWeatherIfNeeded, invalidateLocation } from '../actions/actions'
import Picker from '../components/Picker'
import Weather from '../components/Weather'

class AsyncApp extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
  }

  componentDidMount() {
    const { dispatch, selectedLocation } = this.props
    dispatch(fetchWeatherIfNeeded(selectedLocation))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedLocation !== this.props.selectedLocation) {
      const { dispatch, selectedLocation } = nextProps
      dispatch(fetchWeatherIfNeeded(selectedLocation))
    }
  }

  handleChange(nextLocation) {
    this.props.dispatch(selectLocation(nextLocation))
  }

  handleRefreshClick(e) {
    e.preventDefault()

    const { dispatch, selectedLocation } = this.props
    dispatch(invalidateLocation(selectedLocation))
    dispatch(fetchWeatherIfNeeded(selectedLocation))
  }

  render() {
    const { selectedLocation, weather, isFetching, lastUpdated } = this.props
    return (
      <div>
        <Picker value={selectedLocation}
                onChange={this.handleChange}
                options={[ 'London', 'Paris' ]} />
        <p>
          {lastUpdated &&
            <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
              {' '}
            </span>
          }
          {!isFetching &&
            <a href='#'
               onClick={this.handleRefreshClick}>
              Refresh
            </a>
          }
        </p>
        {isFetching && !weather &&
          <h2>Loading...</h2>
        }
        {!isFetching && !weather &&
          <h2>Empty.</h2>
        }
        {weather &&
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <Weather weather={weather} />
          </div>
        }
      </div>
    )
  }
}

AsyncApp.propTypes = {
  selectedLocation: PropTypes.string.isRequired,
  weather: PropTypes.object,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { selectedLocation, weatherByLocation } = state
  const {
    isFetching,
    lastUpdated,
    weather: weather
  } = weatherByLocation[selectedLocation] || {
    isFetching: true
  }

  return {
    selectedLocation,
    weather,
    isFetching,
    lastUpdated
  }
}

export default connect(mapStateToProps)(AsyncApp)
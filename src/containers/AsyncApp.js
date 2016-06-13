import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { selectLocation, fetchWeatherIfNeeded, invalidateLocation, goToMyLocation } from '../actions/actions'
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

  handleGoToMyLocation() {
    console.log(this)
    this.props.dispatch(goToMyLocation())
  }

  handleRefreshClick(e) {
    e.preventDefault()

    const { dispatch, selectedLocation } = this.props
    dispatch(invalidateLocation(selectedLocation))
    dispatch(fetchWeatherIfNeeded(selectedLocation))
  }

  render() {
    const { selectedLocation, weather, locationChanged, isFetching, lastUpdated, myLocation } = this.props
    return (
      <div>
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
          <Weather
            weather={weather}
            location={selectedLocation}
            locationChanged={locationChanged}
            locating={myLocation.isFetching}
            myLocation={myLocation.location}
            onGoToMyLocation={this.handleGoToMyLocation.bind(this)}
            onChange={this.handleChange}
          />
        }
      </div>
    )
  }
}

AsyncApp.propTypes = {
  selectedLocation: PropTypes.string.isRequired,
  weather: PropTypes.object,
  locationChanged: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  myLocation: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { selectedLocation, weatherByLocation, myLocation } = state
  const {
    isFetching,
    lastUpdated,
    locationChanged,
    weather
  } = weatherByLocation[selectedLocation] || {
    locationChanged: true,
    isFetching: true
  }

  return {
    selectedLocation,
    locationChanged,
    weather,
    isFetching,
    lastUpdated,
    myLocation
  }
}

export default connect(mapStateToProps)(AsyncApp)
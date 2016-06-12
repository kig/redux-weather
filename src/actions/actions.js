import fetch from 'isomorphic-fetch'

export const REQUEST_WEATHER = 'REQUEST_WEATHER'
export const RECEIVE_WEATHER = 'RECEIVE_WEATHER'
export const SELECT_LOCATION = 'SELECT_LOCATION'
export const INVALIDATE_LOCATION = 'INVALIDATE_LOCATION'

export function selectLocation(location) {
  return {
    type: SELECT_LOCATION,
    location: location
  }
}

export function invalidateLocation(location) {
  return {
    type: INVALIDATE_LOCATION,
    location: location
  }
}

function requestWeather(location) {
  return {
    type: REQUEST_WEATHER,
    location: location
  }
}

function receiveWeather(location, json) {
  return {
    type: RECEIVE_WEATHER,
    location: location,
    weather: json,
    receivedAt: Date.now()
  }
}

function fetchWeather(location) {
  return dispatch => {
    dispatch(requestWeather(location))
	if (location.latitude) {
		var queryURL = 'http://api.openweathermap.org/data/2.5/weather?lat='+encodeURIComponent(location.latitude)+'&lon='+encodeURIComponent(location.longitude)+'&units=metric&APPID=' + process.env.APPID;
	} else {
		var queryURL = 'http://api.openweathermap.org/data/2.5/weather?q='+encodeURIComponent(location)+'&units=metric&APPID=' + process.env.APPID;
	}
    return fetch(queryURL)
      .then(response => response.json())
      .then(json => dispatch(receiveWeather(location, json)))
  }
}

function shouldFetchWeather(state, location) {
  const weather = state.weatherByLocation[location]
  if (!weather) {
    return true
  } else if (weather.isFetching) {
    return false
  } else {
    return weather.didInvalidate
  }
}

export function fetchWeatherIfNeeded(location) {
  return (dispatch, getState) => {
    if (shouldFetchWeather(getState(), location)) {
      return dispatch(fetchWeather(location))
    }
  }
}
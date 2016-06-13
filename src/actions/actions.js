import fetch from 'isomorphic-fetch'

export const REQUEST_MY_LOCATION = 'REQUEST_MY_LOCATION'
export const RECEIVE_MY_LOCATION = 'RECEIVE_MY_LOCATION'

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

function requestMyLocation() {
	return {
		type: REQUEST_MY_LOCATION
	}
}

function receiveMyLocation(location) {
	return {
		type: RECEIVE_MY_LOCATION,
		location: location,
		receivedAt: Date.now()
	}
}

function getGeolocation(goToLocation) {
	return dispatch => {
		dispatch(requestMyLocation())
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				function(pos) {
					var location = pos.coords.latitude + "," + pos.coords.longitude;
					dispatch(receiveMyLocation(location))
					if (goToLocation)
						dispatch(selectLocation(location))
				},
				function(error) {
					dispatch(receiveMyLocation(window.geoIPLocation))
					if (goToLocation)
						dispatch(selectLocation(window.geoIPLocation))
				},
				{
					enableHighAccuracy: true, timeout: 5000
				}
			);
		} else {
			dispatch(receiveMyLocation(window.geoIPLocation))
			if (goToLocation)
				dispatch(selectLocation(window.geoIPLocation))
		}
	}
}

export function goToMyLocation(location) {
	return (dispatch, getState) => {
		return dispatch(getGeolocation(true))
	}
}

function fetchWeather(location) {
  return dispatch => {
    dispatch(requestWeather(location))
    let match = location.match(/^\s*(\-?\d+(\.\d*)?)\s*,\s*(\-?\d+(\.\d*)?)\s*$/); 
	if (match) {
		let latitude = match[1], longitude = match[3];
		var queryURL = 'http://api.openweathermap.org/data/2.5/weather?lat='+encodeURIComponent(latitude)+'&lon='+encodeURIComponent(longitude)+'&units=metric&APPID=' + process.env.APPID;
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
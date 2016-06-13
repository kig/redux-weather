import { combineReducers } from 'redux'
import {
  SELECT_LOCATION, INVALIDATE_LOCATION,
  REQUEST_WEATHER, RECEIVE_WEATHER,
  REQUEST_MY_LOCATION, RECEIVE_MY_LOCATION
} from '../actions/actions'

function selectedLocation(state = window.geoIPLocation, action) {
  switch (action.type) {
  case SELECT_LOCATION:
    return action.location
  default:
    return state
  }
}

function myLocation(state = {
  isFetching: false,
  location: window.geoIPLocation
}, action) {
  switch (action.type) {
    case REQUEST_MY_LOCATION:
        return Object.assign({}, state, {
          isFetching: true
        })
    case RECEIVE_MY_LOCATION:
        return Object.assign({}, state, {
          isFetching: false,
          location: action.location,
          lastUpdated: action.receivedAt
        })
    default:
      return state
  }
}

function weather(state = {
  isFetching: false,
  didInvalidate: false,
  locationChanged: true
}, action) {
  switch (action.type) {
    case INVALIDATE_LOCATION:
      return Object.assign({}, state, {
        didInvalidate: true,
        locationChanged: false
      })
    case REQUEST_WEATHER:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false,
        locationChanged: false
      })
    case RECEIVE_WEATHER:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        locationChanged: !state.weather || state.weather.name !== action.weather.name,
        weather: action.weather,
        lastUpdated: action.receivedAt
      })
    default:
      return Object.assign({}, state, {
        locationChanged: false
      })
  }
}

function weatherByLocation(state = { }, action) {
  switch (action.type) {
    case INVALIDATE_LOCATION:
    case RECEIVE_WEATHER:
    case REQUEST_WEATHER:
      return Object.assign({}, state, {
        [action.location]: weather(state[action.location], action)
      })
    default:
      return Object.assign({}, state, {
        locationChanged: false
      })
  }
}

const rootReducer = combineReducers({
  weatherByLocation,
  selectedLocation,
  myLocation
})

export default rootReducer

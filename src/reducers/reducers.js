import { combineReducers } from 'redux'
import {
  SELECT_LOCATION, INVALIDATE_LOCATION,
  REQUEST_WEATHER, RECEIVE_WEATHER
} from '../actions/actions'

function selectedLocation(state = 'London', action) {
  switch (action.type) {
  case SELECT_LOCATION:
    return action.location
  default:
    return state
  }
}

function weather(state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) {
  switch (action.type) {
    case INVALIDATE_LOCATION:
      return Object.assign({}, state, {
        didInvalidate: true
      })
    case REQUEST_WEATHER:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_WEATHER:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        weather: action.weather,
        lastUpdated: action.receivedAt
      })
    default:
      return state
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
      return state
  }
}

const rootReducer = combineReducers({
  weatherByLocation,
  selectedLocation
})

export default rootReducer

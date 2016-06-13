import React, { PropTypes, Component } from 'react'

export default class Weather extends Component {

  constructor() {
    super()
    this.state = {
      name: undefined,
      fade: false
    }
  }

  handleChange(name) {
    setTimeout((function() {
      this.props.onChange(this.state.name.toUpperCase())
    }).bind(this), 500);
    this.setState({
      name: name,
      fade: true
    })
  }

  handleGoToMyLocation(event) {
    event.preventDefault();
    this.props.onGoToMyLocation();
  }

  render() {
    const { weather, location, myLocation, onGoToMyLocation, locating, locationChanged, onChange } = this.props
    return (
      <div id="weather-data" className={ this.state.fade ? 'fade-out' : (locationChanged ? 'fade-in' : '') }>
        <div>
          <form onSubmit={e => { e.preventDefault(); e.target.city.blur(); }}>
            <input id="city" autoComplete="off" 
              defaultValue={this.state.name || weather.name || location}
              onChange={e => e}
              onBlur={e => this.handleChange(e.target.value)}
              onFocus={e => e.target.select()}
            />
          </form>
          <span id="my-location" 
            onClick={e => this.handleGoToMyLocation(e)} 
            className={ (location.toUpperCase() === myLocation.toUpperCase() ? 'current-location' : '') + (locating ? ' locating' : '') }
          >
            <svg width="15" height="15">
              <circle id="surround" fill="none" stroke="#000000" cx="7.6" cy="7.5" r="5.4"/>
              <rect x="7" width="1" height="1.9"/>
              <rect x="7" y="13.1" width="1" height="1.9"/>
              <rect x="13.1" y="7" width="1.9" height="1"/>
              <rect x="0" y="7" width="1.9" height="1"/>
              <circle id="center" cx="7.6" cy="7.5" r="3.5"/>
            </svg>
          </span>
        </div>
          {
            (weather.cod !== 200)
            ? <div id="weather-desc">{weather.message}</div>
            : <div>
                <div id="temperature">{ Math.round(weather.main.temp) }&deg;C</div>
                <hr/>
                <div>
                  <span id="weather-desc">{ weather.weather.map(w => w.description).join(", ") }</span>,&nbsp;
                  <span id="cloud-cover">cloud cover {weather.clouds.all}%</span>
                </div>
                <div id="wind-data">
                  <span id="wind-speed">wind { Math.round(weather.wind.speed*10)/10 } m/s</span> from 
                  <span id="wind-direction">
                    <svg height="15" width="15">
                      <g id='wind-direction-arrow' transform={ "rotate(" + weather.wind.deg + " 7.5 7.5)" }>
                        <polygon points="0.2,7.4 14.8,11.1 11.4,7.4 14.8,3.7 " fill="white"/>
                      </g>
                    </svg>
                  </span>
                </div>
                <hr/>
              </div>
          }
      </div>
    )
  }
}

Weather.propTypes = {
  weather: PropTypes.object.isRequired,
  location: PropTypes.string.isRequired,
  myLocation: PropTypes.string.isRequired,
  onGoToMyLocation: PropTypes.func.isRequired,
  locating: PropTypes.bool.isRequired,
  locationChanged: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
}
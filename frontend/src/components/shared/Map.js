import React from 'react'
import mapboxgl from 'mapbox-gl'
mapboxgl.accessToken = 'pk.eyJ1IjoiY29uc2Vuc3lzIiwiYSI6ImNqOHBmY2w0NjBmcmYyd3F1NHNmOXJwMWgifQ.8-GlTlTTUHLL8bJSnK2xIA'

class Map extends React.Component {
  constructor () {
    super()
    this.state = {}
  }
  componentDidMount () {
    if (this.props.lngLat.length > 0) {
      const map = new mapboxgl.Map({
        container: this.mapContainer,
        style: 'mapbox://styles/mapbox/streets-v10',
        interactive: false
      })
      map.setCenter([this.props.lngLat[0], this.props.lngLat[1]])
      map.setZoom(18)
      this.setState({map: map})
    }
  }

  componentWillReceiveProps (np) {
    if (typeof np.lngLat !== 'undefined' && np.lngLat.length > 0) {
      this.state.map.setCenter(np.lngLat)
      if (typeof this.state.marker === 'undefined') {
        const marker = new mapboxgl.Marker()
          .setLngLat(np.lngLat)
          .addTo(this.state.map)
        this.setState({marker})
      }
    }
  }

  componentWillUnmount () {
    if (this.state.map !== undefined) {
      this.state.map.remove()
    }
  }

  render () {
    return this.props.lngLat.length > 0
      ? <div id='map' style={{width: 300, height: 300}} ref={el => { this.mapContainer = el }} />
      : <p />
  }
}

export default Map

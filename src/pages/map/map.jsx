import NavBar from '../../components/navBar/navBar'
import LandingMap from '../../components/map/landingMap/landingMap'
import SearhPlace from '../../components/map/searchPlace/searchPlace';

export function Map() {
  return (
    <div id="MapPage">
      <NavBar />
      <SearhPlace />
      <LandingMap />
    </div>
  )
}

export default Map;
import React, { useState, useEffect } from 'react'
import NavBar from '../../components/navBar/navBar'
import LandingMap from '../../components/map/landingMap/landingMap'
import SearchPlace from '../../components/map/searchPlace/searchPlace';
import AddPlace from '../../components/map/addPlace/addPlace'

export function Map() {

  return (
    <div id="MapPage">
      <NavBar />
      <SearchPlace />
      {/* <LandingMap /> */}
    </div>
  )
}

export default Map;
import React, { useState, useEffect } from 'react'
import NavBar from '../../components/navBar/navBar'
import SearchPlace from '../../components/map/searchPlace/searchPlace';

export function Map() {

  return (
    <div id="MapPage">
      <NavBar />
      <SearchPlace />
    </div>
  )
}

export default Map;
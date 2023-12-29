import { Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react'

const { kakao } = window;

export function SearhPlace() {
  useEffect(() => {
    const container = document.getElementById('map'),
      mapOption = {
        center: new kakao.maps.LatLng(37.566826004661, 126.978652258309),
        level: 9
      };
    // 지도를 생성합니다    
    const map = new kakao.maps.Map(container, mapOption);
  }, []);

  return (
    <div id="StartComponent">
      <div id="map" style={{ width: "100%", height: "840px", position: 'relative', overflow: 'hidden' }}>
        <button id="homeLink_btn">
          <Link to="/">Home</Link>
        </button>
      </div>
    </div>
  )
}

export default SearhPlace
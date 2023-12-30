import React, { useState, useEffect } from 'react'
import styles from './landingMap.module.scss';

const { kakao } = window;

export function LandinMap() {
  useEffect(() => {
    const container = document.getElementById('map'),
      mapOption = {
        center: new kakao.maps.LatLng(37.566826004661, 126.978652258309),
        level: 9
      };
    const map = new kakao.maps.Map(container, mapOption);
  }, []);

  return (
    <div id={styles.mapContainer}>
      <div id="map" style={{ width: "100%", height: "840px", position: 'relative', overflow: 'hidden' }}>
      </div>
    </div>
  )
}

export default LandinMap

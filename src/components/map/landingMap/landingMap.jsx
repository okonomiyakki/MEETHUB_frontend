import React, { useState, useEffect } from 'react'
import styles from './landingMap.module.scss';
import axios from 'axios';
import { generateCenter } from '../../../utils/generateCenter';

const { kakao } = window;

export function LandingMap({ searchPlace, lat, lng, name }) {
  let [location, setLocation] = useState([]);       // 입력 출발지 주소
  let [addLocation, setAddLocation] = useState([]); // 추가 출발지 주소
  let [latlng, setLatlng] = useState([]);           // 입력 출발지 좌표
  let [addLatlng, setAddLatlng] = useState([]);     // 추가 출발지 좌표
  let [Name, setName] = useState([]);               // 입력 출발지 이름
  let [addName, setAddName] = useState([]);         // 추가 출발지 이름

  useEffect(() => {
    if (lat) {
      let container = document.getElementById('map'),
        mapOption = {
          center: new kakao.maps.LatLng(37.566826004661, 126.978652258309),
          level: 6
        };

      let map = new kakao.maps.Map(container, mapOption);

      let new_location = [...location];
      new_location.unshift(searchPlace); //검색한 주소를 새로운 배열에 선언
      setLocation(new_location);         // 검색 될 때 마다 값 바꿈

      let coords = new kakao.maps.LatLng(lat, lng);

      // console.log("새로 검색한 좌표", lat, lng);

      let new_latlng = [...latlng];
      new_latlng.unshift([Number(lat), Number(lng)]); //검색한 주소의 좌표
      setLatlng(new_latlng);

      let new_Name = [...Name];
      new_Name.unshift([name]);
      setName(new_Name);

      let searchMarker = new kakao.maps.Marker({
        map: map,
        position: coords
      });

      let infowindow = new kakao.maps.InfoWindow({
        content: `<div style="width:150px;text-align:center;padding:6px 0;">` + name + `</div>`,
        clickable: true
      });

      infowindow.open(map, searchMarker);

      map.setCenter(coords);
    }

  }, [searchPlace, lat, lng, name])

  const addStartPoints = (intext) => {
    if ((location.includes(intext) & !addLocation.includes(intext)) && intext != "") {
      let new_addLocation = [...addLocation];
      new_addLocation.push(intext);
      setAddLocation(new_addLocation);
      console.log("추가한 주소명", new_addLocation);

      let new_addLatlng = [...addLatlng];
      new_addLatlng.push(latlng[0]);
      setAddLatlng(new_addLatlng);
      console.log("추가한 좌표값", new_addLatlng);

      let new_addName = [...addName];
      new_addName.push(name);
      setAddName(new_addName);
      console.log("추가한 장소명", new_addName);
    }

    else {
      alert('장소 클릭 후 눌러주세요.');
      return;
    }
  }

  const deleteStartPoints = (i) => {
    let updatedLocation = [...addLocation.slice(0, i), ...addLocation.slice(i + 1)];
    let updatedLatlng = [...addLatlng.slice(0, i), ...addLatlng.slice(i + 1)];
    let updatedName = [...addName.slice(0, i), ...addName.slice(i + 1)];

    setAddLocation(updatedLocation);
    setAddLatlng(updatedLatlng)
    setAddName(updatedName);
  }

  const findEndPoint = async () => {
    try {
      const data = {
        centerLat: generateCenter(addLatlng).centerLat,
        centerLng: generateCenter(addLatlng).centerLng
      }

      const response = await axios.post('http://localhost:5500/routes', data);

      console.log('Server response:', response.data);

    } catch (error) {
      console.error('Error making HTTP request:', error.message);
    }
  };


  return (
    <>
      <div id="map" style={{ width: "1900px", height: "845px", position: 'relative', overflow: 'hidden' }}>
      </div>

      <div id={styles.addWrap}>
        <div id={styles.addBox} className={styles.bg_white}>
          <div className={styles.addOption}>
            {/* <button type="button" onClick={() => reload()}>다시하기</button> */}
            <button id={styles.addBtn} className={styles.addBtn} onClick={() => findEndPoint()}>중간 장소 찾기</button>
            <button className={styles.addBtn} onClick={() => addStartPoints(searchPlace)}>출발지 추가</button>
            <hr></hr>
            <button className={styles.addLine}>출발지 목록</button>
            <div>{addName.map((a, i) => (
              <div key={i} className={styles.submitAddress}>
                <div>{a}</div>
                <button className={styles.deleteBtn} onClick={() => deleteStartPoints(i)}>X</button>
              </div>))}
            </div>
          </div>
          {/* <hr></hr> */}
        </div>
        {/* <div id={styles.stationBox} className={styles.bg_white}>
        </div> */}
      </div>
    </>
  )
}

export default LandingMap



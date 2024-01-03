import React, { useState, useEffect } from 'react'
import styles from './landingMap.module.scss';
import axios from 'axios';
import { generateCenter } from '../../../utils/generateCenter';
import seoulPolyLine from './seoul.json'

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
        startLatlng: addLatlng,
        centerLat: generateCenter(addLatlng).centerLat,
        centerLng: generateCenter(addLatlng).centerLng
      }

      const response = await axios.post('http://localhost:5500/routes', data);

      console.log('Server response:', response.data);

    } catch (error) {
      console.error('Error making HTTP request:', error.message);
    }
  };

  const submitStartPoints = () => {
    var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
      mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
        level: 9 // 지도의 확대 레벨
      };

    var map = new kakao.maps.Map(mapContainer, mapOption),
      customOverlay = new kakao.maps.CustomOverlay({}),
      infowindow = new kakao.maps.InfoWindow({ removable: false });

    const displayArea = (areas) => {
      areas.forEach((area) => {
        const path = area.geometry.coordinates[0].map(([lng, lat]) => new kakao.maps.LatLng(lat, lng));
        let isMouseOver = false;

        // 다각형을 생성합니다 
        var polygon = new kakao.maps.Polygon({
          map: map, // 다각형을 표시할 지도 객체
          path: path,
          strokeWeight: 2,
          strokeColor: '#004c80',
          strokeOpacity: 0.8,
          fillColor: '#fff',
          fillOpacity: 0.7
        });

        // 다각형에 mouseover 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 변경합니다 
        // 지역명을 표시하는 커스텀오버레이를 지도위에 표시합니다
        kakao.maps.event.addListener(polygon, 'mouseover', function (mouseEvent) {
          isMouseOver = true;
          polygon.setOptions({ fillColor: '#09f' });

          // customOverlay.setContent('<div class="area">' + area.name + '</div>');

          customOverlay.setPosition(mouseEvent.latLng);
          customOverlay.setMap(map);
        });

        // 다각형에 mousemove 이벤트를 등록하고 이벤트가 발생하면 커스텀 오버레이의 위치를 변경합니다 
        kakao.maps.event.addListener(polygon, 'mousemove', function (mouseEvent) {
          if (isMouseOver) customOverlay.setPosition(mouseEvent.latLng);
        });

        // 다각형에 mouseout 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 원래색으로 변경합니다
        // 커스텀 오버레이를 지도에서 제거합니다 
        kakao.maps.event.addListener(polygon, 'mouseout', function () {
          isMouseOver = false;
          polygon.setOptions({ fillColor: '#fff' });
          customOverlay.setMap(null);
        });

        // 다각형에 click 이벤트를 등록하고 이벤트가 발생하면 다각형의 이름과 면적을 인포윈도우에 표시합니다 
        kakao.maps.event.addListener(polygon, 'click', function (mouseEvent) {
          var content = '<div class="info">' +
            '   <div class="title" style="width: 100%; font-size: 16px; text-align: center;">' +
            '       <button id="' + styles.addBtn + '" class="' + styles.addBtn + '">' +
            area.name + ' 에서 중간 장소 찾기' +
            '       </button>' +
            '   </div>' +
            '</div>';

          infowindow.setContent(content);
          infowindow.setPosition(mouseEvent.latLng);
          infowindow.setMap(map);

          let findEndPointBtn = document.getElementById(styles.addBtn)

          findEndPointBtn.addEventListener('click', function () {
            findEndPoint()
          })
        });
      });
    }

    const areas = seoulPolyLine.features.map((feature) => {
      const name = feature.properties.SIG_KOR_NM;
      const geometry = feature.geometry;

      return { name, geometry };
    });

    displayArea(areas);
  }

  return (
    <>
      <div id="map" style={{ width: "1900px", height: "845px", position: 'relative', overflow: 'hidden' }}>
      </div>

      <div id={styles.addWrap}>
        <div id={styles.addBox} className={styles.bg_white}>
          <div className={styles.addOption}>
            {/* <button type="button" onClick={() => reload()}>다시하기</button> */}
            {/* <button id={styles.addBtn} className={styles.addBtn} onClick={() => findEndPoint()}>중간 장소 찾기</button> */}
            <button className={styles.addBtn} onClick={() => addStartPoints(searchPlace)}>출발지 추가</button>
            {/* <hr></hr> */}
            {/* <button className={styles.addLine}>출발지 목록</button> */}
            <div>{addName.map((a, i) => (
              <div key={i} className={styles.submitAddress}>
                <div>{a}</div>
                <button className={styles.deleteBtn} onClick={() => deleteStartPoints(i)}>X</button>
              </div>))}
            </div>
            <hr></hr>
            {/* <button className={styles.addBtn} onClick={() => submitStartPoints()}>출발지 저장</button> */}
            {addName.length >= 2 ? (
              <button className={styles.addBtn} onClick={() => submitStartPoints()}>출발지 저장</button>
            ) : (
              <button className={`${styles.addBtn} ${styles.disabledBtn}`} disabled>출발지 저장</button>
            )}
            {/* <button id={styles.addBtn} className={styles.addBtn} onClick={() => findEndPoint()}>중간 장소 찾기</button> */}
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



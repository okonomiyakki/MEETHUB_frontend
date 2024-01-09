import React, { useState, useEffect } from 'react'
import styles from './landingMap.module.scss';
import axios from 'axios';
import { generateCenter } from '../../../utils/generateCenter';

const { kakao } = window;

const API_URL = process.env.REACT_APP_API_URL

export function LandingMap({ searchPlace, lat, lng, name }) {
  let [location, setLocation] = useState([]);       // 입력 출발지 주소
  let [addLocation, setAddLocation] = useState([]); // 추가 출발지 주소
  let [latlng, setLatlng] = useState([]);           // 입력 출발지 좌표
  let [addLatlng, setAddLatlng] = useState([]);     // 추가 출발지 좌표
  let [Name, setName] = useState([]);               // 입력 출발지 이름
  let [addName, setAddName] = useState([]);         // 추가 출발지 이름

  const [state, setState] = useState({
    // 지도의 초기 위치
    center: { lat: 37.566826004661, lng: 126.978652258309 },
    // 지도 위치 변경시 panto를 이용할지(부드럽게 이동)
    isPanto: true,
  });

  useEffect(() => {
    // if (lat) {

    let container = document.getElementById('map'),
      mapOption = {
        center: new kakao.maps.LatLng(state.center.lat, state.center.lng),
        level: 5
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
    // }

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
      alert('출발 장소를 클릭 후 눌러주세요.');
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

      const response = await axios.post(`${API_URL}/routes`, data);

      console.log('Server response:', response.data);

      displayPath(response.data.firstStationCoord, response.data.firstStationName, response.data.stationPathList, 0)

      alert('탐색이 완료되었습니다.')

      const addOptionDiv = document.getElementsByClassName(styles.addOption)[0]
      const findEndPointBtn = document.getElementById(styles.addBtn)
      const addStartPointBtn = document.getElementById(styles.startPointBtn)
      const deleteStartPointBtn = document.getElementsByClassName(styles.deleteBtn)

      findEndPointBtn.disabled = true
      findEndPointBtn.style.backgroundColor = 'grey'
      findEndPointBtn.style.borderColor = 'grey'
      findEndPointBtn.style.boxShadow = 'none'
      findEndPointBtn.style.cursor = 'not-allowed'

      addStartPointBtn.style.display = 'none'
      for (let i = 0; i < deleteStartPointBtn.length; i++) {
        deleteStartPointBtn[i].style.display = 'none'
      }

      for (let i = 0; i < response.data.stationList.length; i++) {
        let selectBtn = document.createElement('button')

        selectBtn.innerHTML = `${response.data.stationList[i].stationName}역에서 만나기`
        selectBtn.id = styles.findBtn
        selectBtn.className = styles.addBtn
        selectBtn.style.backgroundColor = 'rgb(233, 171, 56);'

        addOptionDiv.appendChild(selectBtn)

        let stationCoord = [response.data.stationList[i].x, response.data.stationList[i].y]
        let stationName = response.data.stationList[i].stationName


        selectBtn.addEventListener("click", () => displayPath(stationCoord, stationName, response.data.stationPathList, i))
      }
    } catch (error) {
      console.log(error)
      console.error('Error making HTTP request:', error.message);
    }
  };

  const displayPath = (stationCoord, stationName, stationPathList, num) => {
    let mapContainer = document.getElementById('map'),
      mapOption = {
        center: new kakao.maps.LatLng(stationCoord[1], stationCoord[0]),
        level: 8
      };

    let map = new kakao.maps.Map(mapContainer, mapOption);

    let imageSrcStartMarker = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"

    for (let i = 0; i < addLatlng.length; i++) {    // 출발지 마커
      let imageSizeStartMarker = new kakao.maps.Size(24, 35);
      let markerImageStart = new kakao.maps.MarkerImage(imageSrcStartMarker, imageSizeStartMarker);
      var startMarker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(addLatlng[i][0], addLatlng[i][1]),
        image: markerImageStart,
        clickable: true
      });

      startMarker.setMap(map);

      var infowindowStart = new kakao.maps.InfoWindow({
        content: `
        <div style="width: 150px; text-align: center; padding: 6px 0;">${addName[i]}</div>
        <div style="width: 150px; text-align: center; padding: 6px 0; font-weight: bold; color: red;">${stationPathList[num][i].result.path[0].info.totalTime}분 소요</div>
        `,
      });

      infowindowStart.open(map, startMarker);

      (function (startMarker, infowindowStart) {
        kakao.maps.event.addListener(startMarker, 'click', function () {
          infowindowStart.open(map, startMarker);
        });

        kakao.maps.event.addListener(startMarker, 'rightclick', function () {
          infowindowStart.close();
        });
      })(startMarker, infowindowStart);
    }

    let imageSrcStationMarker = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png';

    let imageSizeStationMarker = new kakao.maps.Size(35, 40);
    let markerImageStation = new kakao.maps.MarkerImage(imageSrcStationMarker, imageSizeStationMarker);
    var stationMarker = new kakao.maps.Marker({
      map: map,
      position: new kakao.maps.LatLng(stationCoord[1], stationCoord[0]),
      image: markerImageStation,
      clickable: true
    });

    stationMarker.setMap(map);

    var infowindowStation = new kakao.maps.InfoWindow({
      content: `
      <div style="width: 150px; text-align: center; padding: 6px 0; font-weight: bold; color: blue;">모임 장소</div>
      <div style="width: 150px; text-align: center; padding: 6px 0;">${stationName} 역</div>
      `,
    });

    infowindowStation.open(map, stationMarker);
  }

  return (
    <>
      <div id="map" style={{ width: "100%", height: "845px", position: 'relative', overflow: 'hidden' }}>
      </div>

      <div id={styles.addWrap}>
        <div id={styles.addBox} className={styles.bg_white}>
          <div className={styles.addOption}>
            {addName.length < 5 ? (
              <button id={styles.startPointBtn} className={styles.addBtn} onClick={() => addStartPoints(searchPlace)}>출발지 추가하기</button>
            ) : (
              <button id={styles.startPointBtn} className={`${styles.addBtn} ${styles.disabledBtn}`} disabled>출발지 개수는 최대 5개 입니다</button>
            )}
            <div>{addName.map((a, i) => (
              <div key={i} className={styles.submitAddress}>
                <div>{a}</div>
                <button className={styles.deleteBtn} onClick={() => deleteStartPoints(i)}>X</button>
              </div>))}
            </div>
            <hr></hr>
            {addName.length >= 3 ? (
              <button id={styles.addBtn} className={styles.addBtn} onClick={() => {
                alert(`중간 지점 탐색에 다소 시간이 소요될 수 있습니다.
확인 버튼을 누르면 탐색이 시작됩니다.`)
                findEndPoint()
              }}>중간 지점 찾기</button>
            ) : (
              <button className={`${styles.addBtn} ${styles.disabledBtn}`} disabled>출발지를 세 곳 이상 추가하세요</button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default LandingMap



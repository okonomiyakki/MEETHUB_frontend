import React, { useState, useEffect } from 'react'
import styles from './landingMap.module.scss';
import axios from 'axios';
import { generateCenter } from '../../../utils/generateCenter';
import seoulPolyLine from './seoul.json'
import regionStationInfo from './station.json'

const { kakao } = window;

export function LandingMap({ searchPlace, lat, lng, name }) {
  let [location, setLocation] = useState([]);       // 입력 출발지 주소
  let [addLocation, setAddLocation] = useState([]); // 추가 출발지 주소
  let [latlng, setLatlng] = useState([]);           // 입력 출발지 좌표
  let [addLatlng, setAddLatlng] = useState([]);     // 추가 출발지 좌표
  let [Name, setName] = useState([]);               // 입력 출발지 이름
  let [addName, setAddName] = useState([]);         // 추가 출발지 이름
  let [region, setRegion] = useState([]);           // 선택 지역구 이름
  let [station, setStation] = useState([]);         // 선택 지하철 정보

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

  const newFindEndPoint = async () => {
    try {
      const data = {
        startLatlng: addLatlng,
        centerLat: generateCenter(addLatlng).centerLat,
        centerLng: generateCenter(addLatlng).centerLng
      }

      const response = await axios.post('http://localhost:5500/routes', data);

      console.log('Server response:', response.data);

      newDisplayPath(response.data.firstStationCoord, response.data.firstStationName)

      alert('탐색이 완료되었습니다.')

      const addOptionDiv = document.getElementsByClassName(styles.addOption)[0]
      const findEndPointBtn = document.getElementById(styles.addBtn)

      findEndPointBtn.disabled = true
      findEndPointBtn.style.backgroundColor = 'grey'
      findEndPointBtn.style.borderColor = 'grey'
      findEndPointBtn.style.boxShadow = 'none'
      findEndPointBtn.style.cursor = 'not-allowed'


      for (let i = 0; i < response.data.stationList.length; i++) {
        let selectBtn = document.createElement('button')

        selectBtn.innerHTML = `${response.data.stationList[i].stationName}역 보기`
        selectBtn.id = styles.addBtn
        selectBtn.className = styles.addBtn
        selectBtn.style.backgroundColor = 'rgb(233, 171, 56);'

        addOptionDiv.appendChild(selectBtn)

        let stationCoord = [response.data.stationList[i].x, response.data.stationList[i].y]
        let stationName = response.data.stationList[i].stationName


        selectBtn.addEventListener("click", () => newDisplayPath(stationCoord, stationName))
      }
    } catch (error) {
      console.error('Error making HTTP request:', error.message);
    }
  };

  // const findEndPoint = async (regionName, regionStation) => {
  //   try {
  //     const data = {
  //       regionName,
  //       regionStation,
  //       startLatlng: addLatlng
  //       // centerLat: generateCenter(addLatlng).centerLat,
  //       // centerLng: generateCenter(addLatlng).centerLng
  //     }

  //     const response = await axios.post('http://localhost:5500/routes', data);

  //     console.log('Server response:', response.data);

  //     let newRegion = [...region];
  //     newRegion.push(response.data.regionName[0]);
  //     setRegion(newRegion);
  //     console.log("선택 지역구 이름", newRegion);

  //     let newStation = [...station];
  //     newStation.push(response.data.regionStation[0]);
  //     setStation(newStation);
  //     console.log("선택 지하철 정보", newStation);

  //     displayPath(newStation)

  //     return newStation
  //   } catch (error) {
  //     console.error('Error making HTTP request:', error.message);
  //   }
  // };

  const newDisplayPath = (stationCoord, stationName) => {
    let mapContainer = document.getElementById('map'), // 지도를 표시할 div 
      mapOption = {
        center: new kakao.maps.LatLng(stationCoord[1], stationCoord[0]), // 지도의 중심좌표
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
        content: '<div style="width:150px;text-align:center;padding:6px 0;">' + addName[i] + '</div>',
      });

      infowindowStart.open(map, startMarker);
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
      content: '<div style="width:150px;text-align:center;padding:6px 0;">' + stationName + '역</div>',
    });

    infowindowStation.open(map, stationMarker);
  }

  // const displayPath = (newStation) => {
  //   let mapContainer = document.getElementById('map'), // 지도를 표시할 div 
  //     mapOption = {
  //       center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
  //       level: 8
  //     };

  //   let map = new kakao.maps.Map(mapContainer, mapOption);

  //   let imageSrcStationMarker = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png';

  //   for (let i = 0; i < newStation[0].length; i++) {    // 지하철 마커
  //     let imageSizeStationMarker = new kakao.maps.Size(35, 40);
  //     let markerImageStation = new kakao.maps.MarkerImage(imageSrcStationMarker, imageSizeStationMarker);
  //     var stationMarker = new kakao.maps.Marker({
  //       map: map,
  //       position: new kakao.maps.LatLng(newStation[0][i].y, newStation[0][i].x),
  //       image: markerImageStation,
  //       clickable: true
  //     });

  //     stationMarker.setMap(map);

  //     var infowindowStation = new kakao.maps.InfoWindow({
  //       content: '<div style="width:150px;text-align:center;padding:6px 0;">' + newStation[0][i].stationName + '</div>',
  //     });

  //     (function (stationMarker, infowindowStation) {
  //       // 마커에 mouseover 이벤트를 등록하고 마우스 오버 시 인포윈도우를 표시합니다 
  //       kakao.maps.event.addListener(stationMarker, 'mouseover', function () {
  //         infowindowStation.open(map, stationMarker);
  //         // TODO: 각 지하철 노선 그리기
  //       });

  //       // 마커에 mouseout 이벤트를 등록하고 마우스 아웃 시 인포윈도우를 닫습니다
  //       kakao.maps.event.addListener(stationMarker, 'mouseout', function () {
  //         infowindowStation.close();
  //         // TODO: 각 지하철 노선 그리기
  //       });
  //     })(stationMarker, infowindowStation);
  //   }

  //   let imageSrcStartMarker = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"

  //   for (let i = 0; i < addLatlng.length; i++) {    // 출발지 마커
  //     let imageSizeStartMarker = new kakao.maps.Size(24, 35);
  //     let markerImageStart = new kakao.maps.MarkerImage(imageSrcStartMarker, imageSizeStartMarker);
  //     var startMarker = new kakao.maps.Marker({
  //       map: map,
  //       position: new kakao.maps.LatLng(addLatlng[i][0], addLatlng[i][1]),
  //       image: markerImageStart,
  //       clickable: true
  //     });

  //     startMarker.setMap(map);

  //     var infowindowStart = new kakao.maps.InfoWindow({
  //       content: '<div style="width:150px;text-align:center;padding:6px 0;">' + addName[i] + '</div>',
  //     });
  //     infowindowStart.open(map, startMarker);
  //   }
  // }

  // const submitStartPoints = () => {
  //   let mapContainer = document.getElementById('map'), // 지도를 표시할 div 
  //     mapOption = {
  //       center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
  //       level: 8 // 지도의 확대 레벨
  //     };

  //   let map = new kakao.maps.Map(mapContainer, mapOption),
  //     customOverlay = new kakao.maps.CustomOverlay({}),
  //     infowindow = new kakao.maps.InfoWindow({ removable: false });

  //   const displayArea = (areas) => {
  //     areas.forEach((area) => {
  //       const path = area.geometry.coordinates[0].map(([lng, lat]) => new kakao.maps.LatLng(lat, lng));
  //       let isMouseOver = false;

  //       // 다각형을 생성합니다 
  //       var polygon = new kakao.maps.Polygon({
  //         map: map, // 다각형을 표시할 지도 객체
  //         path: path,
  //         strokeWeight: 2,
  //         strokeColor: '#004c80',
  //         strokeOpacity: 0.8,
  //         fillColor: '#fff',
  //         fillOpacity: 0.7
  //       });

  //       // 다각형에 mouseover 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 변경합니다 
  //       // 지역명을 표시하는 커스텀오버레이를 지도위에 표시합니다
  //       kakao.maps.event.addListener(polygon, 'mouseover', function (mouseEvent) {
  //         isMouseOver = true;
  //         polygon.setOptions({ fillColor: '#09f' });

  //         // customOverlay.setContent('<div class="area">' + area.name + '</div>');

  //         customOverlay.setPosition(mouseEvent.latLng);
  //         customOverlay.setMap(map);
  //       });

  //       // 다각형에 mousemove 이벤트를 등록하고 이벤트가 발생하면 커스텀 오버레이의 위치를 변경합니다 
  //       kakao.maps.event.addListener(polygon, 'mousemove', function (mouseEvent) {
  //         if (isMouseOver) customOverlay.setPosition(mouseEvent.latLng);
  //       });

  //       // 다각형에 mouseout 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 원래색으로 변경합니다
  //       // 커스텀 오버레이를 지도에서 제거합니다 
  //       kakao.maps.event.addListener(polygon, 'mouseout', function () {
  //         isMouseOver = false;
  //         polygon.setOptions({ fillColor: '#fff' });
  //         customOverlay.setMap(null);
  //       });

  //       // 다각형에 click 이벤트를 등록하고 이벤트가 발생하면 다각형의 이름과 면적을 인포윈도우에 표시합니다 
  //       kakao.maps.event.addListener(polygon, 'click', function (mouseEvent) {
  //         var content = '<div class="info">' +
  //           '   <div class="title" style="width: 100%; font-size: 16px; text-align: center;">' +
  //           '       <button id="' + styles.addBtn + '" class="' + styles.addBtn + '">' +
  //           area.name + ' 에서 만나기' +
  //           '       </button>' +
  //           '   </div>' +
  //           '</div>';

  //         infowindow.setContent(content);
  //         infowindow.setPosition(mouseEvent.latLng);
  //         infowindow.setMap(map);

  //         let findEndPointBtn = document.getElementById(styles.addBtn)

  //         findEndPointBtn.addEventListener('click', async function () {
  //           const regionName = [area.name]

  //           const regionStation = regionStationInfo.station
  //             .filter((region) => region.regionName === regionName[0])
  //             .map((region) => region.info);

  //           let sta = await findEndPoint(regionName, regionStation) // 중간 장소 찾기 버튼

  //           console.log(sta)
  //         })
  //       });

  //       let imageSrcStartMarker = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"

  //       for (let i = 0; i < addLatlng.length; i++) {    // 출발지 마커
  //         let imageSizeStartMarker = new kakao.maps.Size(24, 35);
  //         let markerImageStart = new kakao.maps.MarkerImage(imageSrcStartMarker, imageSizeStartMarker);
  //         var startMarker = new kakao.maps.Marker({
  //           map: map,
  //           position: new kakao.maps.LatLng(addLatlng[i][0], addLatlng[i][1]),
  //           image: markerImageStart,
  //           clickable: true
  //         });

  //         startMarker.setMap(map);

  //         var infowindowStart = new kakao.maps.InfoWindow({
  //           content: '<div style="width:150px;text-align:center;padding:6px 0;">' + addName[i] + '</div>',
  //         });
  //         infowindowStart.open(map, startMarker);
  //       }
  //     });
  //   }

  //   const areas = seoulPolyLine.features.map((feature) => {
  //     const name = feature.properties.SIG_KOR_NM;
  //     const geometry = feature.geometry;

  //     return { name, geometry };
  //   });

  //   displayArea(areas);

  //   // alert('모임을 원하시는 지역구를 클릭해주세요.');
  // }

  return (
    <>
      <div id="map" style={{ width: "1900px", height: "845px", position: 'relative', overflow: 'hidden' }}>
      </div>

      <div id={styles.addWrap}>
        <div id={styles.addBox} className={styles.bg_white}>
          <div className={styles.addOption}>
            {/* <button type="button" onClick={() => reload()}>다시하기</button> */}
            {/* <button id={styles.addBtn} className={styles.addBtn} onClick={() => findEndPoint()}>중간 장소 찾기</button> */}
            {/* <button className={styles.addBtn} onClick={() => addStartPoints(searchPlace)}>출발지 추가하기</button> */}
            {addName.length < 5 ? (
              <button className={styles.addBtn} onClick={() => addStartPoints(searchPlace)}>출발지 추가하기</button>
            ) : (
              <button className={`${styles.addBtn} ${styles.disabledBtn}`} disabled>출발지 개수는 최대 5개 입니다</button>
            )}
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
            {addName.length >= 3 ? (
              <button id={styles.addBtn} className={styles.addBtn} onClick={() => {
                alert(`
                중간 지점 탐색 소요시간은 약 5초 입니다.
                확인 버튼을 누를 시 탐색이 시작됩니다.
                기다려주세요.`
                )
                newFindEndPoint()
              }}>중간 지점 찾기</button>
            ) : (
              <button className={`${styles.addBtn} ${styles.disabledBtn}`} disabled>출발지를 세 곳 이상 추가하세요</button>
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



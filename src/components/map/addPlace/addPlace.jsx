// import React, { useEffect, useState } from 'react'
// import LandingMap from '../landingMap/landingMap'
// import styles from './addPlace.module.scss'

// const { kakao } = window

// export function AddPlace({ searchPlace, lat, lng, name }) {
//   let [location, setLocation] = useState([]);       // 입력된 주소
//   let [addLoc, setAddLoc] = useState([]);           // 추가된 주소
//   let [latlng, setLatlng] = useState([]);           // 입력 좌표
//   let [addLatlng, setAddLatlng] = useState([]);     // 추가 좌표
//   let [Name, setName] = useState([]);               // 입력된 출발지 이름
//   let [addName, setAddName] = useState([]);         // 추가된 출발지 이름

//   useEffect(() => {
//     // if (lat != null) {
//     let container = document.getElementById('map'),
//       mapOption = {
//         center: new kakao.maps.LatLng(37.566826004661, 126.978652258309),
//         level: 6
//       };

//     let map = new kakao.maps.Map(container, mapOption);

//     let new_location = [...location];
//     new_location.unshift(searchPlace); //검색한 주소를 새로운 배열에 선언
//     setLocation(new_location);         // 검색 될 때 마다 값 바꿈

//     let coords = new kakao.maps.LatLng(lat, lng);

//     // console.log("새로 검색한 좌표", lat, lng);

//     let new_latlng = [...latlng];
//     new_latlng.unshift([Number(lat), Number(lng)]); //검색한 주소의 좌표
//     setLatlng(new_latlng);

//     let new_Name = [...Name];
//     new_Name.unshift([name]);
//     setName(new_Name);

//     let searchMarker = new kakao.maps.Marker({
//       map: map,
//       position: coords
//     });

//     let infowindow = new kakao.maps.InfoWindow({
//       content: `<div style="width:150px;text-align:center;padding:6px 0;">` + name + `</div>`,
//       clickable: true
//     });

//     infowindow.open(map, searchMarker);

//     map.setCenter(coords);
//     // }

//   }, [searchPlace, lat, lng, name])

//   return (
//     <div id={styles.mapContainer}>
//       {/* <div id="map" style={{ width: "100%", height: "840px", position: 'relative', overflow: 'hidden' }}>
//       </div> */}
//     </div>
//   )
// }

// export default AddPlace;
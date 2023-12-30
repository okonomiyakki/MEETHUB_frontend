import React, { useState, useEffect } from 'react'
import styles from './landingMap.module.scss';

const { kakao } = window;

export function LandingMap({ searchPlace, lat, lng, name }) {
  let [location, setLocation] = useState([]);       // 입력된 주소
  let [addLoc, setAddLoc] = useState([]);           // 추가된 주소
  let [latlng, setLatlng] = useState([]);           // 입력 좌표
  let [addLatlng, setAddLatlng] = useState([]);     // 추가 좌표
  let [Name, setName] = useState([]);               // 입력된 출발지 이름
  let [addName, setAddName] = useState([]);         // 추가된 출발지 이름
  let [hotPlace, setHotPlace] = useState([]);       // 추천 매장
  let mmm = [];           // 소요시간 전체
  let www = [];           // 가중치 추가된
  let ggg = [];           // 가중치 값
  let avgTime = [];       // 최소 소요시간
  let endStation = [];    // 도착역

  // useEffect(() => {
  //   const container = document.getElementById('map'),
  //     mapOption = {
  //       center: new kakao.maps.LatLng(37.566826004661, 126.978652258309),
  //       level: 9
  //     };
  //   const map = new kakao.maps.Map(container, mapOption);


  //   if (lat && lng) {
  //     const coords = new kakao.maps.LatLng(lat, lng);
  //     const marker = new kakao.maps.Marker({
  //       position: coords,
  //       map: map,
  //     });

  //     map.setCenter(coords);
  //   }
  //   // let searchMarker = new kakao.maps.Marker({
  //   //   map: map,
  //   //   position: coords
  //   // });

  //   // let infowindow = new kakao.maps.InfoWindow({
  //   //   content: `<div style="width:150px;text-align:center;padding:6px 0;">` + name + `</div>`,
  //   //   clickable: true
  //   // });

  //   // infowindow.open(map, searchMarker);

  //   // map.setCenter(coords);


  // }, [lat, lng]);

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

  const buttonAdd = (intext) => {
    if ((location.includes(intext) & !addLoc.includes(intext)) && intext != "") {
      let new_addLoc = [...addLoc];
      new_addLoc.unshift(intext);
      setAddLoc(new_addLoc);
      // console.log("추가한 주소명", new_addLoc);

      let new_addLatlng = [...addLatlng];
      new_addLatlng.unshift(latlng[0]);
      setAddLatlng(new_addLatlng);
      // console.log("추가한 좌표값", new_addLatlng);

      let new_addName = [...addName];
      new_addName.unshift(name);
      setAddName(new_addName);
      // console.log("추가한 장소명", new_addName);

      // let new_index = [...index];
      // new_index.unshift(new_addLoc.length - new_addLoc.indexOf(intext));
      // setIndex(new_index);
      // console.log("추가한 인덱스값", new_index);
    }
    else {
      alert('장소 클릭 후 눌러주세요.');
      return;
    }
  }



  return (
    <>
      <div id="map" style={{ width: "1900px", height: "845px", position: 'relative', overflow: 'hidden' }}>
      </div>

      <div id={styles.addWrap}>
        <div id={styles.addBox} className={styles.bg_white}>
          <div className={styles.addOption}>
            {/* <button type="button" onClick={() => reload()}>다시하기</button> */}
            {/* <button id={styles.addBtn} className={styles.addBtn} onClick={() => start(addLatlng, addName)}>중간 장소 찾기</button> */}
            <button className={styles.addBtn} onClick={() => buttonAdd(searchPlace)}>출발지 추가</button>
            <div>{addName.map((a, i) => (
              <div key={i} className={styles.submitAddress}>
                <div>{a}</div>
                <button className={styles.deleteBtn} onClick={() => {
                  let copy = [...addLoc];
                  let copy2 = [...addLatlng];
                  let copy3 = [...addName];
                  copy.splice(i, 1)
                  copy2.splice(i, 1)
                  copy3.splice(i, 1)
                  setAddLoc(copy);
                  setAddLatlng(copy2)
                  setAddName(copy3);
                }}>X</button>
              </div>))}
            </div>
          </div>
          <hr></hr>
        </div>
        {/* <div id={styles.stationBox} className={styles.bg_white}>
        </div> */}
      </div>
    </>
  )
}

export default LandingMap



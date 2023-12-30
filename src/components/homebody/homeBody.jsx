import React from 'react';
import { Link } from 'react-router-dom'
import styles from './homeBody.module.scss';

export function HomeBody(props) {
  return (
    <div className={styles.home_container}>
      <div className={styles.intro}>
        <div className={styles.intro2}>
          <div className={styles.title}>Meet Hub</div>
          {/* <p>모임 인원이 많을 때,</p>
          <p>어디서 만날지 고민될 때</p> */}
          <p>중간 장소 추천 서비스</p>
        </div>

        <div>
          <Link to="/map" className={styles.home_d2}>
            최적의 중간 지점을 알려드릴게요.
            <span>출발지 입력하러 가기 </span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomeBody;
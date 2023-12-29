import React from 'react';
import { Link } from 'react-router-dom'
import styles from './homeBody.module.scss';

export function HomeBody(props) {
  return (
    <div className={styles.home_container}>
      <div className={styles.intro}>
        <div className={styles.intro2}>
          <div className={styles.title}>Meet Hub</div>
          <p>어디서 만날지 고민될 때,</p>
          <p>좋은 모임 장소를 추천받고 싶을 때</p>
        </div>

        <div>
          <Link to="/map" className={styles.home_d2}>
            중간 지점과 추천 매장을 알려드릴게요.
            <span>출발지 입력하러 가기 </span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomeBody;
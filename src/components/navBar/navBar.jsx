import React from 'react';
import Img from './signpost.png';
import { NavLink } from 'react-router-dom';
import styles from './navBar.module.scss';

export function NavBar(props) {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.leftContainer}>
          <NavLink to="/">
            <img src={Img} alt="logo" />
          </NavLink>
        </div>
        <div className={styles.rightContainer}>
          <NavLink to="/">
            <span>로그인</span>
          </NavLink>
        </div>
      </div>
    </>
  )
}
export default NavBar;
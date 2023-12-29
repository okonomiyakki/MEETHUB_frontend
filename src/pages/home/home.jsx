import NavBar from '../../components/navBar/navBar'
import Homebody from "../../components/homeBody/homeBody";
import styles from './home.module.scss'

export function Home() {
  return (
    <div id={styles.homePage}>
      <NavBar />
      <Homebody />
    </div>
  )
}

export default Home;
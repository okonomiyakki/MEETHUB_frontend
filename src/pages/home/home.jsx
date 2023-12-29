import Homebody from "../../components/homebody/homeBody";
import styles from './home.module.scss'

export function Home() {
  return (
    <div id={styles.homePage}>
      <Homebody />
    </div>
  )
}

export default Home;
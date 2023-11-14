import { Link } from 'react-router-dom';
import styles from '../styles/WelcomePage.module.css';
import start from '../assets/start.png';
import logo from '../assets/qr.png';

const WelcomePage: React.FC = () => {
    
    return (
        <>
            <div className={styles.welcomeContainer}>
                <span className={styles.headerContainer}>
                    <img src={logo} alt="QR" className={styles.logo} />
                    <span className={styles.title}>
                        <span>Inventory</span><br />
                        <span>Assistant</span><br />
                    </span>
                </span>
                <span className={styles.optionsButton}>
                    <Link to="/login"><button className={styles.logInButton}><img src={start} alt="START" width={90} height={90}/></button></Link>
                </span>
                <div>
                    <p className={styles.bottomStyle}>Twój osobisty pomocnik w przeprowadzeniu inwentaryzacji.</p>
                </div>
            </div>
        </>
    
    );
  };

export default WelcomePage;

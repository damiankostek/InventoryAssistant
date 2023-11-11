import styles from './AdminPage.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../assets/qr.png';
import log_out from "../assets/log_out.png";
import { Link } from 'react-router-dom';

const AdminPage: React.FC = () => {
    
    return (
        <>
            <div className={styles.adminContainer}>
                <div className={styles.banner}>
                    <span className={styles.headerContainer}>
                        <img src={logo} alt="QR" className={styles.logo} />
                        <span className={styles.title}>
                            <span>Inventory</span><br />
                            <span>Assistant</span><br />
                        </span>
                    </span>
                    <div className={styles.userStyle}>
                        <h1>Witaj $user$</h1>
                    </div>
                    <div>
                        <span className={styles.optionsButton}>
                            <Link to="/Login"><button className={styles.logOutButton}><img src={log_out} alt="log_out" width={82} height={82}/></button></Link>
                        </span>
                    </div>
                </div>
                <div className={styles.layoutButtons}>
                    <button className={styles.layoutButton}>Konta</button>
                    <button className={styles.layoutButton}>Tabele</button>
                </div>
                <div className={styles.adminContent}>
                    <div className={styles.menuAdmin}>
                        <h1>Menu</h1>
                    </div>
                    <div className={styles.details}>
                        Szczegóły dotyczące danego konta lub jakiejś tabeli...
                    </div>
                </div>
            </div>
        </>
    
    );
  };

export default AdminPage;
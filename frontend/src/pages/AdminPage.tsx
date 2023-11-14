import styles from '../styles/AdminPage.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../assets/qr.png';
import log_out from "../assets/log_out.png";
import { Link } from 'react-router-dom';
import { useState } from 'react';
import AccountPageLayout from '../layouts/AccountPageLayout';
import TablePageLayout from '../layouts/TablePageLayout';

const AdminPage: React.FC = () => {
    const [activeButton, setActiveButton] = useState('Konta');

    const handleButtonClick = (buttonName: string) => {
        setActiveButton(buttonName);
    };
    
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
                    <button
                        className={activeButton === 'Konta' ? styles.layoutButton : styles.layoutButton}
                        onClick={() => handleButtonClick('Konta')}
                    >
                        Konta
                    </button>
                    <button
                        className={activeButton === 'Tabele' ? styles.layoutButton : styles.layoutButton}
                        onClick={() => handleButtonClick('Tabele')}
                    >
                        Tabele
                    </button>
                </div>
                <div className={styles.adminContent}>
                    {activeButton === 'Konta' ? (
                        <AccountPageLayout/>
                    ) : (
                        <TablePageLayout/>
                    )}
                </div>
            </div>
        </>
    
    );
  };

export default AdminPage;
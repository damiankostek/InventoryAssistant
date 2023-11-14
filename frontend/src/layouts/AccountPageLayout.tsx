import styles from '../styles/AccountPageLayout.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AccountPageLayout: React.FC = () => {
    
    return (
        <>
            <div className={styles.adminContent}>
                <div className={styles.menuAdmin}>
                    {/* <h2>Lista kont</h2> */}
                    <div className={styles.menuButtons}>
                        <button className={styles.addUserButton}>Dodaj pracownika</button>
                        <hr />
                        <button className={styles.userButton}>jkowalski</button>
                    </div>
                </div>
                <div className={styles.details}>
                    konta
                </div>
            </div>
        </>
    
    );
  };

export default AccountPageLayout;
import { useState } from 'react';
import styles from '../styles/AccountPageLayout.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddUser from '../pages/AddUser';

const AccountPageLayout: React.FC = () => {
    const [showAddUser, setShowAddUser] = useState(false);

    const handleAddUserClick = () => {
        setShowAddUser(true);
    };
    
    return (
        <>
            <div className={styles.adminContent}>
                <div className={styles.menuAdmin}>
                    <div className={styles.menuButtons}>
                        <button className={styles.addUserButton} onClick={handleAddUserClick}>
                            Dodaj pracownika
                        </button>
                        <hr />
                        <button className={styles.userButton}>jkowalski</button>
                    </div>
                </div>
                <div className={styles.details}>
                    {showAddUser ? <AddUser /> : null}
                </div>
            </div>
        </>
    
    );
  };

export default AccountPageLayout;
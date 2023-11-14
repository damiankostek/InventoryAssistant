import styles from '../styles/TablePageLayout.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const TablePageLayout: React.FC = () => {
    
    return (
        <>
            <div className={styles.adminContent}>
                <div className={styles.menuAdmin}>
                    <h1>Menu</h1>
                </div>
                <div className={styles.details}>
                    tabele
                </div>
            </div>
        </>
    
    );
  };

export default TablePageLayout;
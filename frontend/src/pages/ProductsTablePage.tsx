import styles from '../styles/ScanPage.module.css';
import { Link } from 'react-router-dom';


const ProductsTablePage: React.FC = () => {
    
    return (
        <>
            <div>
                <Link to="/scan"><button className={styles.check}>Powrót</button></Link>
                <div>
                    TABELA PRODUKTÓW
                </div>
            </div>
        </>
    
    );
  };

export default ProductsTablePage;
import { Form, InputGroup } from 'react-bootstrap';
import styles from '../styles/ProductPage.module.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductPage: React.FC = () => {
    const [quantity, setQuantity] = useState('');
    const [validatedQuantity] = useState(false);
    
    return (
        <>
            <div className={styles.productContainer}>
                <div className={styles.contentContainer}>
                    <span className={styles.tableNameStyle}>
                        <h2 className={styles.h2Style}>Tabela:</h2>
                        <p>Nazwa tabelki</p>
                    </span>
                    <span className={styles.qrCodeStyle}>
                        <h2 className={styles.h2Style}>Kod QR produktu:</h2>
                        <p>Kodzik qr</p>
                    </span>
                    <span className={styles.nameProduct}>
                        <h2 className={styles.h2Style}>Nazwa produktu:</h2>
                        <p>Jakiś tam produkt</p>
                    </span>
                </div>
                <div className={styles.quantityStyle}>
                <div className={styles.form_group}>
                    <label htmlFor="quantity">Ilość</label>
                    <InputGroup className={styles.inputText} hasValidation>
                        <Form.Control
                        type="number"
                        id="quantity"
                        defaultValue={324}
                        value={quantity}
                        isInvalid={validatedQuantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        />
                        <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                            Puste pole!
                        </Form.Control.Feedback>
                    </InputGroup>
                    </div>
                </div>
                <div className={styles.buttonStyle}>
                    <button className={styles.confirm}>Zatwierdź</button>
                    <Link to="/scan"><button className={styles.cancel}>Anuluj</button></Link>
                </div>
            </div>
        </>
    
    );
  };

export default ProductPage;
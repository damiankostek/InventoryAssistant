import { Form, InputGroup } from 'react-bootstrap';
import styles from './ScanPage.module.css';
import { useState } from 'react';

const ScanPage: React.FC = () => {
    const [qrCode, setQRCode] = useState('');
    const [validatedQRCode] = useState(false);
    
    return (
        <>
            <div className={styles.scanContainer}>
                <div className={styles.qrContainer}>
                    <h1>Zeskanuj kod QR</h1>
                    <div className={styles.qrWindow}>
                        <i>miejsce na czytnik kodów</i>
                    </div>
                </div>
                <div className={styles.codeStyle}>
                <div className={styles.form_group}>
                    <label htmlFor="qr_code">lub wprowadź kod ręcznie</label><br />
                    <InputGroup className={styles.inputText} hasValidation>
                        <Form.Control
                        type="text"
                        id="qr_code"
                        value={qrCode}
                        isInvalid={validatedQRCode}
                        onChange={(e) => setQRCode(e.target.value)}
                        />
                        <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                            Niepoprawny kod.
                        </Form.Control.Feedback>
                    </InputGroup>
                    </div>
                </div>
                <button className={styles.check}>Sprawdź</button>
            </div>
        </>
    
    );
  };

export default ScanPage;
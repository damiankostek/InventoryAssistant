import { Form, InputGroup } from 'react-bootstrap';
import styles from './ScanPage.module.css';
import { useState } from 'react';
import { Html5QrcodeScanner } from "html5-qrcode";

{/* <script src="html5-qrcode.min.js"></script> */}

const ScanPage: React.FC = () => {
    const [qrCode, setQRCode] = useState('');
    const [validatedQRCode] = useState(false);
    const [aparatClicked, setAparatClicked] = useState(false);

    function onScanSuccess(decodedText: any, decodedResult: any) {
        setQRCode(decodedText);
        console.log(`Scan result: ${decodedText}`, decodedResult);
    }

    function onScanError(errorMessage: any) {
        console.log({errorMessage})
    }

    const onAparat = () => {
        setAparatClicked(true);
        var html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 30, qrbox: 250 }, false);
        html5QrcodeScanner.render(onScanSuccess, onScanError);
    }

    const sendQrCode = () => {
        const requestBody = {
            qrCode: qrCode
          };
          console.log(requestBody)
    }
    

    return (
        <>
            <div className={styles.scanContainer}>
                <div>
                    <h1>Zeskanuj kod QR</h1>
                    <div>
                        {!aparatClicked && (
                            <button onClick={onAparat} className={styles.onAparat}>Włącz aparat</button>
                        )}
                        <div style={{ width: '100%' }} className={styles.test} id="reader"></div>
                    </div>
                </div>
                <div className={styles.codeStyle}>
                <div className={styles.form_group}>
                    <label htmlFor="qr_code">lub wprowadź kod ręcznie</label><br />
                    <InputGroup className={qrCode!=''?styles.inputTextGreen:styles.inputText} hasValidation>
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
                <button onClick={sendQrCode} className={styles.check}>Sprawdź</button>
            </div>
        </>
    
    );
  };

export default ScanPage;
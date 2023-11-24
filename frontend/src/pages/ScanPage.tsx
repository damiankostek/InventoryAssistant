import { Form, InputGroup } from 'react-bootstrap';
import styles from '../styles/ScanPage.module.css';
import { useState } from 'react';
import { Html5QrcodeScanner } from "html5-qrcode";
import Cookies from "js-cookie";
import { Link } from 'react-router-dom';

<script src="html5-qrcode.min.js"></script>

const ScanPage: React.FC = () => {
    const [qrCode, setQRCode] = useState('');
    const [validatedQRCode, setValidatedQRCode] = useState(false);
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
// ogarnac zeby wysylalo request po wlaczeniu aparatu
    const sendQrCode = () => {
        const apiUrl = 'http://localhost:8080/qrCode';

        const requestBody = {
            qrCode: qrCode
          };
          console.log(requestBody)
          fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Login failed');
            }
            return response.json();
          })
          .then((data) => {
            console.log(data)
            if(data.success) {
              Cookies.set('user', data.success, { expires: 7 });
              setValidatedQRCode(false); //niedokonczone
            }
          }).catch((error) => {
            console.error(error);
          });
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
                        <div style={{ width: '100%' }} className={styles.qrReader} id="reader"></div>
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
                <Link to="/productsTable"><button className={styles.check}>Wszystkie produkty</button></Link>
            </div>
        </>
    
    );
  };

export default ScanPage;
import { Form, InputGroup } from 'react-bootstrap';
import styles from '../styles/ScanPage.module.css';
import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from "html5-qrcode";
import Cookies from "js-cookie";
import api from "../assets/api.json";

{/* <script src="html5-qrcode.min.js"></script> */}

// ogarnac zeby wysylalo request po wlaczeniu aparatu !!!!!!

const ScanTable: React.FC = () => {
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

  useEffect( () => {
    const token = Cookies.get('user');
    if(token){
        const apiUrl = 'http://'+api+':8080/auth';
        
        const requestBody = {
          token: token,
        };
        fetch(apiUrl, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
        .then((response) => {
          if (response.status == 500) {
              throw new Error('Błąd serwera');
          }
          return response.json();
        })
        .then((data) => {
          if(data.success) {
            console.log(data.success);
          }else {
            Cookies.remove('user', { path: '/', domain: 'localhost' });
          }
        })
        .catch((error) => {
            console.log(error);
        });
    }
  }, []);

  const sendTableQrCode = () => {
      const apiUrl = 'http://'+api+':8080/sendTableQrCode';

      const requestBody = {
          qrCode: qrCode
        };
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
          if(data.success) {
            setValidatedQRCode(false);
            document.location.href = '/scan?qrCode='+qrCode;
          }else if(data.fail){
            console.log(data.fail);
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
                    <h2>magazynu lub instytucji</h2>
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
                <button onClick={sendTableQrCode} className={styles.check}>Sprawdź</button>
            </div>
        </>
    
    );
  };

export default ScanTable;
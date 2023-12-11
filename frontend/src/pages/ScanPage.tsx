import { Form, InputGroup } from 'react-bootstrap';
import styles from '../styles/ScanPage.module.css';
import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from "html5-qrcode";
import Cookies from "js-cookie";
import { Link } from 'react-router-dom';

{/* <script src="html5-qrcode.min.js"></script> */}

// ogarnac zeby wysylalo request po wlaczeniu aparatu !!!!!!

const ScanPage: React.FC = () => {
    const [idTable, setIdTable] = useState('');
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
        const apiUrl = 'http://localhost:8080/auth';
        
        const requestBody = {
          token: token,
        };
        console.log("token1: "+token)
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
            getInventoryID();
          }else {
            Cookies.remove('user', { path: '/', domain: 'localhost' });
          }
        })
        .catch((error) => {
            console.log(error);
        });
    }
  }, []);

  async function getInventoryID() {
    const getInventoryIdApiUrl = 'http://localhost:8080/getInventoryId';

            const requestBody = {
              token: Cookies.get('user')
            };
            console.log(requestBody)
            fetch(getInventoryIdApiUrl, {
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
                setIdTable(data.inventoryId)
                console.log('InventoryId:', data.inventoryId);
                console.log('InventoryId:', idTable);
            })
            .catch((error) => {
                console.error('Błąd przy pobieraniu inventoryId:', error);
            });
  }

  const sendQrCode = () => {
      const apiUrl = 'http://localhost:8080/sendQrCode';

      const requestBody = {
          idTable: idTable,
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
            setValidatedQRCode(false);
            document.location.href = '/product?idTable='+idTable+'&qrCode='+qrCode;
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
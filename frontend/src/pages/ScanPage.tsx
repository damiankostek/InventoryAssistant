import { Form, InputGroup } from 'react-bootstrap';
import styles from '../styles/ScanPage.module.css';
import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from "html5-qrcode";
import Cookies from "js-cookie";
import { Link } from 'react-router-dom';
import api from "../assets/api.json";

const ScanPage: React.FC = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const qrCodeTable = urlParams.get('qrCode');
    const [listType, setListType] = useState('');
    const [tableName, setTableName] = useState('');
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
            getTableByQrCode();
          }else {
            Cookies.remove('user', { path: '/', domain: 'localhost' });
          }
        })
        .catch((error) => {
            console.log(error);
        });
    }
  }, []);

  const getTableByQrCode = () => {
    const apiUrl = 'http://'+api+':8080/getTableByQrCode';

    const requestBody = {
        qrCode: qrCodeTable
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
        if(data) {
          setListType(data.type);
          setTableName(data.name);
        }else if(data.fail){
          console.log(data.fail);
        }
      }).catch((error) => {
        console.error(error);
      });
}

  const sendQrCodeWH = () => {
      const apiUrl = 'http://'+api+':8080/sendQrCode'; 

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
            setValidatedQRCode(false);
            document.location.href = '/product?qrCode='+qrCode;
          }else if(data.fail){
            console.log(data.fail);
          }
        }).catch((error) => {
          console.error(error);
        });
  }

  const sendQrCodeIN = () => {
    const apiUrl = 'http://'+api+':8080/sendQrCodeIN'; 

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
          setValidatedQRCode(false);
          document.location.href = '/product?qrCode='+qrCode;
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
                  <div>
                  {listType == "wh" ? <h2>Magazyn: {tableName}</h2> : listType == "in" ? <h2>Instytucja: {tableName}</h2> : null}
                  </div><br />
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
                {listType == "wh" ? 
                <div className={styles.buttonStyle}>
                    <button onClick={sendQrCodeWH} className={styles.check}>Sprawdź</button>
                </div>
                : listType == "in" ? 
                <div className={styles.buttonStyle}>
                    <button onClick={sendQrCodeIN} className={styles.check}>Sprawdź</button>
                </div>
                : null}
                
                <Link to={{ pathname: '/productsTable', search: `?qrCodeTable=${qrCodeTable}` }}>
                  <button className={styles.check}>Szczegóły</button>
                </Link>
            </div>
        </>
    
    );
  };

export default ScanPage;
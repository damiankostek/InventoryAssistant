import { Form, InputGroup } from 'react-bootstrap';
import styles from '../styles/ProductPage.module.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from "js-cookie";
import api from "../assets/api.json";


const ProductPage: React.FC = () => {
    const [qrCode, setQrCode] = useState<string | null>('');
    const [qrCodeProduct, setQrCodeProduct] = useState([]);
    const [listType, setListType] = useState('');
    const [tableName, setTableName] = useState('');
    const [name, setName] = useState("");
    const [newQuantity, setNewQuantity] = useState("");
    const [, setQuantityChanged] = useState(false);

    const [feedbackValues, setFeedbackValues] = useState({
      newQuantity: ''
    })
    const [validatedValues, setValidatedValues] = useState({
      newQuantity: false
    })
    
    const splitingQRCode = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const qrCodeP = urlParams.get('qrCode');
      const QS: any = qrCodeP?.split("-");
      setQrCode(qrCodeP);
      setTableName(QS[0]);
      setQrCodeProduct(QS);
    }

    useEffect( () => {

      splitingQRCode();

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
      const urlParams = new URLSearchParams(window.location.search);
      const qrCodeP = urlParams.get('qrCode');
      const QS: any = qrCodeP?.split("-");

      const requestBody = {
          qrCode: QS[0]
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
            console.log(data.type)
            if(data.type == "wh") {
              getProductDetails();
            } else if(data.type == "in") {
              getPositionDetails();
            }
          }else if(data.fail){
            console.log(data.fail);
          }
        }).catch((error) => {
          console.error(error);
        });
  }
      const getProductDetails = () => {
        const apiUrl = 'http://'+api+':8080/getProduct';
        const urlParams = new URLSearchParams(window.location.search);
        const qrCodeP = urlParams.get('qrCode');
       
        const requestBody = {
            qrCode: qrCodeP
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
            if (response.status == 500) {
              throw new Error('Błąd serwera');
            }
            return response.json();
          })
          .then((data) => {
            if(data.fail){
                console.log("Błąd pobierania tabeli");
            }else {
              console.log(data)
                setName(data.name);   
                setNewQuantity(data.quantity);                        
            }
          }
          )
    }

    const getPositionDetails = () => {
      const apiUrl = 'http://'+api+':8080/getPosition';
      const urlParams = new URLSearchParams(window.location.search);
      const qrCodeP = urlParams.get('qrCode');      
     
      const requestBody = {
          qrCode: qrCodeP
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
          if(data.fail){
              console.log("Błąd pobierania tabeli");
          }else {
            console.log(data)
              setName(data.name);   
              setNewQuantity(data.quantity);                        
          }
        }
        )
  }

      const setChangeQuantity = () => {
        const apiUrl = 'http://'+api+':8080/setChangeQuantity';
        const token = Cookies.get('user');
  
        const requestBody = {
          token: token,
          qrCode: qrCode,
          newQuantity: newQuantity
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
            if(data.updated.quantity) {
                console.log("Quantity updated");
                setQuantityChanged(true);
                document.location.href = '/scan?qrCode='+qrCodeProduct[0];
            }
            if(data.errors){
                console.log(data.errors)
                if(data.errors.quantity == '') {
                  setValidatedValues((prev) => ({
                      ...prev, 
                      newQuantity: true
                  }));
                  setFeedbackValues((prev) => ({
                      ...prev, 
                      newQuantity: data.errors.quantity[0]
                  }));
                }else{
                  setValidatedValues((prev) => ({
                    ...prev, 
                    newQuantity: false
                  }));
                }
            }
          }).catch((error) => {
            console.error(error);
          });
    }

    const setChangeQuantityIN = () => {
      const apiUrl = 'http://'+api+':8080/setChangeQuantityIN';

      const requestBody = {
        qrCode: qrCode,
        newQuantity: newQuantity
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
          if(data.updated.quantity) {
              console.log("Quantity updated");
              setQuantityChanged(true);
              document.location.href = '/scan?qrCode='+qrCodeProduct[0];
          }
          if(data.errors){
              console.log(data.errors)
              if(data.errors.quantity == '') {
                setValidatedValues((prev) => ({
                    ...prev, 
                    newQuantity: true
                }));
                setFeedbackValues((prev) => ({
                    ...prev, 
                    newQuantity: data.errors.quantity[0]
                }));
              }else{
                setValidatedValues((prev) => ({
                  ...prev, 
                  newQuantity: false
                }));
              }
          }
        }).catch((error) => {
          console.error(error);
        });
  }

    return (
        <>
            <div className={styles.productContainer}>
                <div className={styles.contentContainer}>
                    <span className={styles.tableNameStyle}>
                    {listType == "wh" ? <h2>Magazyn: {tableName}</h2> : listType == "in" ? <h2>Instytucja: {tableName}</h2> : null}
                    </span>
                    <span className={styles.qrCodeStyle}>
                        <h2 className={styles.h2Style}>Kod QR produktu:</h2>
                        <p>{qrCode}</p>
                    </span>
                    <span className={styles.nameProduct}>
                        <h2 className={styles.h2Style}>Nazwa:</h2>
                        <p>{name}</p>
                    </span>
                </div>
                <div className={styles.quantityStyle}>
                <div className={styles.form_group}>
                    <label htmlFor="newQuantity">Ilość</label>
                    <InputGroup className={styles.inputText} hasValidation>
                        <Form.Control
                        type="number"
                        id="newQuantity"
                        value={newQuantity}
                        isInvalid={validatedValues.newQuantity}
                        onChange={(e) => setNewQuantity(e.target.value)}
                        />
                        <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                        {feedbackValues.newQuantity}
                        </Form.Control.Feedback>
                    </InputGroup>
                    </div>
                </div>
                {listType == "wh" ? 
                <div className={styles.buttonStyle}>
                    <button onClick={setChangeQuantity} className={styles.confirm}>Zatwierdź</button>
                    <Link to={{ pathname: '/scan', search: `?qrCode=${qrCodeProduct[0]}` }}><button className={styles.cancel}>Anuluj</button></Link>
                </div>
                : listType == "in" ? 
                <div className={styles.buttonStyle}>
                    <button onClick={setChangeQuantityIN} className={styles.confirm}>Zatwierdź</button>
                    <Link to={{ pathname: '/scan', search: `?qrCode=${qrCodeProduct[0]}` }}><button className={styles.cancel}>Anuluj</button></Link>
                </div>
                : null}
            </div>
        </>
    
    );
  };

export default ProductPage;
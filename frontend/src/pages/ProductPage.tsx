import { Form, InputGroup } from 'react-bootstrap';
import styles from '../styles/ProductPage.module.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from "js-cookie";
import api from "../assets/api.json";

var products:any = []

const ProductPage: React.FC = () => {
    const [tableName, setTableName] = useState('');
    const [quantity, setQuantity] = useState("");
    const [inventory, ] = useState('X');

    const [, setQuantityChanged] = useState(false);

    const [feedbackValues, setFeedbackValues] = useState({
        quantity: ''
    })
    const [validatedValues, setValidatedValues] = useState({
        quantity: false
    })
    
    const [product, setProduct] = useState(products)

    useEffect( () => {
        const token = Cookies.get('user');
        if(token){
            const apiUrl = 'http://'+api+':8080/auth';
            
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
                
                getTableDetails();
              }else {
                Cookies.remove('user', { path: '/', domain: 'localhost' });
              }
            })
            .catch((error) => {
                console.log(error);
            });
        }
      }, []);

      const getTableDetails = () => {
        const apiUrl = 'http://'+api+':8080/getProduct';
        const params = new URLSearchParams(window.location.search);
        const idT = params.get('idTable');
        const qrC = params.get('qrCode');
        const requestBody = {
            id: idT,
            qr: qrC
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
                setTableName(data.data.tableName);
                setProduct(data.data.product);   
                setQuantity(data.data.product.quantity);                        
            }
          }
          )
    }

      const setChangeQuantity = () => {
        const apiUrl = 'http://'+api+':8080/setChangeQuantity';
        const params = new URLSearchParams(window.location.search);
        const idT = params.get('idTable');
        const qrC = params.get('qrCode');
  
        const requestBody = {
            idTable: idT,
            qrCode: qrC,
            quantity: quantity,
            inventory: inventory
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
                document.location.href = '/scan'
            }
            if(data.errors){
                console.log(data.errors)
                if(data.errors.quantity == '') {
                  setValidatedValues((prev) => ({
                      ...prev, 
                      quantity: true
                  }));
                  setFeedbackValues((prev) => ({
                      ...prev, 
                      quantity: data.errors.quantity[0]
                  }));
                }else{
                  setValidatedValues((prev) => ({
                    ...prev, 
                    quantity: false
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
                        <h2 className={styles.h2Style}>Tabela:</h2>
                        <p>{tableName}</p>
                    </span>
                    <span className={styles.qrCodeStyle}>
                        <h2 className={styles.h2Style}>Kod QR produktu:</h2>
                        <p>{product.qrCode}</p>
                    </span>
                    <span className={styles.nameProduct}>
                        <h2 className={styles.h2Style}>Nazwa produktu:</h2>
                        <p>{product.name}</p>
                    </span>
                </div>
                <div className={styles.quantityStyle}>
                <div className={styles.form_group}>
                    <label htmlFor="quantity">Ilość</label>
                    <InputGroup className={styles.inputText} hasValidation>
                        <Form.Control
                        type="number"
                        id="quantity"
                        value={quantity}
                        isInvalid={validatedValues.quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        />
                        <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                        {feedbackValues.quantity}
                        </Form.Control.Feedback>
                    </InputGroup>
                    </div>
                </div>
                <div className={styles.buttonStyle}>
                    <button onClick={setChangeQuantity} className={styles.confirm}>Zatwierdź</button>
                    <Link to="/scan"><button className={styles.cancel}>Anuluj</button></Link>
                </div>
            </div>
        </>
    
    );
  };

export default ProductPage;
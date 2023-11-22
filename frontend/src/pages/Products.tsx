import { useState } from 'react';
import styles from '../styles/Products.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, InputGroup } from 'react-bootstrap';

let nameTableFeedback:string;
let qrCodeFeedback:string;
let nameFeedback:string;
let quantityFeedback:number;

const Products: React.FC = () => {
    const [nameTable, setNameTable] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    
    const [validatedNameTable, setValidatedNameTable] = useState(false);
    const [validatedQrCode, setValidatedQrCode] = useState(false);
    const [validatedName, setValidatedName] = useState(false);
    const [validatedQuantity, setValidatedQuantity] = useState(false);
    
    const handleAddProduct = () => {
        setValidatedNameTable(false);
        setValidatedQrCode(false);
        setValidatedName(false);
        setValidatedQuantity(false);
    
        const apiUrl = 'http://localhost:8080/addProduct'; // nie ma backed
    
        const requestBody = {
          nameTable: nameTable,
          qrCode: qrCode,
          name: name,
          quantity: quantity
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
              console.log(data.errors);
              if(data.success){
                console.log(data.success);
              }else{
                if(data.errors.nameTable != "") {
                  setValidatedNameTable(true);
                  nameTableFeedback = data.errors.nameTable[0]
                }else{
                  setValidatedNameTable(false);
                }

                if(data.errors.qrCode != "") {
                setValidatedQrCode(true);
                qrCodeFeedback = data.errors.qrCode[0]
                }else{
                  setValidatedQrCode(false);
                }

                if(data.errors.name != "") {
                    setValidatedName(true);
                    nameFeedback = data.errors.name[0]
                    }else{
                      setValidatedName(false);
                    }
    
                if(data.errors.quantity != "") {
                  setValidatedQuantity(true);
                  quantityFeedback = data.errors.quantity[0]
                }else{
                  setValidatedQuantity(false);
                }
              }
          });
      };

    return (
        <>
            <div className={styles.adminContent}>
                <div className={styles.addProducts}>
                  <h3>Dodaj pozycje</h3>
                  <div className={styles.addProduct}>
                    <div>
                      <div className={styles.form_group}>
                          <label htmlFor="qrCode">Kod QR:</label><br />
                          <InputGroup className={styles.inputText} hasValidation>
                              <Form.Control
                              type="text"
                              id="qrCode"
                              value={qrCode}
                              isInvalid={validatedQrCode}
                              onChange={(e) => setQrCode(e.target.value)}
                              />
                              <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                                  {qrCodeFeedback}
                              </Form.Control.Feedback>
                          </InputGroup>
                      </div>
                    </div>
                    <div>
                      <div className={styles.form_group}>
                          <label htmlFor="name">Nazwa:</label><br />
                          <InputGroup className={styles.inputText} hasValidation>
                              <Form.Control
                              type="text"
                              id="name"
                              value={name}
                              isInvalid={validatedName}
                              onChange={(e) => setName(e.target.value)}
                              />
                              <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                                  {nameFeedback}
                              </Form.Control.Feedback>
                          </InputGroup>
                      </div>
                    </div>
                    <div>
                      <div className={styles.form_group}>
                          <label htmlFor="quantity">Ilość:</label><br />
                          <InputGroup className={styles.inputText} hasValidation>
                              <Form.Control
                              type="number"
                              id="quantity"
                              value={quantity}
                              defaultValue={0}
                              isInvalid={validatedQuantity}
                              onChange={(e) => setQuantity(e.target.value)}
                              />
                              <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                                  {quantityFeedback}
                              </Form.Control.Feedback>
                          </InputGroup>
                      </div>
                    </div>
                      <div className={styles.AddProductButtons}>
                          <button onClick={handleAddProduct} className={styles.AddProductButton}>Dodaj pozycje</button>
                      </div>
                  </div>
                </div>
            </div>
        </>
    
    );
  };

export default Products;
import { useEffect, useState } from 'react';
import styles from '../styles/AddInstitution.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, InputGroup } from 'react-bootstrap';
import api from "../assets/api.json";
import QRCode from 'qrcode.react';
import Cookies from "js-cookie";

let warehouseNameFeedback:string;
let hallNameFeedback:string;
let sectionNameFeedback:string;
let roomNameFeedback:string;
let ownerRoomFeedback:string;

var product:any = []

const generateRandomQRCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < 15; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const AddWarehouse: React.FC = () => {
    const [warehouseName, setWarehouseName] = useState('');
    const [hallName, setHallName] = useState('');
    const [sectionName, setSectionName] = useState('');
    const [roomName, setRoomName] = useState('');
    const [ownerRoom, setOwnerRoom] = useState('');
    const [ownerProduct, setOwnerProduct] = useState('');
    const [qrCode, setQrCode] = useState<string>(generateRandomQRCode());
    const [qrCodeImage, setQRCodeImage] = useState<JSX.Element | null>(null);
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');

    const [feedbackValues, setFeedbackValues] = useState({
      ownerProduct: '',
      qrCode: '',
      name: '',
      quantity: ''
    })
    const [validatedValues, setValidatedValues] = useState({
      ownerProduct: false,
        qrCode: false,
        name: false,
        quantity: false,
    })
    
    const [productsTable, setProductsTable] = useState(product)
    
    const [validatedWarehouseName, setValidatedWarehouseName] = useState(false);
    const [validatedHallName, setValidatedHallName] = useState(false);
    const [validatedSectionName, setValidatedSectionName] = useState(false);
    const [validatedRoomName, setValidatedRoomName] = useState(false);
    const [validatedOwnerRoom, setValidatedOwnerRoom] = useState(false);

    useEffect( () => {
      // fetch
      if (qrCode) {
        setQRCodeImage(<QRCode value={qrCode} size={55} />);
      }
    }, [qrCode]);

    const handleGenerateRandomQRCode = () => {
      const newQRCode = generateRandomQRCode();
      setQrCode(newQRCode);
    };
    
    const handleCreateInstitution = () => {
      setValidatedWarehouseName(false);
      setValidatedHallName(false);
      setValidatedSectionName(false);
      setValidatedRoomName(false);
      setValidatedOwnerRoom(false);

      const isQRCodeExist = productsTable.some((product: any) => product.qrCode === qrCode);

    if (isQRCodeExist) {
      console.log("Kod QR już istnieje w bazie danych. Wygeneruj nowy kod QR.");
      return;
    }
    
        const apiUrl = 'http://'+api+':8080/createInstitution';
        const productApiUrl = 'http://'+api+':8080/addProducts'; 
        const token = Cookies.get('user');
    
        const requestBody = {
          token: token,
          warehouseName: warehouseName,
          hallName: hallName,
          sectionName: sectionName,
          roomName: roomName,
          ownerproduct: ownerProduct,
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
                if(data.errors.tableName != "") {
                setValidatedWarehouseName(true);
                warehouseNameFeedback = data.errors.tableName[0]
                }else{
                  setValidatedWarehouseName(false);
                }
                if(data.errors.tableName != "") {
                  setValidatedHallName(true);
                  hallNameFeedback = data.errors.tableName[0]
                }else{
                  setValidatedHallName(false);
                }
                if(data.errors.tableName != "") {
                  setValidatedSectionName(true);
                  sectionNameFeedback = data.errors.tableName[0]
                }else{
                  setValidatedSectionName(false);
                }
                if(data.errors.tableName != "") {
                  setValidatedRoomName(true);
                  roomNameFeedback = data.errors.tableName[0]
                }else{
                  setValidatedRoomName(false);
                }
              }
          });
          fetch(productApiUrl, {
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
                  if(data.errors.qrCode.length != 0) {
                      setValidatedValues((prev) => ({
                          ...prev, 
                          qrCode: true
                      }));
                      setFeedbackValues((prev) => ({
                          ...prev, 
                          qrCode: data.errors.qrCode[0]
                      }));
                    }else{
                      setValidatedValues((prev) => ({
                        ...prev, 
                        qrCode: false
                      }));
                    }
      
                    if(data.errors.name.length != 0) {
                      setValidatedValues((prev) => ({
                          ...prev, 
                          name: true
                      }));
                      setFeedbackValues((prev) => ({
                          ...prev, 
                          name: data.errors.name[0]
                      }));
                    }else{
                      setValidatedValues((prev) => ({
                        ...prev, 
                        name: false
                      }));
                    }
      
                    if(data.errors.quantity != "") {
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
            });
      };

    return (
        <>
            <div className={styles.adminContent}>
              <div className={styles.formContent}>
              <div className={styles.details}>
                <div className={styles.form_group}>
                    <label htmlFor="warehouseName">Instytucja:</label><br />
                      <InputGroup className={styles.inputText} hasValidation>
                          <Form.Control
                          type="text"
                          id="warehouseName"
                          value={warehouseName}
                          isInvalid={validatedWarehouseName}
                          onChange={(e) => setWarehouseName(e.target.value)}
                          />
                          <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                              {warehouseNameFeedback}
                          </Form.Control.Feedback>
                      </InputGroup>
                    </div>
                    <div className={styles.form_group}>
                        <label htmlFor="hallName">Budynek:</label><br />
                        <InputGroup className={styles.inputText} hasValidation>
                            <Form.Control
                            type="text"
                            id="hallName"
                            value={hallName}
                            isInvalid={validatedHallName}
                            onChange={(e) => setHallName(e.target.value)}
                            />
                            <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                                {hallNameFeedback}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </div>
                    <div className={styles.form_group}>
                        <label htmlFor="sectionName">Piętro:</label><br />
                        <InputGroup className={styles.inputText} hasValidation>
                            <Form.Control
                            type="text"
                            id="sectionName"
                            value={sectionName}
                            isInvalid={validatedSectionName}
                            onChange={(e) => setSectionName(e.target.value)}
                            />
                            <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                                {sectionNameFeedback}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </div>
                    <div className={styles.form_group}>
                        <label htmlFor="roomName">Pokój:</label><br />
                        <InputGroup className={styles.inputText} hasValidation>
                            <Form.Control
                            type="text"
                            id="roomName"
                            value={roomName}
                            isInvalid={validatedRoomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            />
                            <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                                {roomNameFeedback}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </div>
                    <div className={styles.form_group}>
                        <label htmlFor="ownerRoom">Właściciel/e pokoju:</label><br />
                        <InputGroup className={styles.inputText} hasValidation>
                            <Form.Control
                            type="text"
                            id="ownerRoom"
                            value={ownerRoom}
                            isInvalid={validatedOwnerRoom}
                            onChange={(e) => setOwnerRoom(e.target.value)}
                            />
                            <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                                {ownerRoomFeedback}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </div>
                  </div>
              </div>
                    
                    <div className={styles.addProducts}>
                      <div className={styles.addProduct}>
                      <div>
                      <div className={styles.form_group}>
                          <label htmlFor="qrCode">Kod QR:</label><br />
                          <InputGroup className={styles.inputText} hasValidation>
                            <Form.Control
                              type="text"
                              id="qrCode"
                              value={qrCode}
                              isInvalid={validatedValues.qrCode}
                              onChange={(e) => setQrCode(e.target.value)}
                            />
                            <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                              {feedbackValues.qrCode}
                            </Form.Control.Feedback>
                            <div className={styles.qrCodePreview}>
                              {qrCodeImage}
                            </div>
                            <div>
                              <button onClick={handleGenerateRandomQRCode} className={styles.drawButton}>
                                <i className="fa-solid fa-rotate fa-xl"></i>
                              </button>
                            </div>
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
                                isInvalid={validatedValues.name}
                                onChange={(e) => setName(e.target.value)}
                                />
                                <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                                    {feedbackValues.name}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </div>
                      </div>
                      <div>
                        <div className={styles.form_group}>
                            <label htmlFor="ownerProduct">Właściciel:</label><br />
                            <InputGroup className={styles.inputText} hasValidation>
                                <Form.Control
                                type="text"
                                id="ownerProduct"
                                value={ownerProduct}
                                isInvalid={validatedValues.ownerProduct}
                                onChange={(e) => setOwnerProduct(e.target.value)}
                                />
                                <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                                    {feedbackValues.ownerProduct}
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
                                isInvalid={validatedValues.quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                />
                                <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                                    {feedbackValues.quantity}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </div>
                      </div>
                    </div>
                    </div>
                    <div className={styles.registrationButtons}>
                        <button onClick={handleCreateInstitution} className={styles.registrationButton}>Utwórz tabele</button>
                    </div>
                </div>
        </>
    
    );
  };

export default AddWarehouse;
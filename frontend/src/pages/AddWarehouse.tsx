import { useState } from 'react';
import styles from '../styles/AddWarehouse.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, InputGroup } from 'react-bootstrap';
import api from "../assets/api.json";
import Cookies from "js-cookie";

let warehouseNameFeedback:string;

const AddWarehouse: React.FC = () => {
    const [warehouseName, setWarehouseName] = useState('');
    
    
    const [validatedWarehouseName, setValidatedWarehouseName] = useState(false);

    
    const handleCreateWarehouse = () => {
      setValidatedWarehouseName(false);

        const apiUrl = 'http://'+api+':8080/createWarehouse';
        const token = Cookies.get('user');
    
        const requestBody = {
          token: token,
          warehouseName: warehouseName
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
              if(data.success){
                console.log(data.success);
              }else{
                if(data.errors.warehouseName != "") {
                setValidatedWarehouseName(true);
                warehouseNameFeedback = data.errors.warehouseName[0]
                }else{
                  setValidatedWarehouseName(false);
                }
                
                // if(data.errors.qrCode.length != 0) {
                //   setValidatedValues((prev) => ({
                //       ...prev, 
                //       qrCode: true
                //   }));
                //   setFeedbackValues((prev) => ({
                //       ...prev, 
                //       qrCode: data.errors.qrCode[0]
                //   }));
                // }else{
                //   setValidatedValues((prev) => ({
                //     ...prev, 
                //     qrCode: false
                //   }));
                // }
  
                // if(data.errors.name.length != 0) {
                //   setValidatedValues((prev) => ({
                //       ...prev, 
                //       name: true
                //   }));
                //   setFeedbackValues((prev) => ({
                //       ...prev, 
                //       name: data.errors.name[0]
                //   }));
                // }else{
                //   setValidatedValues((prev) => ({
                //     ...prev, 
                //     name: false
                //   }));
                // }
  
                // if(data.errors.quantity != "") {
                //   setValidatedValues((prev) => ({
                //       ...prev, 
                //       quantity: true
                //   }));
                //   setFeedbackValues((prev) => ({
                //       ...prev, 
                //       quantity: data.errors.quantity[0]
                //   }));
                // }else{
                //   setValidatedValues((prev) => ({
                //     ...prev, 
                //     quantity: false
                //   }));
                // }
              }
          });
      };

    return (
        <>
            <div className={styles.adminContent}>
              <div className={styles.formContent}>
              <div className={styles.details}>
                <div className={styles.form_group}>
                    <label htmlFor="warehouseName">Magazyn:</label><br />
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
                  </div>
              </div>
              <div className={styles.registrationButtons}>
                  <button onClick={handleCreateWarehouse} className={styles.registrationButton}>Dodaj magazyn</button>
              </div>
          </div>
        </>
    
    );
  };

export default AddWarehouse;
import { useEffect, useState } from 'react';
import styles from '../styles/AddWarehouse.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, InputGroup } from 'react-bootstrap';
import api from "../assets/api.json";
import Cookies from "js-cookie";
import QRCode from 'qrcode.react';

let warehouseNameFeedback:string;

const AddWarehouse: React.FC = () => {
    const [warehouseName, setWarehouseName] = useState('');
    const [qrCode, ] = useState('');
    const [, setQRCodeImage] = useState<JSX.Element | null>(null);
    
    const [validatedWarehouseName, setValidatedWarehouseName] = useState(false);

    useEffect( () => {

        if (qrCode) {
          setQRCodeImage(<QRCode value={qrCode} size={55} />);
        }
      }, [qrCode]);

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
                const canvas: any = document.getElementById(warehouseName);
                if(canvas) {
                  const pngUrl = canvas
                    .toDataURL("image/png")
                    .replace("image/png", "image/octet-stream");
                  let downloadLink = document.createElement("a");
                  downloadLink.href = pngUrl
                  downloadLink.download = warehouseName+".png";
                  document.body.appendChild(downloadLink);
                  downloadLink.click();
                  document.body.removeChild(downloadLink);
                }
                window.location.reload();
              }else{
                if(data.errors.warehouseName != "") {
                setValidatedWarehouseName(true);
                warehouseNameFeedback = data.errors.warehouseName[0]
                }else{
                  setValidatedWarehouseName(false);
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
                      <QRCode value={warehouseName} size={120} id={warehouseName}/>
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
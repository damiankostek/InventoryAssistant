import { useEffect, useState } from 'react';
import styles from '../styles/AddInstitution.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, InputGroup } from 'react-bootstrap';
import api from "../assets/api.json";
import Cookies from "js-cookie";
import QRCode from 'qrcode.react';

let institutionNameFeedback:string;

const AddInstitution: React.FC = () => {
    const [institutionName, setInstitutionName] = useState('');
    const [qrCode, ] = useState('');
    const [, setQRCodeImage] = useState<JSX.Element | null>(null);

    const [validatedInstitutionName, setValidatedInstitutionName] = useState(false);

    useEffect( () => {

      if (qrCode) {
        setQRCodeImage(<QRCode value={qrCode} size={55} />);
      }
    }, [qrCode]);

    const handleCreateInstitution = () => {
      setValidatedInstitutionName(false);

        const apiUrl = 'http://'+api+':8080/createInstitution';
        const token = Cookies.get('user');
    
        const requestBody = {
          token: token,
          institutionName: institutionName
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
                const canvas: any = document.getElementById(institutionName);
                if(canvas) {
                  const pngUrl = canvas
                    .toDataURL("image/png")
                    .replace("image/png", "image/octet-stream");
                  let downloadLink = document.createElement("a");
                  downloadLink.href = pngUrl
                  downloadLink.download = institutionName+".png";
                  document.body.appendChild(downloadLink);
                  downloadLink.click();
                  document.body.removeChild(downloadLink);
                }
                window.location.reload();
              }else{
                if(data.errors.institutionName != "") {
                setValidatedInstitutionName(true);
                institutionNameFeedback = data.errors.institutionName[0]
                }else{
                  setValidatedInstitutionName(false);
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
                    <label htmlFor="institutionName">Instytucja:</label><br />
                      <InputGroup className={styles.inputText} hasValidation>
                          <Form.Control
                          type="text"
                          id="institutionName"
                          value={institutionName}
                          isInvalid={validatedInstitutionName}
                          onChange={(e) => setInstitutionName(e.target.value)}
                          />
                          <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                              {institutionNameFeedback}
                          </Form.Control.Feedback>
                      </InputGroup>
                      <QRCode value={institutionName} size={120} id={institutionName}/>
                    </div>
                  </div>
              </div>
              <div className={styles.registrationButtons}>
                  <button onClick={handleCreateInstitution} className={styles.registrationButton}>Dodaj instytucję</button>
              </div>
          </div>
        </>
    
    );
  };

export default AddInstitution;
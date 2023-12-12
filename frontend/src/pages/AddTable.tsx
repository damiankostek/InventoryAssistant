import { useState } from 'react';
import styles from '../styles/AddUser.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, InputGroup } from 'react-bootstrap';
import api from "../assets/api.json";

let tableNameFeedback:string;

const AddTable: React.FC = () => {
    const [tableName, setTableName] = useState('');
    
    const [validatedTableName, setValidatedTableName] = useState(false);
    
    const handleCreateTable = () => {
        setValidatedTableName(false);
    
        const apiUrl = 'http://'+api+':8080/createTable';
    
        const requestBody = {
          tableName: tableName,
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
                setValidatedTableName(true);
                tableNameFeedback = data.errors.tableName[0]
                }else{
                  setValidatedTableName(false);
                }
              }
          });
      };

    return (
        <>
            <div className={styles.adminContent}>
                <div className={styles.details}>
                    <div className={styles.form_group}>
                        <label htmlFor="tableName">Nazwa tabeli:</label><br />
                        <InputGroup className={styles.inputText} hasValidation>
                            <Form.Control
                            type="text"
                            id="tableName"
                            value={tableName}
                            isInvalid={validatedTableName}
                            onChange={(e) => setTableName(e.target.value)}
                            />
                            <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                                {tableNameFeedback}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </div>
                    <div className={styles.registrationButtons}>
                        <button onClick={handleCreateTable} className={styles.registrationButton}>Utwórz tabele</button>
                    </div>
                </div>
            </div>
        </>
    
    );
  };

export default AddTable;
import { useState } from 'react';
import styles from '../styles/AddUser.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, InputGroup } from 'react-bootstrap';

let usernameFeedback:string;
let passwordFeedback:string;

var user:any = []

const AddUser: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const [validatedUsername, setValidatedUsername] = useState(false);
    const [validatedPassword, setValidatedPassword] = useState(false);
    
    const [userTable, setUserTable] = useState(user)
    
    const handleRegistration = () => {
        setValidatedUsername(false);
        setValidatedPassword(false);
    
        const apiUrl = 'http://localhost:8080/registration';
    
        const requestBody = {
          username: username,
          password: password,
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
                const apiUrl = 'http://localhost:8080/userDetails';
        
                const requestBody = {         // ogarnac odswieżanie tu
                    details: true,
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
                setUserTable(data.details)
                console.log("tabelka "+userTable)
                })
                .catch((error) => {
                    console.log("Błąd"+error);
                });
              }else{
                if(data.errors.username != "") {
                setValidatedUsername(true);
                usernameFeedback = data.errors.username[0]
                }else{
                  setValidatedUsername(false);
                }
    
                if(data.errors.password != "") {
                  setValidatedPassword(true);
                  passwordFeedback = data.errors.password[0]
                }else{
                  setValidatedPassword(false);
                }
              }
          });
      };

    return (
        <>
            <div className={styles.adminContent}>
                <div className={styles.details}>
                    <div className={styles.form_group}>
                        <label htmlFor="username">Nazwa użytkownika</label><br />
                        <InputGroup className={styles.inputText} hasValidation>
                            <Form.Control
                            type="username"
                            id="username"
                            placeholder='username'
                            value={username}
                            isInvalid={validatedUsername}
                            onChange={(e) => setUsername(e.target.value)}
                            />
                            <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                                {usernameFeedback}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </div>
                    <div className={styles.form_group}>
                        <label htmlFor="password">Hasło</label><br />
                        <InputGroup className={styles.inputText} hasValidation>
                            <Form.Control
                            type="password"
                            id="password"
                            placeholder='********'
                            value={password}
                            isInvalid={validatedPassword}
                            onChange={(e) => setPassword(e.target.value)}
                            />
                            <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                                {passwordFeedback}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </div>
                    <div className={styles.registrationButtons}>
                        <button onClick={handleRegistration} className={styles.registrationButton}>Utwórz konto</button>
                    </div>
                </div>
            </div>
        </>
    
    );
  };

export default AddUser;
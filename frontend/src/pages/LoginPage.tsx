import styles from '../styles/LoginPage.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { InputGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import logo from '../assets/qr.png';
import { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import api from "../assets/api.json";

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [failFeedback, setFailFeedback] = useState("");
    const [validated, setValidated] = useState(false);

    useEffect( () => {
        const token = Cookies.get('user');
        if(token){
            const apiUrl = 'http://'+api+':8080/auth';
            
            const requestBody = {
              token: token,
            };
            console.log("token logowania: "+requestBody)
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
                if(data.admin){
                  document.location.href = '/admin';
                }else {
                  document.location.href = '/scan';
                }
              }else {
                Cookies.remove('user', { path: '/', domain: 'localhost' });
              }
            })
            .catch((error) => {
                console.log(error);
            });
        }
      }, []);

    const handleLogin = () => {
        const apiUrl = 'http://'+api+':8080/login';
    
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
            if (!response.ok) {
              throw new Error('Login failed');
            }
            return response.json();
          })
          .then((data) => {
            console.log(data.token);
            if(data.token) {
              Cookies.set('user', data.token, { expires: 7 });
              setValidated(false);
              if(data.admin){
                document.location.href = '/admin';
              }else {
                document.location.href = '/scan';
              }
            }else {
              console.log(data.fail);
              setValidated(true);
              setFailFeedback(data.fail)
            }
          }).catch((error) => {
            console.error(error);
          });
        };
    
    return (
        <>
            <div className={styles.loginContainer}>
                <span className={styles.headerContainer}>
                    <img src={logo} alt="QR" className={styles.logo} />
                    <span className={styles.title}>
                        <span>Inventory</span><br />
                        <span>Assistant</span><br />
                    </span>
                </span>
                <h1>Zaloguj się</h1>
                <div className={styles.loginStyle}>
                    <div className={styles.form_group}>
                        <label htmlFor="username">Nazwa użytkownika</label><br />
                        <InputGroup className={styles.inputText} hasValidation>
                            <Form.Control
                            type="username"
                            id="username"
                            placeholder='username'
                            value={username}
                            isInvalid={validated}
                            onChange={(e) => setUsername(e.target.value)}
                            />
                            <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
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
                            isInvalid={validated}
                            onChange={(e) => setPassword(e.target.value)}
                            />
                            <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                                {failFeedback}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </div>
                </div>
                  <button onClick={handleLogin} className={styles.logIn}>Zaloguj się</button>
            </div>
        </>
    
    );
  };

export default LoginPage;
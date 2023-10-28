import styles from './LoginPage.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { InputGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import logo from '../assets/qr.png';
import { useState } from 'react';

let failFeedback:string;

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // const [validated, setValidated] = useState(false);

    // useEffect( () => {
    //     const user = Cookies.get('user');
    //     if(user){
    //         const apiUrl = 'http://localhost:8080/auth';
            
    //         const requestBody = {
    //             user: user,
    //         };
    //         console.log(requestBody)
    //         fetch(apiUrl, {
    //             method: 'POST',
    //             headers: {
    //             'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(requestBody),
    //         })
    //         .then((response) => {
    //             if (!response.ok) {
    //                 throw new Error('Nie ma autoryzacji');
    //             }
    //             return response.json();
    //         })
    //         .then((data) => {
    //             if(data.success) {
    //               document.location.href = '/HomePage';
    //             }
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    //     }
    //   }, []);

    // const handleLogin = () => {
    //     const apiUrl = 'http://localhost:8080/login';
    
    //     const requestBody = {
    //       username: username,
    //       password: password,
    //     };
    //     console.log(requestBody)
    //     fetch(apiUrl, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify(requestBody),
    //     })
    //       .then((response) => {
    //         if (!response.ok) {
    //           throw new Error('Login failed');
    //         }
    //         return response.json();
    //       })
    //       .then((data) => {
    //         if(data.success) {
    //           Cookies.set('user', data.success, { expires: 7 });
    //           setValidated(false);
    //           document.location.href = '/HomePage';
    //         }else {
    //           setValidated(true);
    //           failFeedback = data.fail;
    //         }
    //       });
    //     };
    
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
                            // isInvalid={validated}
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
                            // isInvalid={validated}
                            onChange={(e) => setPassword(e.target.value)}
                            />
                            <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                                {failFeedback}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </div>
                </div>
                <button className={styles.logIn}>Zaloguj się</button>
            </div>
        </>
    
    );
  };

export default LoginPage;
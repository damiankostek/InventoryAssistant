import styles from '../styles/RegistrationPage.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { InputGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import logo from '../assets/qr.png';
import { useState } from 'react';
import { Link } from 'react-router-dom';

let emailFeedback:string;
let usernameFeedback:string;
let passwordFeedback:string;
let confirmPasswordFeedback:string;

const RegistrationPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validatedEmail] = useState(false);
    const [validatedUsername] = useState(false);
    const [validatedPassword] = useState(false);
    const [validatedConfirmPassword] = useState(false);

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
    
    return (
        <>
            <div className={styles.registrationContainer}>
                <span className={styles.headerContainer}>
                    <img src={logo} alt="QR" className={styles.logo} />
                    <span className={styles.title}>
                        <span>Inventory</span><br />
                        <span>Assistant</span><br />
                    </span>
                </span>
                <h1>Utwórz konto administratora</h1>
                <div className={styles.registrationStyle}>
                    <div className={styles.form_group}>
                        <label htmlFor="email">Adres e-mail</label><br />
                        <InputGroup className={styles.inputText} hasValidation>
                            <Form.Control
                            type="email"
                            id="email"
                            value={email}
                            isInvalid={validatedEmail}
                            onChange={(e) => setEmail(e.target.value)}
                            />
                            <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                                {emailFeedback}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </div>
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
                    <div className={styles.form_group}>
                        <label htmlFor="confirmPassword">Powtórz hasło</label><br />
                        <InputGroup className={styles.inputText} hasValidation>
                        <Form.Control
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            isInvalid={validatedConfirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                            {confirmPasswordFeedback}
                        </Form.Control.Feedback>
                        </InputGroup>
                  </div>
                </div>
                <button className={styles.registrationButton}>Utwórz konto</button>
                <div className={styles.loginButton}>
                    <div>Masz już konto? <Link to="/login">Zaloguj się</Link></div>
                </div>
            </div>
        </>
    );
  };

export default RegistrationPage;
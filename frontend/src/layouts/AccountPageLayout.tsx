import { useEffect, useState } from 'react';
import styles from '../styles/AccountPageLayout.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddUser from '../pages/AddUser';
import { Form, InputGroup } from 'react-bootstrap';
import Cookies from "js-cookie";
import api from "../assets/api.json";

var user:any = []

const AccountPageLayout: React.FC = () => {
    const [showAddUser, setShowAddUser] = useState(false);
    const [id, setId] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameChanged, setUsernameChanged] = useState(false);
    const [passwordChanged, setPasswordChanged] = useState(false);
    const [feedbackValues, setFeedbackValues] = useState({
        username: '',
        password: ''
    })
    const [validatedValues, setValidatedValues] = useState({
        username: false,
        password: false
    })
    const [userTable, setUserTable] = useState(user)

    const handleAddUserClick = () => {
        setShowAddUser(false);
    };


    useEffect( () => {
        const apiUrl = 'http://'+api+':8080/userDetails';
        
        fetch(apiUrl, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            }
        })
        .then((response) => {
          if (response.status == 500) {
              throw new Error('Błąd serwera');
          }
          return response.json();
        })
        .then((data) => {
          setUserTable(data.details)
          console.log(userTable)
        })
        .catch((error) => {
            console.log(error);
        });
  }, []);

    const handleChangeUserDetails = () => {
        const apiUrl = 'http://'+api+':8080/setUserDetails';

        const token = Cookies.get('user');
        const requestBody = {
            token: token,
            id: id,
            username: username,
            password: password
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
            throw new Error('Reset password failed: User not found');
          }
          return response.json();
        })
        .then((data) => {
          if(data.updated.username) 
          {
            console.log("Username updated");
            setUsernameChanged(true);
            const apiUrl = 'http://'+api+':8080/userDetails';
        
            const requestBody = {
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
            console.log(userTable)
            })
            .catch((error) => {
                console.log(error);
            });
          }
          if(data.updated.password) 
          {
            console.log("Hasło zostało pomyślnie zmienione");
            setPasswordChanged(true);
          }
          if(data.errors){
            console.log(data.errors)
            if(data.errors.username.length != 0) {
              setValidatedValues((prev) => ({
                  ...prev, 
                  username: true
              }));
              setFeedbackValues((prev) => ({
                  ...prev, 
                  username: data.errors.username[0]
              }));
            }else{
              setValidatedValues((prev) => ({
                ...prev, 
                username: false
              }));
            }
            if(data.errors.password.length != 0) {
                setValidatedValues((prev) => ({
                    ...prev, 
                    password: true
                }));
                setFeedbackValues((prev) => ({
                    ...prev, 
                    password: data.errors.password[0]
                }));
            }else{
                setValidatedValues((prev) => ({
                    ...prev, 
                    password: false
                }));
            }
          }
        });
      };

    return (
        <>
            <div className={styles.adminContent}>
                <div className={styles.menuAdmin}>
                    <div className={styles.menuButtons}>
                        <button className={styles.addUserButton} onClick={handleAddUserClick}>
                            Dodaj pracownika
                        </button>
                        <hr />
                        <h4>Lista kont</h4>
                        <select className={styles.userButton} id="user" onChange={(e) =>{
                                setId(e.target.value);
                                setShowAddUser(true);
                                
                                const apiUrl = 'http://'+api+':8080/getAccountById';
                                console.log("ID: "+id)
                                console.log(e.target.value);
                                const requestBody = {
                                    id: e.target.value
                                };
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
                                    console.log("data: "+data);
                                    if(data.fail){
                                        setShowAddUser(false);
                                        console.log("Błąd pobierania użytkownika");
                                    }else {
                                        setUsername(data.data.username);
                                    }
                                  }
                                  )
                            }}>
                            {userTable.map((user: any) => (
                            <option key={user._id} value={user._id}>{user.username}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className={styles.details}>
                    {!showAddUser ? <AddUser /> : 
                      <div className={styles.contents_container}>
                            <div className={styles.id_styles}>
                                {userTable.map((user: any) => (
                                    user.username == username ? <span key={user._id}>ID: {user._id}</span> : null
                                ))}
                            </div>
                            <hr />
                        <div className={styles.content_container}>
                            <div>
                                <div className={styles.contentForm}>
                                    <div className={styles.form_group}>
                                        <label htmlFor="username">Nazwa użytkownika:</label>
                                        <InputGroup className={styles.inputText} hasValidation>
                                        <Form.Control
                                            type="username"
                                            id="username"
                                            value={username}
                                            isInvalid={validatedValues.username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                        <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                                            {feedbackValues.username}
                                        </Form.Control.Feedback>
                                        </InputGroup>
                                    </div>
                                    {usernameChanged && <div className={styles.successMessage}>Nazwa użytkownika została zmieniona</div>}
                                    <div className={styles.form_group}>
                                        <label htmlFor="password">Hasło:</label>
                                        <InputGroup className={styles.inputText} hasValidation>
                                        <Form.Control
                                            type="password"
                                            id="password"
                                            value={password}
                                            isInvalid={validatedValues.password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                                            {feedbackValues.password}
                                        </Form.Control.Feedback>
                                        </InputGroup>
                                    </div>
                                    {passwordChanged && <div className={styles.successMessage}>Hasło zostało zmienione</div>}
                                </div>
                            </div>
                        </div>
                        <div className={styles.buttonEdits}>
                            {<button onClick={handleChangeUserDetails} className={styles.buttonEdit}>Zapisz</button>}
                        </div>
                      </div>
                    }
                </div>
            </div>
        </>
    
    );
  };

export default AccountPageLayout;
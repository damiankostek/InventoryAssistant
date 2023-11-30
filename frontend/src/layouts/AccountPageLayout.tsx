import { useEffect, useState } from 'react';
import styles from '../styles/AccountPageLayout.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddUser from '../pages/AddUser';
import { Form, InputGroup } from 'react-bootstrap';
import Cookies from "js-cookie";

var user:any = []
var table:any = []

const AccountPageLayout: React.FC = () => {
    const [showAddUser, setShowAddUser] = useState(false);
    const [id, setId] = useState('');
    const [idTable, setIdTable] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [tableName, setTableName] = useState('');
    const [usernameChanged, setUsernameChanged] = useState(false);
    const [passwordChanged, setPasswordChanged] = useState(false);
    const [tableChanged, setTableChanged] = useState(false);
    const [feedbackValues, setFeedbackValues] = useState({
        username: '',
        password: '',
        // tableName: ''  // czy to potrzebne
    })
    const [validatedValues, setValidatedValues] = useState({
        username: false,
        password: false,
        // tableName: false // czy to potrzebne
    })
    const [userTable, setUserTable] = useState(user)
    const [inventoryTable, setInventoryTable] = useState(table)

    const handleAddUserClick = () => {
        setShowAddUser(false);
    };


    useEffect( () => {
        const apiUrl = 'http://localhost:8080/userDetails';
        
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
        //   setTableName(data.details)
        })
        .catch((error) => {
            console.log(error);
        });
  }, []);

    const handleChangeUserDetails = () => {
        const apiUrl = 'http://localhost:8080/setUserDetails';

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
            const apiUrl = 'http://localhost:8080/userDetails';
        
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

    //   const handleSelectTables = (event: React.ChangeEvent<HTMLSelectElement>) => {
        // const tableId = parseInt(event.target.value, 10);
        // setSelectedTableID(tableId);
        // setTableChanged(true);

        // const apiUrl = 'http://localhost:8080/selectTable';

        // const requestBody = {
        // tableName: tableName
        // };
        // console.log(requestBody)
        // fetch(apiUrl, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(requestBody),
        // })
        // .then((response) => {
        //   if (!response.ok) {
        //     throw new Error('Table not found');
        //   }
        //   return response.json();
        // })
        // .then((data) => {
        //   if(data.selected.tableName) 
        //   {
        //     console.log("Table selected");
        //     setTableChanged(true);
        //   }
        // });
    //   };
    // console.log(id);
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
                                
                                const apiUrl = 'http://localhost:8080/getAccountById';
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
                                        setUsername(data.username);
                                        console.log("username: "+data.username)
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
                            <hr />
                            <div>
                                <div className={styles.tableContent}>
                                    <label htmlFor="inventoryTable">Wybierz tabele do inwentaryzacji:</label>
    {/* do przerobienia !!!!!!!!!!!! */}
                                    <select className={styles.tableButton} id="table" onChange={(e) =>{
                                        setIdTable(e.target.value);
                                        // setShowAddTable(true);

                                        const apiUrl = 'http://localhost:8080/getTableById';
                                        console.log("ID: "+idTable)
                                        console.log(e.target.value);
                                        const requestBody = {
                                            idTable: e.target.value
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
                                                // setShowAddTable(false);
                                                console.log("Błąd pobierania tabeli");
                                            }else {
                                                setTableName(data.tableName);                                
                                            }
                                        }
                                        )
                                    }}>
                                    {inventoryTable.map((table: any, index: any) => (
                                    <option key={index} value={table._id}>{table.tableName}</option>
                                    ))}
                                </select>
                                    {tableChanged && <div className={styles.successMessageTable}>Przypisano tabele</div>}

                                    {/* <div className={styles.buttonAdds}>
                                        {<button onClick={handleSelectTables} className={styles.buttonAdd}>Wybierz</button>}
                                    </div> */}
                                </div>
                            </div>
                        </div>
                        <div className={styles.buttonEdits}>
                            {<button onClick={handleChangeUserDetails} className={styles.buttonEdit}>Zapisz</button>}
                            {/* dodac opcje przypisania tabeli do pracownika */}
                        </div>
                      </div>
                    }
                </div>
            </div>
        </>
    
    );
  };

export default AccountPageLayout;
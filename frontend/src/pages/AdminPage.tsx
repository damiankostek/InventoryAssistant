import styles from '../styles/AdminPage.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../assets/qr.png';
import log_out from "../assets/log_out.png";
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AccountPageLayout from '../layouts/AccountPageLayout';
import TablePageLayout from '../layouts/TablePageLayout';
import Cookies from "js-cookie";

const AdminPage: React.FC = () => {
    const [activeButton, setActiveButton] = useState('Konta');
    const [layoutAdmin, setLayoutAdmin] = useState(true);

    const handleButtonClick = (buttonName: string) => {
        setActiveButton(buttonName);
    };

    useEffect( () => {
        const token = Cookies.get('user');
        if(token){
            const apiUrl = 'http://localhost:8080/auth';
            
            const requestBody = {
              token: token,
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
              if(data.fail) {
                  setLayoutAdmin(true);
                  document.location.href = '/scan';
                }else {
                  setLayoutAdmin(false);
                }
            })
            .catch((error) => {
                console.log(error);
            });
        }else{
          document.location.href = '/login';
        }
      }, []);

    const handleLogOff = () => {
        const token = Cookies.get('user');
        const apiUrl = 'http://localhost:8080/logout';
            
        const requestBody = {
            token: token
        };
        console.log(requestBody)
        console.log(token)
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
          console.log(data)
          if(data.success){
            Cookies.remove('user', { path: '/', domain: 'localhost' });
            document.location.href = '/welcome';
          }else{
            console.log("Wylogowywanie sie nie powiodlo")
          }
        })
        .catch((error) => {
            console.log(error);
        });
      };
    
    return (
        <>
          {layoutAdmin===true?null:
            <div className={styles.adminContainer}>
                <div className={styles.banner}>
                    <span className={styles.headerContainer}>
                        <img src={logo} alt="QR" className={styles.logo} />
                        <span className={styles.title}>
                            <span>Inventory</span><br />
                            <span>Assistant</span><br />
                        </span>
                    </span>
                    <div className={styles.userStyle}>
                        <h1>Panel administratora</h1>
                    </div>
                    <div>
                        <span className={styles.optionsButton}>
                            <Link to="/Login"><button onClick={handleLogOff} className={styles.logOutButton}><img src={log_out} alt="log_out" width={82} height={82}/></button></Link>
                        </span>
                    </div>
                </div>
                <div className={styles.layoutButtons}>
                    <button
                        className={activeButton === 'Konta' ? styles.layoutButton : styles.layoutButton}
                        onClick={() => handleButtonClick('Konta')}
                    >
                        Konta
                    </button>
                    <button
                        className={activeButton === 'Tabele' ? styles.layoutButton : styles.layoutButton}
                        onClick={() => handleButtonClick('Tabele')}
                    >
                        Tabele
                    </button>
                </div>
                <div className={styles.adminContent}>
                    {activeButton === 'Konta' ? (
                        <AccountPageLayout/>
                    ) : (
                        <TablePageLayout/>
                    )}
                </div>
            </div>
            }
        </>
    
    );
  };

export default AdminPage;
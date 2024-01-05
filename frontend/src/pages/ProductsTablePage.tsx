import { Table } from 'react-bootstrap';
import styles from '../styles/ProductsTablePage.module.css';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import api from "../assets/api.json";

var product:any = []

const ProductsTablePage: React.FC = () => {
    const [tableName, setTableName] = useState('');
    
    const [productsTable, setProductsTable] = useState(product)

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const idT = searchParams.get('idTable');

    const getTableDetails = () => {
      const apiUrl = 'http://'+api+':8080/getTableById';
      const requestBody = {
          id: idT
      };
      console.log("id tabelki: "+idT)
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
          if(data.fail){
              console.log("Błąd pobierania tabeli");
          }else {
              setTableName(data.tableName);
              setProductsTable(data.products);                                   
          }
        }
        )
  }
    
    useEffect( () => {
        const token = Cookies.get('user');
        if(token){
            const apiUrl = 'http://'+api+':8080/auth';
            
            const requestBody = {
              token: token,
            };
            console.log("token1: "+token)
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
                getTableDetails();
              }else {
                Cookies.remove('user', { path: '/', domain: 'localhost' });
              }
            })
            .catch((error) => {
                console.log(error);
            });
        }
      }, []);

      const handleLogOff = () => {
        const token = Cookies.get('user');
        const apiUrl = 'http://'+api+':8080/logout';
            
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
        <body className={styles.ProductsTable}>
          <div className={styles.contentTablePage}>
            <div className={styles.buttons}>
              <Link to="/scan"><button className={styles.buttonOptions}><i className="fa-solid fa-arrow-left" style={{ marginRight: '0.3em' }}></i>Powrót</button></Link>
              <Link to="/Login"><button onClick={handleLogOff} className={styles.buttonOptions}>Wyloguj <i className="fa-solid fa-arrow-right-from-bracket" style={{ marginLeft: '0.3em' }}></i></button></Link>
            </div>
              <hr />
              <div>
                  <h2 className={styles.h2Style}>Tabela: {tableName}</h2><br />
                  <div className="table-responsive">
                      <Table striped bordered>
                      <thead>
                          <tr>
                          <th scope="col" className={styles.qrStyle}>Kod QR</th>
                          <th scope="col">Nazwa</th>
                          <th scope="col" className={styles.quantityStyle}>Ilość</th>
                          <th scope="col" className={styles.inventoryStyle}>Ilość Inw.</th>
                          </tr>
                      </thead>
                      <tbody>
                          {productsTable.length === 0 ? null : (
                          <>
                              {productsTable.map((product: any, index: any) => (
                              <tr key={index}>
                                  <td>{product.qrCode}</td>
                                  <td>{product.name}</td>
                                  <td className={styles.quantityStyle}>{product.quantity}</td>
                                  <td className={styles.quantityStyle}>{product.neqQuantity}</td>
                              </tr>
                              ))}
                          </>
                          )}
                      </tbody>
                      </Table>
                  </div>
              </div>
          </div>
        </body>
        </>
    
    );
  };

export default ProductsTablePage;
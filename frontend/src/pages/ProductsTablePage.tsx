import { Table } from 'react-bootstrap';
import styles from '../styles/ProductsTablePage.module.css';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import api from "../assets/api.json";

var table:any = []

const ProductsTablePage: React.FC = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const qrCode = urlParams.get('qrCodeTable');
    const qrCodeTable = qrCode;
    const [listType, setListType] = useState('');
    const [tableName, setTableName] = useState('');

    const [productsTable, setProductsTable] = useState(table)
    const [positionsTable, setPositionsTable] = useState(table)
    
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTermIN, setSearchTermIN] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(table);
    const [filteredPositions, setFilteredPositions] = useState(table);

    const filtrWH = (value: string) => {
      const filtered = productsTable.filter((product: any) => {
        return (
          product.qrCode.toLowerCase().includes(value.toLowerCase()) ||
          product.name.toLowerCase().includes(value.toLowerCase())
        );
      });
    
      setFilteredProducts(filtered);
    };
    
    const handleSearchWH = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setSearchTerm(value);
    
      filtrWH(value);
    };
    
    const filtrIN = (value: string) => {
      const filtered = positionsTable.filter((product: any) => {
        return (
          product.qrCode.toLowerCase().includes(value.toLowerCase()) ||
          product.name.toLowerCase().includes(value.toLowerCase()) ||
          product.productOwner.toLowerCase().includes(value.toLowerCase())
        );
      });
    
      setFilteredPositions(filtered);
    };
    
    const handleSearchIN = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setSearchTermIN(value);
    
      filtrIN(value)
    };

    useEffect( () => {
      const token = Cookies.get('user');
      if(token){
          const apiUrl = 'http://'+api+':8080/auth';
          
          const requestBody = {
            token: token,
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
            if(data.success) {
              handleGetTableByQrCode();
            }else {
              Cookies.remove('user', { path: '/', domain: 'localhost' });
            }
          })
          .catch((error) => {
              console.log(error);
          });
      }
    }, []);
  
    const handleGetTableByQrCode = () => {
      const apiUrl = 'http://'+api+':8080/getTableByQrCode';
      const itemsApiUrl = 'http://'+api+':8080/getTableById';
  
      const requestBody = {
          qrCode: qrCodeTable
        };
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
          if(data) {
            setListType(data.type);
            setTableName(data.name);
            if(data._id != ""){
              const requestBodyItems = {
                id: data._id
              };
              fetch(itemsApiUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBodyItems),
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
                    setProductsTable(data.allProducts);  
                    setFilteredProducts(data.allProducts);
                    setPositionsTable(data.allPositions);  
                    setFilteredPositions(data.allPositions);
                }        
              }
              )
            }
          }else if(data.fail){
            console.log(data.fail);
          }
        }).catch((error) => {
          console.error(error);
        });
  }

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
        <div className={styles.ProductsTable}>
          <div className={styles.contentTablePage}>
            <div className={styles.buttons}>
            <Link to={{ pathname: '/scan', search: `?qrCode=${qrCode}` }}><button className={styles.buttonOptions}><i className="fa-solid fa-arrow-left" style={{ marginRight: '0.3em' }}></i>Powrót</button></Link>
              <Link to="/Login"><button onClick={handleLogOff} className={styles.buttonOptions}>Wyloguj <i className="fa-solid fa-arrow-right-from-bracket" style={{ marginLeft: '0.3em' }}></i></button></Link>
            </div>
              <hr />
              <div>
                  <div>
                    {listType == "wh" ? <h2 className={styles.h2Style}>Magazyn: {tableName}</h2> : listType == "in" ? <h2 className={styles.h2Style}>Instytucja: {tableName}</h2> : null}
                  </div> 
                  <div>
                    {listType == "wh" ? 
                    <>
                      <div className={styles.searchStyle}>
                      <input className={styles.inputTextSearch} type="text" placeholder='Wyszukaj' value={searchTerm} onChange={handleSearchWH} />
                      </div>
                      <div className="table-responsive">
                      <Table striped bordered>
                        <thead>
                          <tr>
                            <th scope="col" className={styles.qrStyle}>Kod QR</th>
                            <th scope="col">Nazwa</th>
                            <th scope="col" className={styles.quantityStyle}>Ilość</th>
                            <th scope="col" className={styles.quantityStyle}>Ilość Inw.</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.length === 0 ? null : (
                            <>
                              {filteredProducts.map((product: any, index: any) => (
                                <tr key={index}>
                                  <td>{product.qrCode}</td>
                                  <td>{product.name}</td>
                                  <td className={styles.quantityStyle}>{product.quantity}</td>
                                  <td className={styles.quantityStyle}>{product.newQuantity}</td>
                                </tr>
                              ))}
                            </>
                          )}
                        </tbody>
                      </Table>
                    </div>
                    </>
                      : listType == "in" ? 
                      <>
                      <div className={styles.searchStyle}>
                      <input className={styles.inputTextSearch} type="text" placeholder='Wyszukaj' value={searchTermIN} onChange={handleSearchIN} />
                      </div>
                      <div className="table-responsive">
                      <Table striped bordered>
                        <thead>
                          <tr>
                            <th scope="col" className={styles.qrStyle}>Kod QR</th>
                            <th scope="col">Nazwa</th>
                            <th scope="col" className={styles.quantityStyle}>Ilość</th>
                            <th scope="col" className={styles.quantityStyle}>Ilość Inw.</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredPositions.length === 0 ? null : (
                            <>
                              {filteredPositions.map((product: any, index: any) => (
                                <tr key={index}>
                                  <td>{product.qrCode}</td>
                                  <td>{product.name}</td>
                                  <td className={styles.quantityStyle}>{product.quantity}</td>
                                  <td className={styles.quantityStyle}>{product.newQuantity}</td>
                                </tr>
                              ))}
                            </>
                          )}
                        </tbody>
                      </Table>
                    </div>
                    </>
                      : null}
                  </div> 
              </div>
          </div>
        </div>
        </>
    
    );
  };

export default ProductsTablePage;
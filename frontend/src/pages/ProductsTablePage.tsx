import { Table } from 'react-bootstrap';
import styles from '../styles/ScanPage.module.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

var table:any = []
var product:any = []

const ProductsTablePage: React.FC = () => {
    const [idTable, setIdTable] = useState('');
    const [tableName, setTableName] = useState('');
    
    const [inventoryTable, setInventoryTable] = useState(table)
    const [productsTable, setProductsTable] = useState(product)
    
    const getTableDetails = () => {
        const apiUrl = 'http://localhost:8080/getTableById';
        const requestBody = {
            idTable: idTable
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
                console.log("Błąd pobierania tabeli");
            }else {
                setTableName(data.tableName);
                setProductsTable(data.products);                                   
            }
          }
          )
    }

    useEffect( () => {
        const apiUrl = 'http://localhost:8080/tableDetails'; 
        
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
          setInventoryTable(data.details)
          console.log("tabela :"+inventoryTable)
        })
        .catch((error) => {
            console.log(error);
        });
      }, []);

    return (
        <>
            <div>
                <Link to="/scan"><button className={styles.check}>Powrót</button></Link>
                <hr />
                <div>
                    <h2 className={styles.h2Style}>Tabela:</h2>
                        <p>
                        {inventoryTable.map((table: any) => (
                            table.tableName == tableName ? <span key={table._id}>{table.tableName}</span> : null
                        ))}
                        </p>
                    <div className="table-responsive">
                        <Table striped bordered>
                        <thead>
                            <tr>
                            <th scope="col" className={styles.qrStyle}>Kod QR</th>
                            <th scope="col">Nazwa</th>
                            <th scope="col" className={styles.quantityStyle}>Ilość</th>
                            <th scope="col" className={styles.inventoryStyle}>PoInw</th>
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
                                    <td className={styles.inventoryStyle}>{product.inventory}</td>
                                </tr>
                                ))}
                            </>
                            )}
                        </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </>
    
    );
  };

export default ProductsTablePage;
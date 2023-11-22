import { useEffect, useState } from 'react';
import styles from '../styles/TablePageLayout.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddTable from '../pages/AddTable';
import Products from '../pages/Products';
import { Form, InputGroup } from 'react-bootstrap';

var table:any = []
var product:any = []

const TablePageLayout: React.FC = () => {
    const [showAddTable, setShowAddTable] = useState(false);
    const [id, setId] = useState('');
    const [nameTable, setNameTable] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    
    const [nameTableChanged, setNameTableChanged] = useState(false);
    const [qrCodeChanged, setQrCodeChanged] = useState(false);
    const [nameChanged, setNameChanged] = useState(false);
    const [quantityChanged, setQuantityChanged] = useState(false);

    const [feedbackValues, setFeedbackValues] = useState({
        nameTable: '',
        qrCode: '',
        name: '',
        quantity: ''
    })
    const [validatedValues, setValidatedValues] = useState({
        nameTable: false,
        qrCode: false,
        name: false,
        quantity: false,
    })
    const [productsTable, setProductsTable] = useState(product)
    const [p_Table, setP_Table] = useState(product)

    const handleAddTableClick = () => {
        setShowAddTable(true);
    };

    useEffect( () => {
        const apiUrl = 'http://localhost:8080/tableDetails';  //brak backend
        
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
          setP_Table(data.details)
          setProductsTable(data.details)
          console.log(productsTable)
        })
        .catch((error) => {
            console.log(error);
        });
  }, []);

    
    return (
        <>
            <div className={styles.adminContent}>
            <div className={styles.menuAdmin}>
                    <div className={styles.menuButtons}>
                        <button className={styles.addTableButton} onClick={handleAddTableClick}>
                            Dodaj tabele
                        </button>
                        <hr />
                        <h4>Lista tabel</h4>
                        <select className={styles.tableButton} id="product" value={nameTable} onChange={(e) => setNameTable(e.target.value) }>
                            <option value={table.nameTable}>Podzepoły komputerowe</option>
                            <option value={table.nameTable}>Smarfony</option>
                            {p_Table.map((table: any) => (
                            <option key={table._id} value={table.nameTable}>{table.nameTable}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className={styles.details}>
                    {showAddTable ? <AddTable /> : 
                    <div className={styles.table_container}>
                        <div>
                            <div className={styles.id_styles}>
                                {p_Table.map((table: any) => (
                                    table.nameTable == nameTable ? <span key={table._id}>Tabela: {table.nameTable}</span> : <span>Tabela: </span>
                                ))}
                                TABLE NAME:
                            </div>
                        </div>
                        <div className={styles.tableContent}>
                            <hr />
                            <Products /> 
                            <hr />
                            LISTA PRODUKTÓW                         
                        </div>
                    </div>
                    }
                </div>
            </div>
        </>
    
    );
  };

export default TablePageLayout;
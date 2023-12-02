import { useEffect, useState } from 'react';
import styles from '../styles/TablePageLayout.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddTable from '../pages/AddTable';
import { Form, InputGroup, Table } from 'react-bootstrap';
import Cookies from "js-cookie";
import QRCode from 'qrcode.react';
import Popup from 'reactjs-popup';

var table:any = []
var product:any = []

const generateRandomQRCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < 15; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};


const TablePageLayout: React.FC = () => {
    const [showAddTable, setShowAddTable] = useState(false);
    const [id, setId] = useState('');
    const [tableName, setTableName] = useState('');
    const [qrCode, setQrCode] = useState<string>(generateRandomQRCode());
    const [qrCodeImage, setQRCodeImage] = useState<JSX.Element | null>(null);
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [inventory] = useState(' ');  //musi byc bo nie łapie kolumny
    
    // const [tableNameChanged, setTableNameChanged] = useState(false);
    // const [qrCodeChanged, setQrCodeChanged] = useState(false);
    // const [nameChanged, setNameChanged] = useState(false);
    // const [quantityChanged, setQuantityChanged] = useState(false);

    const [feedbackValues, setFeedbackValues] = useState({
        tableName: '',
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
    const [inventoryTable, setInventoryTable] = useState(table)
    const [productsTable, setProductsTable] = useState(product)

    const handleAddTableClick = () => {
        setShowAddTable(false);
    };

    useEffect( () => {
        const apiUrl = 'http://localhost:8080/tableDetails';   //prowizorka
        
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
          // setQrCode()
          // setProductsTable(data.details)
          console.log("tabela :"+inventoryTable)
        //   console.log("tabela produktów:"+productsTable)
        })
        .catch((error) => {
            console.log(error);
        });
        if (qrCode) {
          setQRCodeImage(<QRCode value={qrCode} size={55} />);
        }
      }, [qrCode]);

  const handleGenerateRandomQRCode = () => {
    const newQRCode = generateRandomQRCode();
    setQrCode(newQRCode);
  };

  const handleAddProduct = () => {
    const isQRCodeExist = productsTable.some((product: any) => product.qrCode === qrCode);

    if (isQRCodeExist) {
      console.log("Kod QR już istnieje w bazie danych. Wygeneruj nowy kod QR.");
      return;
    }

    const apiUrl = 'http://localhost:8080/addProduct';    // nie sprawdza czy juz istnieje
    const token = Cookies.get('user');

    const requestBody = {
      token: token,
      id: id,
      tableName: tableName,
      qrCode: qrCode,
      name: name,
      quantity: quantity
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
          console.log(data.errors);
          if(data.success){
            console.log(data.success);
          }else{
            if(data.errors.qrCode.length != 0) {
                setValidatedValues((prev) => ({
                    ...prev, 
                    qrCode: true
                }));
                setFeedbackValues((prev) => ({
                    ...prev, 
                    qrCode: data.errors.qrCode[0]
                }));
              }else{
                setValidatedValues((prev) => ({
                  ...prev, 
                  qrCode: false
                }));
              }

              if(data.errors.name.length != 0) {
                setValidatedValues((prev) => ({
                    ...prev, 
                    name: true
                }));
                setFeedbackValues((prev) => ({
                    ...prev, 
                    name: data.errors.name[0]
                }));
              }else{
                setValidatedValues((prev) => ({
                  ...prev, 
                  name: false
                }));
              }

              if(data.errors.quantity != "") {
                setValidatedValues((prev) => ({
                    ...prev, 
                    quantity: true
                }));
                setFeedbackValues((prev) => ({
                    ...prev, 
                    quantity: data.errors.quantity[0]
                }));
              }else{
                setValidatedValues((prev) => ({
                  ...prev, 
                  quantity: false
                }));
              }
          }
      });
  };

  const handleDownload = (idProduct: any) => {
    
  };

  const handleDelete = (idProduct:any) => {
    const apiUrl = 'http://localhost:8080/productDelete';
    
    const token = Cookies.get('user');

    const requestBody = {
      token: token,
      id: id,
      idProduct: idProduct
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
          console.log(data.errors);
          if(data.success){
            console.log(data.success);
            product = data.success;  // ...
            setProductsTable(product);
          }else {
          console.log("Nie działa usuwanie");
        }
      });
  };

    
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
                        <select className={styles.tableButton} id="table" onChange={(e) =>{
                                setId(e.target.value);
                                setShowAddTable(true);

                                const apiUrl = 'http://localhost:8080/getTableById';
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
                                        setShowAddTable(false);
                                        console.log("Błąd pobierania tabeli");
                                    }else {
                                        setTableName(data.tableName);
                                        setProductsTable(data.products);                                   
                                    }
                                  }
                                  )
                            }}>
                            {inventoryTable.map((table: any, index: any) => (
                            <option key={index} value={table._id}>{table.tableName}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className={styles.details}>
                    {!showAddTable ? <AddTable /> : 
                    <div className={styles.table_container}>
                        <div>
                            <div className={styles.id_styles}>
                                {inventoryTable.map((table: any) => (
                                    table.tableName == tableName ? <span key={table._id}>Tabela: {table.tableName}</span> : null
                                ))}
                            </div>
                        </div>
                        <div className={styles.tableContent}>
                            <hr />
                            <div className={styles.addProducts}>
                  <h3>Dodaj pozycje</h3>
                  <div className={styles.addProduct}>
                    <div>
                    <div className={styles.form_group}>
                        <label htmlFor="qrCode">Kod QR:</label><br />
                        <InputGroup className={styles.inputText} hasValidation>
                          <Form.Control
                            type="text"
                            id="qrCode"
                            value={qrCode}
                            isInvalid={validatedValues.qrCode}
                            onChange={(e) => setQrCode(e.target.value)}
                          />
                          <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                            {feedbackValues.qrCode}
                          </Form.Control.Feedback>
                          <div className={styles.qrCodePreview}>
                            {qrCodeImage}
                          </div>
                          <div>
                            <button onClick={handleGenerateRandomQRCode} className={styles.drawButton}>
                              <i className="fa-solid fa-rotate fa-xl"></i>
                            </button>
                          </div>
                        </InputGroup>
                      </div>
                      
                    </div>
                    <div>
                      <div className={styles.form_group}>
                          <label htmlFor="name">Nazwa:</label><br />
                          <InputGroup className={styles.inputText} hasValidation>
                              <Form.Control
                              type="text"
                              id="name"
                              value={name}
                              isInvalid={validatedValues.name}
                              onChange={(e) => setName(e.target.value)}
                              />
                              <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                                  {feedbackValues.name}
                              </Form.Control.Feedback>
                          </InputGroup>
                      </div>
                    </div>
                    <div>
                      <div className={styles.form_group}>
                          <label htmlFor="quantity">Ilość:</label><br />
                          <InputGroup className={styles.inputText} hasValidation>
                              <Form.Control
                              type="number"
                              id="quantity"
                              value={quantity}
                              isInvalid={validatedValues.quantity}
                              onChange={(e) => setQuantity(e.target.value)}
                              />
                              <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                                  {feedbackValues.quantity}
                              </Form.Control.Feedback>
                          </InputGroup>
                      </div>
                    </div>
                      <div className={styles.AddProductButtons}>
                          <button onClick={handleAddProduct} className={styles.AddProductButton}>Dodaj pozycje</button>
                      </div>
                  </div>
                </div>
                            <hr />
                            <h4>LISTA PRODUKTÓW </h4>   
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
                                          <td className={styles.sdButton} id={styles.colorBlue}>
                                            <Popup className="mypopup" trigger={<button className={styles.qrButton}><i className="fa-solid fa-qrcode fa-lg"></i></button>} position="left center">
                                              <div className={styles.popupdiv}>
                                                <div className={styles.popupDiv}>
                                                <QRCode value={product.qrCode} size={120} />
                                                  <div className={styles.downloadButton}>
                                                    <button onClick={(_) => handleDownload(product._id)} id={styles.colorBlue} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                                                      <i className="fa-solid fa-download fa-lg"></i>
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            </Popup>
                                          </td>
                                          <td className={styles.sdButton} id={styles.colorRed}><button className={styles.deleteButton} onClick={(_) => handleDelete(product._id)}><i className="fa-solid fa-trash fa-lg"></i></button></td>
                                        </tr>
                                      ))}
                                    </>
                                  )}
                                </tbody>
                              </Table>
                            </div>
                        </div>
                    </div>
                    }
                </div>
            </div>
        </>
    
    );
  };

export default TablePageLayout;
import { useEffect, useState } from 'react';
import styles from '../styles/TablePageLayout.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddWarehouse from '../pages/AddWarehouse';
import AddInstitution from '../pages/AddInstitution';
import { Form, InputGroup, Table } from 'react-bootstrap';
import Cookies from "js-cookie";
import QRCode from 'qrcode.react';
import Popup from 'reactjs-popup';
import api from "../assets/api.json";

interface Product {
  name: string;
  quantity: number;
}

interface Room {
  name: string;
  products: Product[];
}

interface Section {
  name: string;
  rooms: Room[];
}

interface Hall {
  sections: Section[];
}


var table:any = []
var user:any = []

let hallNameFeedback:string;
let sectionNameFeedback:string;
let rackNameFeedback:string;
let shelfNameFeedback:string;
let roomNameFeedback:string;

const generateRandomQRCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const TablePageLayout: React.FC = () => {
    const [showAddWarehouse, setShowAddWarehouse] = useState(false);
    const [showAddInstitution, setShowAddInstitution] = useState(false);
    const [wh, setWh] = useState('');
    const [id, setId] = useState('');
    const [tableName, setTableName] = useState('');
    const [hallName, setHallName] = useState('');
    const [sectionName, setSectionName] = useState('');
    const [rackName, setRackName] = useState('');
    const [shelfName, setShelfName] = useState('');
    const [roomName, setRoomName] = useState('');
    const [roomOwners, setRoomOwners] = useState<string[]>([]);
    const [productOwner, setProductOwner] = useState<string>('');
    const [qrCode, setQrCode] = useState('');
    const [qrCodeImage, setQRCodeImage] = useState<JSX.Element | null>(null);
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [searchTermIN, setSearchTermIN] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filteredPositions, setFilteredPositions] = useState([]);

    const [validatedHallName, setValidatedHallName] = useState(false);
    const [validatedSectionName, setValidatedSectionName] = useState(false);
    const [validatedRackName, setValidatedRackName] = useState(false);
    const [validatedShelfName, setValidatedShelfName] = useState(false);
    const [validatedRoomName, setValidatedRoomName] = useState(false);

    const [feedbackValues, setFeedbackValues] = useState({
        ownerProduct: '',
        qrCode: '',
        name: '',
        quantity: ''
    })
    const [validatedValues, setValidatedValues] = useState({
        ownerProduct: false,
        qrCode: false,
        name: false,
        quantity: false,
    })
    const [userTable, setUserTable] = useState(user)
    const [inventoryTable, setInventoryTable] = useState(table)
    const [col1, setCol1] = useState(table)
    const [col2, setCol2] = useState(table)
    const [col3, setCol3] = useState(table)
    const [col4, setCol4] = useState(table)
    const [showCol1, setShowCol1] = useState(false);
    const [showCol2, setShowCol2] = useState(false);
    const [showCol3, setShowCol3] = useState(false);
    const [showCol4, setShowCol4] = useState(false);
    const [newRoom, setNewRoom] = useState(false);
    const [productsTable, setProductsTable] = useState(table)
    const [positionsTable, setPositionsTable] = useState(table)

    const handleAddWarehouseClick = () => {
        setShowAddInstitution(true);
        setShowAddWarehouse(false);
    };

    const handleAddInstitutionClick = () => {
      setShowAddWarehouse(true);
      setShowAddInstitution(false);
  };

  const onForm = () => {
    setNewRoom(true);
}

const handleSearchWH = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { value } = event.target;
  setSearchTerm(value);

  const filtered = productsTable.filter((product: any) => {
    return (
      product.qrCode.toLowerCase().includes(value.toLowerCase()) ||
      product.productName.toLowerCase().includes(value.toLowerCase())
    );
  });

  setFilteredProducts(filtered);
};

const handleSearchIN = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { value } = event.target;
  setSearchTermIN(value);

  // const filtered = positionsTable.filter((product: any) => {
  //   return (
  //     product.qrCode.toLowerCase().includes(value.toLowerCase()) ||
  //     product.productName.toLowerCase().includes(value.toLowerCase()) ||
  //     product.productOwner.toLowerCase().includes(value.toLowerCase())
  //   );
  // });

  // setFilteredPositions(filtered);
};

    useEffect( () => {
      const userApiUrl = 'http://'+api+':8080/userDetails';
      const apiUrl = 'http://'+api+':8080/tableDetails';

      fetch(userApiUrl, {
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
        console.log(inventoryTable)
        
        // nie dziala jednak 
        if (data.halls && Array.isArray(data.halls)) {
          const allPositions: Product[] = data.halls.reduce((acc: Product[], hall: Hall) => {
            hall.sections.forEach((section: Section) => {
              section.rooms.forEach((room: Room) => {
                acc = [...acc, ...room.products];
              });
            });
            return acc;
          }, []);
        
          setPositionsTable(allPositions);
        
        console.log("test")
        }
      })
      .catch((error) => {
          console.log(error);
      });
        if (qrCode) {
          setQRCodeImage(<QRCode value={qrCode} size={55} />);
        }
      }, [qrCode]);


  const handleAddProduct = () => {
    const apiUrl = 'http://'+api+':8080/addProduct';

    const requestBody = {
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

  const handleAddProducts = () => {  // zrobic backend
    const apiUrl = 'http://'+api+':8080/addProducts';

    const requestBody = {
      qrCode: qrCode,
      name: name,
      productOwner: productOwner,
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

  // const handleDownload = (idProduct: any) => {
    
  // };

  const handleDelete = (idProduct:any) => {
    const apiUrl = 'http://'+api+':8080/productDelete';
    
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
            // product = data.success;  // ...
            // setProductsTable(product);
          }else {
          console.log("Nie działa usuwanie");
        }
      });
  };

  const handleGetTable = (idT:any) => {
    setId(idT);
    setShowAddWarehouse(true);
    setShowAddInstitution(true);
    console.log("id: "+idT)

    const apiUrl = 'http://'+api+':8080/getTableById';
    console.log("ID: "+id)
    console.log(idT);
    const requestBody = {
        id: idT
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
        if(data.fail){
            console.log("Błąd pobierania tabeli");
        }else {
            setWh(data.data.type)
            setTableName(data.data.name);
            setQrCode(data.data.name);
            setCol1(data.data.halls);
            setCol2("");
            setCol3("");
            setCol4("");
            setShowCol1(true);
            setShowCol2(false);
            setShowCol3(false);
            setShowCol4(false);
            setProductsTable(data.allProducts);  
            setPositionsTable(data.allPositions);  
            console.log(data.allProducts);   
            console.log(data.allPositions);   
        }        
      }
      )
  }

  const handleGetSections = (idH:any, name: string) => {
    setCol2(col1[idH].sections);
    setShowCol2(true);
    setShowCol3(false);
    setShowCol4(false);
    const QS = qrCode?.split("-")
    setQrCode(QS[0]+"-"+name);
  }

  const handleGetRacks = (idS:any, name: string) => {
    setCol3(col2[idS].racks)
    setShowCol3(true);
    setShowCol4(false);
    const QS = qrCode?.split("-")
    setQrCode(QS[0]+"-"+QS[1]+"-"+name);
  }

  const handleGetRooms = (idS:any, name: string) => {
    setCol3(col2[idS].rooms)
    setShowCol3(true);
    setShowCol4(false);
    const QS = qrCode?.split("-")
    setQrCode(QS[0]+"-"+QS[1]+"-"+name);
  }

  const handleGetShelfs = (idR:any, name: string) => {
    setCol4(col3[idR].shelfs)
    setShowCol4(true);
    const QS = qrCode?.split("-")
    setQrCode(QS[0]+"-"+QS[1]+"-"+QS[2]+"-"+name);
  }

  const handleGetOwnerRoom = (idR:any, name: string) => {
    setShowCol4(true);
    const QS = qrCode?.split("-")
    setQrCode(QS[0]+"-"+QS[1]+"-"+QS[2]+"-"+name+"-"+generateRandomQRCode());
    var tmp: any = [];
    for (let i = 0; i < userTable.length; i++) {
      for (let j = 0; j < col3[idR].roomOwners.length; j++) {
        if(userTable[i]._id == col3[idR].roomOwners[j].id)
          tmp = [...tmp, userTable[i]]
      }
    }
    setCol4(tmp);
  }

  const handleSetShelf = (name: string) => {
    const QS = qrCode?.split("-")
    setQrCode(QS[0]+"-"+QS[1]+"-"+QS[2]+"-"+QS[3]+"-"+name);
  }

  const handleAddHall = () => {
    // setCol1([...col1, {name: hallName, sections: []}]);
    
    const apiUrl = 'http://'+api+':8080/addHall'; 

    const requestBody = {
      hallName: hallName,
      listName: qrCode?.split("-")[0]
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
            setQrCode(qrCode+"-"+hallName);
            setCol1([...col1, {name: hallName, sections: []}]);
            setHallName('');
          }else{
            if(data.errors.hallName != "") {
                  setValidatedHallName(true);
                  hallNameFeedback = data.errors.hallName[0];
                  setTimeout(() => {
                    setValidatedHallName(false);
                    hallNameFeedback = data.errors.hallName[0];
                    setHallName('');
                  }, 3000);
            }else{
              setValidatedHallName(false);
            }
          }
      });
  }

  const handleAddSection = () => {
    // setCol2([...col2, {name: sectionName, racks: []}]);
    
    const apiUrl = 'http://'+api+':8080/addSection'; 

    const requestBody = {
      sectionName: sectionName,
      listName: qrCode?.split("-")[0],
      hallName: qrCode?.split("-")[1]
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
            setQrCode(qrCode+"-"+sectionName);
            setCol2([...col2, {name: sectionName, racks: []}]);
            setSectionName('');
          }else{
            if(data.errors.sectionName != "") {
              setValidatedSectionName(true);
              sectionNameFeedback = data.errors.sectionName[0]
              setTimeout(() => {
                setValidatedSectionName(false);
                sectionNameFeedback = data.errors.sectionName[0];
                setSectionName('');
              }, 3000);
            }else{
              setValidatedSectionName(false);
            }
          }
      });
  }

  const handleAddRack = () => {
    // setCol3([...col3, {name: rackName, shelfs: []}]);
    
    const apiUrl = 'http://'+api+':8080/addRack'; 

    const requestBody = {
      rackName: rackName,
      listName: qrCode?.split("-")[0],
      hallName: qrCode?.split("-")[1],
      sectionName: qrCode?.split("-")[2]
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
            setQrCode(qrCode+"-"+rackName);
            setCol3([...col3, {name: rackName, shelfs: []}]);
            setRackName('');
          }else{
            if(data.errors.rackName != "") {
              setValidatedRackName(true);
              rackNameFeedback = data.errors.rackName[0];
              setTimeout(() => {
                setValidatedRackName(false);
                rackNameFeedback = data.errors.rackName[0];
                setRackName('');
              }, 3000);
            }else{
              setValidatedRackName(false);
            }
          }
      });
  }

  const handleAddRoom= () => {
    // setCol3([...col3, {name: roomName, roomOwners: []}]);
    
    const apiUrl = 'http://'+api+':8080/addRoom';

    const requestBody = {
      roomName: roomName,
      roomOwners: roomOwners,
      listName: qrCode?.split("-")[0],
      hallName: qrCode?.split("-")[1],
      sectionName: qrCode?.split("-")[2]
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
          if(data.success){
            console.log(data.success);
            setQrCode(qrCode+"-"+roomName+"-"+generateRandomQRCode());
            setCol3([...col3, {name: roomName, roomOwners: []}]);
            setRoomName('');
            setNewRoom(false);
          }else{
            if(data.errors.roomName != "") {
              setValidatedRoomName(true);
              roomNameFeedback = data.errors.roomName[0];
              setTimeout(() => {
                setValidatedRoomName(false);
                roomNameFeedback = data.errors.roomName[0];
                setRoomName('');
              }, 3000);
            }else{
              setValidatedRoomName(false);
            }
          }
      });
  }

  const handleAddShelf = () => {
    // setCol4([...col4, {name: shelfName, product: {}}]);
    
    const apiUrl = 'http://'+api+':8080/addShelf'; 

    const requestBody = {
      shelfName: shelfName,
      listName: qrCode?.split("-")[0],
      hallName: qrCode?.split("-")[1],
      sectionName: qrCode?.split("-")[2],
      rackName: qrCode?.split("-")[3]
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
            setQrCode(qrCode+"-"+shelfName);
            setCol4([...col4, {name: shelfName, product: {}}]);
            setShelfName('');
          }else{
            if(data.errors.shelfName != "") {
              setValidatedShelfName(true);
              shelfNameFeedback = data.errors.shelfName[0];
              setTimeout(() => {
                setValidatedShelfName(false);
                shelfNameFeedback = data.errors.shelfName[0];
                setShelfName('');
              }, 3000);
            }else{
              setValidatedShelfName(false);
            }
          }
      });
  }

    return (
        <>
            <div className={styles.adminContent}>
            <div className={styles.menuAdmin}>
                    <div className={styles.menuButtons}>
                        <button className={styles.addWarehouseButton} onClick={handleAddWarehouseClick}>
                            Dodaj magazyn
                        </button>
                        <button className={styles.addInstitutionButton} onClick={handleAddInstitutionClick}>
                            Dodaj instytucje
                        </button>
                        <hr />
                        <h4>Lista tabel</h4>
                        <div className={styles.listTable}>
                          {inventoryTable.map((table: any, index: any) => (
                          <div className={styles.listOption} key={index} id={table._id} onClick={() => handleGetTable(table._id)}> 
                            {table.name}                           
                          </div>
                          ))}
                        </div>
                    </div>
                </div>
                <div className={styles.details}>
                    {!showAddWarehouse ? <AddWarehouse /> : !showAddInstitution ? <AddInstitution /> : 
                    wh == "wh" ?
                        // MAGAZYN
                    <div className={styles.table_container}>
                      <div className={styles.tablesStyle}>
                          <div>
                                <div className={styles.tableStyle}>
                                  <>
                                    <h2>Hala</h2>
                                      {col1.map((hall: any, index: any) => (
                                        <div className={styles.form_group}>
                                          <div className={styles.listOption} key={index} id={hall._id} onClick={() => handleGetSections(index, hall.name)}> 
                                            {hall.name}           
                                          </div>
                                          <div className={styles.addOption}><i className="fa-solid fa-trash fa-lg"></i></div>
                                        </div>
                                      ))}
                                      {showCol1 ? 
                                      <div className={styles.form_group}>
                                        <InputGroup className={styles.inputTextTable} hasValidation>
                                            <Form.Control
                                            type="text"
                                            id="hallName"
                                            value={hallName}
                                            isInvalid={validatedHallName}
                                            onChange={(e) => setHallName(e.target.value)}
                                            />
                                            <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                                                {hallNameFeedback}
                                            </Form.Control.Feedback>
                                        </InputGroup>
                                        <div className={styles.addOption} onClick={() => handleAddHall()}><i className="fa-solid fa-plus"></i></div>
                                    </div>
                                    : null}
                                  </>
                                </div>
                                <div className={styles.tableStyle}>
                                  <>
                                    <h2>Alejka</h2>
                                      {col2=="" ? null : col2.map((section: any, index: any) => (
                                        <div className={styles.form_group}>
                                          <div className={styles.listOption} key={index} id={section._id} onClick={() => handleGetRacks(index, section.name)}> 
                                          {section.name}           
                                        </div>
                                          <div className={styles.addOption}><i className="fa-solid fa-trash fa-lg"></i></div>
                                        </div>
                                      ))}
                                      {showCol2 ? 
                                      <div className={styles.form_group}>
                                        <InputGroup className={styles.inputTextTable} hasValidation>
                                        <Form.Control
                                          type="text"
                                          id="sectionName"
                                          value={sectionName}
                                          isInvalid={validatedSectionName}
                                          onChange={(e) => setSectionName(e.target.value)}
                                          />
                                          <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                                              {sectionNameFeedback}
                                          </Form.Control.Feedback>
                                        </InputGroup>
                                        <div className={styles.addOption} onClick={() => handleAddSection()}><i className="fa-solid fa-plus"></i></div>
                                    </div>
                                    : null}
                                  </>
                                </div>
                                <div className={styles.tableStyle}>
                                  <>
                                    <h2>Regał</h2>
                                      {col3=="" ? null : col3.map((rack: any, index: any) => (
                                        <div className={styles.form_group}>
                                          <div className={styles.listOption} key={index} id={rack._id} onClick={() => handleGetShelfs(index, rack.name)}> 
                                          {rack.name}           
                                        </div>
                                          <div className={styles.addOption}><i className="fa-solid fa-trash fa-lg"></i></div>
                                        </div>
                                      ))}
                                      {showCol3 ?
                                      <div className={styles.form_group}>
                                        <InputGroup className={styles.inputTextTable} hasValidation>
                                        <Form.Control
                                          type="text"
                                          id="rackName"
                                          value={rackName}
                                          isInvalid={validatedRackName}
                                          onChange={(e) => setRackName(e.target.value)}
                                          />
                                          <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                                              {rackNameFeedback}
                                          </Form.Control.Feedback>
                                        </InputGroup>
                                        <div className={styles.addOption} onClick={() => handleAddRack()}><i className="fa-solid fa-plus"></i></div>
                                    </div>
                                    : null}
                                  </>
                                </div>
                                <div className={styles.tableStyle}>
                                  <>
                                    <h2>Półka</h2>
                                      {col4=="" ? null : col4.map((shelf: any, index: any) => (
                                        <div className={styles.form_group}>
                                          <div className={styles.listOption} key={index} id={shelf._id} onClick={() => handleSetShelf(shelf.name)}> 
                                          {shelf.name}           
                                        </div>
                                          <div className={styles.addOption}><i className="fa-solid fa-trash fa-lg"></i></div>
                                        </div>
                                      ))}
                                      {showCol4 ?
                                      <div className={styles.form_group}>
                                        <InputGroup className={styles.inputTextTable} hasValidation>
                                        <Form.Control
                                          type="text"
                                          id="shelfName"
                                          value={shelfName}
                                          isInvalid={validatedShelfName}
                                          onChange={(e) => setShelfName(e.target.value)}
                                          />
                                          <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                                              {shelfNameFeedback}
                                          </Form.Control.Feedback>
                                        </InputGroup>
                                        <div className={styles.addOption} onClick={() => handleAddShelf()}><i className="fa-solid fa-plus"></i></div>
                                    </div>
                                    : null}
                                  </>
                                </div>
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
                                        disabled
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
                            <span className={styles.headerTable}>
                              <span>
                                <span className={styles.tableNameStyle}>MAGAZYN: {tableName}</span> 
                                <span className={styles.sdButton} id={styles.colorRed}><button className={styles.deleteButton} ><i className="fa-solid fa-trash fa-lg"></i></button></span>   
                              </span>
                              <span className={styles.searchStyle}>
                                <input className={styles.inputTextSearch} type="text" placeholder='Wyszukaj' value={searchTerm} onChange={handleSearchWH} />
                              </span>
                            </span>
                            <div className="table-responsive">
                              <Table striped bordered>
                                <thead>
                                  <tr>
                                    <th scope="col" className={styles.qrStyle}>
                                      Kod QR
                                    </th>
                                    <th scope="col">Nazwa</th>
                                    <th scope="col" className={styles.quantityStyle}>
                                      Ilość
                                    </th>
                                    <th scope="col" className={styles.quantityStyle}>
                                      Ilość Inw.
                                    </th>
                                    <th scope="col">Os. odp.</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {filteredProducts.length === 0 ? null : (
                                    <>
                                      {filteredProducts.map((product: any, index: any) => (
                                        <tr key={index}>
                                          <td>{product.qrCode}</td>
                                          <td>{product.productName}</td>
                                          <td className={styles.quantityStyle}>{product.quantity}</td>
                                          <td className={styles.quantityStyle}>{product.newQuantity}</td>
                                          <td></td>
                                          <td className={styles.sdButton} id={styles.colorBlue}>
                                            <Popup className="mypopup" trigger={<button className={styles.qrButton}><i className="fa-solid fa-qrcode fa-lg"></i></button>} position="left center">
                                              <div className={styles.popupdiv}>
                                                <div className={styles.popupDiv}>
                                                <QRCode value={product.qrCode} size={120} />
                                                  <div className={styles.downloadButton}>
                                                    <button  id={styles.colorBlue} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
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
                    </div> :
                        // INSTYTUCJA
                    <div className={styles.table_container}>
                      <div className={styles.tablesStyle}>
                            <div>
                              <>
                                  <div className={styles.tableStyle}>
                                    
                                      <h2>Budynek</h2>
                                        {col1.map((hall: any, index: any) => (
                                          <div className={styles.form_group}>
                                            <div className={styles.listOption} key={index} id={hall._id} onClick={() => handleGetSections(index, hall.name)}> 
                                              {hall.name}        
                                            </div>
                                            <div className={styles.addOption}><i className="fa-solid fa-trash fa-lg"></i></div>
                                          </div>
                                        ))}
                                        {showCol1 ? 
                                        <div className={styles.form_group}>
                                          <InputGroup className={styles.inputTextTable} hasValidation>
                                              <Form.Control
                                              type="text"
                                              id="hallName"
                                              value={hallName}
                                              isInvalid={validatedHallName}
                                              onChange={(e) => setHallName(e.target.value)}
                                              />
                                              <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                                                  {hallNameFeedback}
                                              </Form.Control.Feedback>
                                          </InputGroup>
                                          <div className={styles.addOption} onClick={() => handleAddHall()}><i className="fa-solid fa-plus"></i></div>
                                      </div>
                                      : null}
                                  </div>
                                </>
                                <div className={styles.tableStyle}>
                                  <>
                                    <h2>Piętro</h2>
                                      {col2=="" ? null : col2.map((section: any, index: any) => (
                                        <div className={styles.form_group}>
                                          <div className={styles.listOption} key={index} id={section._id} onClick={() => handleGetRooms(index, section.name)}> 
                                          {section.name}           
                                        </div>
                                          <div className={styles.addOption}><i className="fa-solid fa-trash fa-lg"></i></div>
                                        </div>
                                      ))}
                                      {showCol2 ? 
                                      <div className={styles.form_group}>
                                        <InputGroup className={styles.inputTextTable} hasValidation>
                                        <Form.Control
                                          type="text"
                                          id="sectionName"
                                          value={sectionName}
                                          isInvalid={validatedSectionName}
                                          onChange={(e) => setSectionName(e.target.value)}
                                          />
                                          <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                                              {sectionNameFeedback}
                                          </Form.Control.Feedback>
                                        </InputGroup>
                                        <div className={styles.addOption} onClick={() => handleAddSection()}><i className="fa-solid fa-plus"></i></div>
                                    </div>
                                    : null}
                                  </>
                                </div>
                                <div className={styles.tableStyle}>
                                  <>
                                    <h2>Pokój</h2>
                                      {col3=="" ? null : col3.map((room: any, index: any) => (
                                        <div className={styles.form_group}>
                                          <div className={styles.listOption} key={index} id={room._id} onClick={() => handleGetOwnerRoom(index, room.name)}> 
                                          {room.name}           
                                        </div>
                                          <div className={styles.addOption}><i className="fa-solid fa-trash fa-lg"></i></div>
                                        </div>
                                      ))}
                                      {showCol3 ?
                                      <div>
                                        <button onClick={onForm} className={styles.newRoom}>Dodaj nowy pokój</button>
                                        {newRoom  ? 
                                        <div>
                                          <div className={styles.form_group}>
                                              <InputGroup className={styles.inputTextTable} hasValidation>
                                              <Form.Control
                                                type="text"
                                                id="roomName"
                                                value={roomName}
                                                isInvalid={validatedRoomName}
                                                onChange={(e) => setRoomName(e.target.value)}
                                                />
                                                <Form.Control.Feedback className={styles.ErrorInput} type='invalid'>
                                                    {roomNameFeedback}
                                                </Form.Control.Feedback>
                                              </InputGroup>
                                          </div>
                                          <div>
                                            <label className={styles.ownerTitleStyle}>Właściciel/e pokoju:</label>
                                            <select className={styles.selectOwner} multiple id="user" onChange={(e) =>{
                                              var tmp: string[] = [];
                                                for (let i = 0; i < e.target.options.length; i++) {
                                                  if(e.target.options[i].selected) {
                                                    tmp=[...tmp, e.target.options[i].value]
                                                  }
                                                }
                                                setRoomOwners(tmp);
                                                console.log(roomOwners);
                                            }}>
                                              {userTable.map((user: any) => (
                                                <option key={user._id} value={user._id}>{user.username}</option>
                                                ))}
                                            </select>
                                          </div>
                                          <div className={styles.addRoom} onClick={() => handleAddRoom()}><i className="fa-solid fa-plus"></i></div>
                                        </div>
                                        : null}
                                      </div>
                                    : null}
                                  </>
                                </div>
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
                                        disabled
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
                                    <label className={styles.oneOwnerTitleStyle}>Właściciel:</label> <br />
                                    <select className={styles.oneOwner} id="productOwner" value={productOwner} onChange={(e) => setProductOwner(e.target.value)}>
                                      <option value="">Brak</option>
                                      {col4=="" ? null : col4.map((user: any) => (
                                        <option key={user._id} value={user.id}>{user.username}</option>
                                      ))}
                                    </select>
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
                                      <button onClick={handleAddProducts} className={styles.AddProductButton}>Dodaj pozycje</button>
                                  </div>
                              </div>
                            </div>
                            <hr />
                            <span className={styles.headerTable}>
                              <span>
                                <span className={styles.tableNameStyle}>INSTYTUCJA: {tableName}</span> 
                                <span className={styles.sdButton} id={styles.colorRed}><button className={styles.deleteButton} ><i className="fa-solid fa-trash fa-lg"></i></button></span>   
                              </span>
                              <span className={styles.searchStyle}>
                                <input className={styles.inputTextSearch} type="text" placeholder='Wyszukaj' value={searchTermIN} onChange={handleSearchIN} />
                              </span>
                            </span>
                            <div className="table-responsive">
                              <Table striped bordered>
                                <thead>
                                  <tr>
                                    <th scope="col" className={styles.qrStyle}>Kod QR</th>
                                    <th scope="col">Nazwa</th>
                                    <th scope="col" className={styles.quantityStyle}>Ilość</th>
                                    <th scope="col" className={styles.quantityStyle}>Ilość Inw.</th>
                                    <th scope="col">Właściciel</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {positionsTable.length === 0 ? null : (
                                    <>
                                      {positionsTable.map((product: any, index: any) => (
                                        <tr key={index}>
                                          <td>{product.qrCode}</td>
                                          <td>{product.productName}</td>
                                          <td className={styles.quantityStyle}>{product.quantity}</td>
                                          <td className={styles.quantityStyle}>{product.newQuantity}</td>
                                          <td>{product.productOwner}</td>
                                          <td className={styles.sdButton} id={styles.colorBlue}>
                                            <Popup className="mypopup" trigger={<button className={styles.qrButton}><i className="fa-solid fa-qrcode fa-lg"></i></button>} position="left center">
                                              <div className={styles.popupdiv}>
                                                <div className={styles.popupDiv}>
                                                <QRCode value={product.qrCode} size={120} />
                                                  <div className={styles.downloadButton}>
                                                    <button id={styles.colorBlue} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
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
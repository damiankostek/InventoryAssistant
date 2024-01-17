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
    const [ctoken, setCtoken] = useState<string | undefined>('');
    const [showAddWarehouse, setShowAddWarehouse] = useState(false);
    const [showAddInstitution, setShowAddInstitution] = useState(false);
    const [listType, setListType] = useState('');
    const [id, setId] = useState('');
    const [tableName, setTableName] = useState('');
    const [hallName, setHallName] = useState('');
    const [sectionName, setSectionName] = useState('');
    const [rackName, setRackName] = useState('');
    const [shelfName, setShelfName] = useState('');
    const [roomName, setRoomName] = useState('');
    const [roomOwners, setRoomOwners] = useState<string[]>([]);
    const [productOwner, setProductOwner] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [qrCodeImage, setQRCodeImage] = useState<JSX.Element | null>(null);
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [searchTermIN, setSearchTermIN] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(table);
    const [filteredPositions, setFilteredPositions] = useState(table);

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
    const [showAddForm, setShowAddForm] = useState(false);
    const [newRoom, setNewRoom] = useState(false);
    const [productsTable, setProductsTable] = useState(table);
    const [positionsTable, setPositionsTable] = useState(table);

    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleButtonClick = () => {
      setShowConfirmation(true);
    };

    const handleButtonClickOff = () => {
      setShowConfirmation(false);
    };

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
      const userApiUrl = 'http://'+api+':8080/userDetails';
      const apiUrl = 'http://'+api+':8080/tableDetails';
      const token = Cookies.get('user');
      setCtoken(token);

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
        setInventoryTable(data.details);
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
            setProductsTable([...productsTable, requestBody]);
            setSearchTerm('');
            setFilteredProducts([...productsTable, requestBody]);
            setName('');
            setQuantity('');
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

  const handleAddProducts = () => { 
    const apiUrl = 'http://'+api+':8080/addProducts';

    var productOwner_ = "";
    if(productOwner == "") {
      for (let i = 0; i < userTable.length; i++) {
         if(userTable[i]._id == col4[0]._id) {
            productOwner_ = userTable[i].username;
         }
      }
    }else {
      productOwner_ = productOwner;
    }
    
    setProductOwner('');

    const requestBody = {
      qrCode: qrCode,
      name: name,
      productOwner: productOwner_,
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
          if(data.success){
            console.log(data.success);
            setPositionsTable([...positionsTable, requestBody]);
            setSearchTermIN('');
            setFilteredPositions([...positionsTable, requestBody]);
            setName('');
            setQuantity('');
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

  const handleDownloadQR = (productQR: any) => {
    const canvas: any = document.getElementById(productQR);
    if(canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl
      downloadLink.download = productQR+".png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const handleDeleteList = (tableName_:any) => {
    const apiUrl = 'http://'+api+':8080/tableDelete';
    
    const token = Cookies.get('user');

    const requestBody = {
      token: token,
      tableName: tableName_
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
            window.location.reload();
          }else if(data.fail){
          console.log(data.fail);
        }
      });
  };

  const handleDeleteHall = (hallQR:any) => {
    const apiUrl = 'http://'+api+':8080/hallDelete';
    
    const token = Cookies.get('user');

    const requestBody = {
      token: token,
      qrCode: hallQR
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
            handleGetTable(id);
          }else {
          console.log(data.fail);
        }
      });
  };

  const handleDeleteSection = (sectionQR:any) => {
    const apiUrl = 'http://'+api+':8080/sectionDelete';
    
    const token = Cookies.get('user');

    const requestBody = {
      token: token,
      qrCode: sectionQR
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
            handleGetTable(id);
          }else {
          console.log(data.fail);
        }
      });
  };

  const handleDeleteRack = (rackQR:any) => {
    const apiUrl = 'http://'+api+':8080/rackDelete';
    
    const token = Cookies.get('user');

    const requestBody = {
      token: token,
      qrCode: rackQR
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
            handleGetTable(id);
          }else {
          console.log(data.fail);
        }
      });
  };

  const handleDeleteShelf = (shelfQR:any) => {
    const apiUrl = 'http://'+api+':8080/shelfDelete';
    
    const token = Cookies.get('user');

    const requestBody = {
      token: token,
      qrCode: shelfQR
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
            handleGetTable(id);
          }else {
          console.log(data.fail);
        }
      });
  };

  const handleDeleteProduct = (productQR:any) => {
    const apiUrl = 'http://'+api+':8080/productDelete';
    
    const token = Cookies.get('user');

    const requestBody = {
      token: token,
      qrCode: productQR
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
            setFilteredProducts(data.productsTable);
          }else {
          console.log(data.fail);
        }
      });
  };

  const handleDeleteRoom = (roomQR:any) => {
    const apiUrl = 'http://'+api+':8080/roomDelete';
    
    const token = Cookies.get('user');

    const requestBody = {
      token: token,
      qrCode: roomQR
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
            handleGetTable(id);
          }else {
          console.log(data.fail);
        }
      });
  };

  const handleDeletePosition = (positionQR:any) => {
    const apiUrl = 'http://'+api+':8080/positionDelete';
    
    const token = Cookies.get('user');

    const requestBody = {
      token: token,
      qrCode: positionQR
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
            setFilteredPositions(data.positionsTable);
          }else {
          console.log(data.fail);
        }
      });
  };

  const handleGetTable = (idT:any) => {
    setId(idT);
    setShowAddWarehouse(true);
    setShowAddInstitution(true);

    const apiUrl = 'http://'+api+':8080/getTableById';
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
            setListType(data.data.type)
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
            setFilteredProducts(data.allProducts);
            setPositionsTable(data.allPositions);  
            setFilteredPositions(data.allPositions);
        }        
      }
      )
  }

  const handleGetSections = (idH:any, name: string) => {
    setCol2(col1[idH].sections);
    setCol3([]);
    setCol4([]);
    setShowCol2(true);
    setShowCol3(false);
    setShowCol4(false);
    const QS = qrCode?.split("-")
    setQrCode(QS[0]+"-"+name);
    setShowAddForm(false);
  }

  const handleGetRacks = (idS:any, name: string) => {
    setCol3(col2[idS].racks)
    setCol4([]);
    setShowCol3(true);
    setShowCol4(false);
    const QS = qrCode?.split("-")
    setQrCode(QS[0]+"-"+QS[1]+"-"+name);
    setShowAddForm(false);
  }

  const handleGetRooms = (idS:any, name: string) => {
    setCol3(col2[idS].rooms)
    setCol4([]);
    setShowCol3(true);
    setShowCol4(false);
    const QS = qrCode?.split("-")
    setQrCode(QS[0]+"-"+QS[1]+"-"+name);
    setShowAddForm(false);
  }

  const handleGetShelfs = (idR:any, name: string) => {
    setCol4(col3[idR].shelfs)
    setShowCol4(true);
    const QS = qrCode?.split("-")
    setQrCode(QS[0]+"-"+QS[1]+"-"+QS[2]+"-"+name);
    setShowAddForm(false);
  }

  const handleGetOwnerRoom = (idR:any, name: string) => {
    const QS = qrCode?.split("-")
    setQrCode(QS[0]+"-"+QS[1]+"-"+QS[2]+"-"+name+"-"+generateRandomQRCode());
    var tmp: any = [];
    for (let i = 0; i < userTable.length; i++) {
      for (let j = 0; j < col3[idR].roomOwners.length; j++) {
        if(col3[idR].roomOwners[j].id){
          if(userTable[i]._id == col3[idR].roomOwners[j].id)
          tmp = [...tmp, userTable[i]]
        }else {
          if(userTable[i]._id == col3[idR].roomOwners[j])
          tmp = [...tmp, userTable[i]]
        }        
      }
    }
    setCol4(tmp);
    setShowAddForm(true);
  }

  const handleSetShelf = (name: string) => {
    const QS = qrCode?.split("-")
    setQrCode(QS[0]+"-"+QS[1]+"-"+QS[2]+"-"+QS[3]+"-"+name);
    setShowAddForm(true);
  }

  const handleAddHall = () => {
    const apiUrl = 'http://'+api+':8080/addHall'; 

    const requestBody = {
      hallName: hallName,
      listName: qrCode?.split("-")[0]
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
          if(data.success){
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
    const apiUrl = 'http://'+api+':8080/addSection'; 

    const requestBody = {
      sectionName: sectionName,
      listName: qrCode?.split("-")[0],
      hallName: qrCode?.split("-")[1]
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
          if(data.success){
            setQrCode(qrCode+"-"+sectionName);
            if(listType == "wh") {
              setCol2([...col2, {name: sectionName, racks: []}]);
            }else if(listType == "in") {
              setCol2([...col2, {name: sectionName, rooms: []}]);
            }
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
    const apiUrl = 'http://'+api+':8080/addRack'; 

    const requestBody = {
      rackName: rackName,
      listName: qrCode?.split("-")[0],
      hallName: qrCode?.split("-")[1],
      sectionName: qrCode?.split("-")[2]
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
          if(data.success){
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
    const apiUrl = 'http://'+api+':8080/addRoom';

    const requestBody = {
      roomName: roomName,
      roomOwners: roomOwners,
      listName: qrCode?.split("-")[0],
      hallName: qrCode?.split("-")[1],
      sectionName: qrCode?.split("-")[2]
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
          if(data.success){
            setQrCode(qrCode+"-"+roomName+"-"+generateRandomQRCode());
            setCol3([...col3, {name: roomName, roomOwners: roomOwners}]);
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
    const apiUrl = 'http://'+api+':8080/addShelf'; 

    const requestBody = {
      shelfName: shelfName,
      listName: qrCode?.split("-")[0],
      hallName: qrCode?.split("-")[1],
      sectionName: qrCode?.split("-")[2],
      rackName: qrCode?.split("-")[3]
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
          if(data.success){
            setQrCode(qrCode+"-"+shelfName+"-"+generateRandomQRCode());
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

  const handleUpdateWH = (tableName_:any) => {
    const apiUrl = 'http://'+api+':8080/updateWH';
    const refreshApiUrl = 'http://'+api+':8080/getProducts';
    
    const token = Cookies.get('user');

    const requestBody = {
      token: token,
      tableName: tableName_
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
            const requestBodyT = {
              nameT: tableName
            };
              fetch(refreshApiUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBodyT),
              })
                .then((response) => {
                  if (response.status == 500) {
                    throw new Error('Błąd serwera');
                  }
                  return response.json();
                })
                .then((data) => {
                    if(data){
                      setProductsTable(data.allProducts);
                      setFilteredProducts(data.allProducts);
                    }else{
                      console.log("Błąd podczas odświeżania")
                    }
                });
          }else if(data.fail){
          console.log(data.fail);
        }
      });
  };

  const handleUpdateIN = (tableName_:any) => {
    const apiUrl = 'http://'+api+':8080/updateIN';
    const refreshApiUrl = 'http://'+api+':8080/getPositions';
    
    const token = Cookies.get('user');

    const requestBody = {
      token: token,
      tableName: tableName_
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
            const requestBodyT = {
              nameT: tableName
            };
            fetch(refreshApiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBodyT),
            })
              .then((response) => {
                if (response.status == 500) {
                  throw new Error('Błąd serwera');
                }
                return response.json();
              })
              .then((data) => {
                  if(data){
                    setPositionsTable(data.allPositions);
                    setFilteredPositions(data.allPositions);
                  }else{
                    console.log("Błąd podczas odświeżania")
                  }
              });
          }else if(data.fail){
          console.log(data.fail);
        }
      });
  };

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
                    listType == "wh" ?
                        // MAGAZYN
                    <div className={styles.table_container}>
                      <div className={styles.tablesStyle}>
                          <div>
                                <div className={styles.tableStyle}>
                                  {showCol1 ? 
                                  <>
                                    <h2>Hala</h2>
                                      {col1.map((hall: any, index: any) => (
                                        <div className={styles.form_group} key={index}>
                                          <div className={styles.listOption}  id={hall._id} onClick={() => handleGetSections(index, hall.name)}> 
                                            {hall.name}           
                                          </div>
                                          <div className={styles.addOption} onClick={() => handleDeleteHall(qrCode)}><i className="fa-solid fa-trash fa-lg"></i></div>
                                        </div>
                                      ))}
                                      
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
                                    
                                  </>
                                  : null}
                                </div>
                                <div className={styles.tableStyle}>
                                  {showCol2 ? 
                                  <>
                                    <h2>Alejka</h2>
                                      {col2=="" ? null : col2.map((section: any, index: any) => (
                                        <div className={styles.form_group} key={index}>
                                          <div className={styles.listOption} id={section._id} onClick={() => handleGetRacks(index, section.name)}> 
                                          {section.name}           
                                        </div>
                                          <div className={styles.addOption} onClick={() => handleDeleteSection(qrCode)}><i className="fa-solid fa-trash fa-lg"></i></div>
                                        </div>
                                      ))}
                                      
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
                                    
                                  </>
                                  : null}
                                </div>
                                <div className={styles.tableStyle}>
                                  {showCol3 ?
                                  <>
                                    <h2>Regał</h2>
                                      {col3=="" ? null : col3.map((rack: any, index: any) => (
                                        <div className={styles.form_group} key={index}>
                                          <div className={styles.listOption} id={rack._id} onClick={() => handleGetShelfs(index, rack.name)}> 
                                          {rack.name}           
                                        </div>
                                          <div className={styles.addOption} onClick={() => handleDeleteRack(qrCode)}><i className="fa-solid fa-trash fa-lg"></i></div>
                                        </div>
                                      ))}
                                      
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
                                    
                                  </>
                                  : null}
                                </div>
                                <div className={styles.tableStyle}>
                                  {showCol4 ?
                                  <>
                                    <h2>Półka</h2>
                                      {col4=="" ? null : col4.map((shelf: any, index: any) => (
                                        <div className={styles.form_group} key={index}>
                                          <div className={styles.listOption} id={shelf._id} onClick={() => handleSetShelf(shelf.name)}> 
                                          {shelf.name}           
                                        </div>
                                          <div className={styles.addOption} onClick={() => handleDeleteShelf(qrCode)}><i className="fa-solid fa-trash fa-lg"></i></div>
                                        </div>
                                      ))}
                                      
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
                                  </>
                                  : null}
                                </div>
                            </div>
                        </div>
                        <div className={styles.tableContent}>
                            <hr />
                            {showAddForm ? 
                            <>
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
                           
                            <hr /> </> :null}
                            <span className={styles.headerTable}>
                              <span>
                                <span className={styles.tableNameStyle}>MAGAZYN: {tableName}</span> 
                                <span className={styles.sdButton} id={styles.colorRed}><button className={styles.deleteButton} onClick={(_) => handleDeleteList(tableName)}><i className="fa-solid fa-trash fa-lg"></i></button></span>  
                                {filteredProducts.length > 0 && filteredProducts.every((product: any) => product.newQuantity !== undefined && product.newQuantity !== null && product.newQuantity !== '') ? (
                                  <span className={styles.raportButton}>
                                    <a href={`http://${api}:8080/createRaportWH?tableName=${tableName}&token=${ctoken}`}>
                                      <button><i className="fa-solid fa-check-to-slot"></i></button>
                                    </a>
                                    {showConfirmation && (
                                  <div className={styles.confirmationBox}>
                                      <p>Czy na pewno chcesz przeliczyć stan magazynowy?</p>
                                      <p className={styles.infoDialog}>* Procesu nie można cofnąć</p>
                                      <button onClick={(_) => handleUpdateWH(tableName)} className={styles.confirmationBoxYes}>TAK</button>
                                      <button onClick={handleButtonClickOff} className={styles.confirmationBoxNo}>NIE</button>
                                    </div>
                                  )}
                                  </span>
                                ) : null}
                                <span className={styles.raportButton}><button onClick={handleButtonClick}><i className="fa-solid fa-arrows-rotate"></i></button></span> 
                                
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
                                          <td>{product.name}</td>
                                          <td className={styles.quantityStyle}>{product.quantity}</td>
                                          <td className={styles.quantityStyle}>{product.newQuantity}</td>
                                          <td>{product.employee}</td>
                                          <td className={styles.sdButton} id={styles.colorBlue}>
                                            <Popup className="mypopup" trigger={<button className={styles.qrButton}><i className="fa-solid fa-qrcode fa-lg"></i></button>} position="left center">
                                              <div className={styles.popupdiv}>
                                                <div className={styles.popupDiv}>
                                                <QRCode value={product.qrCode} size={120} id={product.qrCode}/>
                                                  <div className={styles.downloadButton}>
                                                    <button  id={styles.colorBlue} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }} onClick={(_) => handleDownloadQR(product.qrCode)}>
                                                      <i className="fa-solid fa-download fa-lg"></i>
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            </Popup>
                                          </td>
                                          <td className={styles.sdButton} id={styles.colorRed}><button className={styles.deleteButton} onClick={(_) => handleDeleteProduct(product.qrCode)}><i className="fa-solid fa-trash fa-lg"></i></button></td>
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
                              {showCol1 ? 
                              <>
                                  <div className={styles.tableStyle}>
                                    
                                      <h2>Budynek</h2>
                                        {col1.map((hall: any, index: any) => (
                                          <div className={styles.form_group} key={index}>
                                            <div className={styles.listOption} id={hall._id} onClick={() => handleGetSections(index, hall.name)}> 
                                              {hall.name}        
                                            </div>
                                            <div className={styles.addOption} onClick={() => handleDeleteHall(qrCode)}><i className="fa-solid fa-trash fa-lg"></i></div>
                                          </div>
                                        ))}
                                        
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
                                      
                                  </div>
                                </>
                                : null}
                                <div className={styles.tableStyle}>
                                  {showCol2 ? 
                                  <>
                                    <h2>Piętro</h2>
                                      {col2=="" ? null : col2.map((section: any, index: any) => (
                                        <div className={styles.form_group} key={index}>
                                          <div className={styles.listOption} id={section._id} onClick={() => handleGetRooms(index, section.name)}> 
                                          {section.name}           
                                        </div>
                                          <div className={styles.addOption} onClick={() => handleDeleteSection(qrCode)}><i className="fa-solid fa-trash fa-lg"></i></div>
                                        </div>
                                      ))}
                                      
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
                                  </>
                                  : null}
                                </div>
                                <div className={styles.tableStyle}>
                                  {showCol3 ?
                                  <>
                                    <h2>Pokój</h2>
                                      {col3=="" ? null : col3.map((room: any, index: any) => (
                                        <div className={styles.form_group} key={index}>
                                          <div className={styles.listOption} id={room._id} onClick={() => handleGetOwnerRoom(index, room.name)}> 
                                          {room.name}           
                                        </div>
                                          <div className={styles.addOption} onClick={() => handleDeleteRoom(qrCode)}><i className="fa-solid fa-trash fa-lg"></i></div>
                                        </div>
                                      ))}
                                      
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
                                    
                                  </>
                                  : null}
                                </div>
                            </div>
                        </div>
                        <div className={styles.tableContent}>
                            <hr />
                            {showAddForm ?
                            <>
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
                            <hr /> </> :null}
                            <span className={styles.headerTable}>
                              <span>
                                <span className={styles.tableNameStyle}>INSTYTUCJA: {tableName}</span> 
                                <span className={styles.sdButton} id={styles.colorRed}><button className={styles.deleteButton} onClick={() => handleDeleteList(tableName)}><i className="fa-solid fa-trash fa-lg"></i></button></span>   
                                {filteredPositions.length > 0 && filteredPositions.every((product: any) => product.newQuantity !== undefined && product.newQuantity !== null && product.newQuantity !== '') ? (
                                  <span className={styles.raportButton}>
                                    <a href={`http://${api}:8080/createRaportIN?tableName=${tableName}&token=${ctoken}`}>
                                      <button><i className="fa-solid fa-check-to-slot"></i></button>
                                    </a>
                                    {showConfirmation && (
                                    <div className={styles.confirmationBox}>
                                        <p>Czy na pewno chcesz przeliczyć stan magazynowy?</p>
                                        <p className={styles.infoDialog}>* Procesu nie można cofnąć</p>
                                        <button onClick={(_) => handleUpdateIN(tableName)} className={styles.confirmationBoxYes}>TAK</button>
                                        <button onClick={handleButtonClickOff} className={styles.confirmationBoxNo}>NIE</button>
                                      </div>
                                    )}
                                  </span>
                                ) : null}
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
                                    <th scope="col">Os. odp.</th>
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
                                          <td>{product.productOwner}</td>
                                          <td>{product.employee}</td>
                                          <td className={styles.sdButton} id={styles.colorBlue}>
                                            <Popup className="mypopup" trigger={<button className={styles.qrButton}><i className="fa-solid fa-qrcode fa-lg"></i></button>} position="left center">
                                              <div className={styles.popupdiv}>
                                                <div className={styles.popupDiv}>
                                                <QRCode value={product.qrCode} size={120} id={product.qrCode}/>
                                                <div className={styles.downloadButton}>
                                                    <button  id={styles.colorBlue} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }} onClick={(_) => handleDownloadQR(product.qrCode)}>
                                                      <i className="fa-solid fa-download fa-lg"></i>
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            </Popup>
                                          </td>
                                          <td className={styles.sdButton} id={styles.colorRed}><button className={styles.deleteButton} onClick={(_) => handleDeletePosition(product.qrCode)}><i className="fa-solid fa-trash fa-lg"></i></button></td>
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
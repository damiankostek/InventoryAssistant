const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;


app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Adres klienta
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Włącz przekazywanie ciasteczek
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Obsługa preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).send();
  } else {
    next();
  }
});

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,   //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration

const user = require("./controllers/user");
const validation = require("./controllers/validation");
const token = require("./controllers/token");
const admin = require("./controllers/admin");

app.post('/', (req, res) => { 
  res.json("welcome to our server") 
}); 

// AUTH
app.post('/auth', async (req, res) => {
  const ctoken = req.body.token;
  if (!ctoken){
    return res.status(200).send({fail:"Niepoprawne dane"});
  }
  try{
    if (await token.checkToken(ctoken)){
      const userID = await token.getUserIDByToken(ctoken);
      if (!userID){
        return res.status(200).send({fail:"Niepoprawne dane"});
      }
      const get_user = await admin.getUserById(userID);
      if(!get_user){
        return res.status(200).send({fail:"Użytkownik nie istnieje"});
      }
      if(get_user.role == "admin") {
        return res.status(200).send({success: "Admin zalogowany", admin: true});
      }else {
        return res.status(200).send({success: "Użytkownik zalogowany"});
      }
    }else{
      return res.status(200).send({fail:"Niepoprawne dane"});
    }
  }catch(error){
    console.log(error)
    return res.status(500);
  }
});

// LOGOWANIE
app.post("/login", async (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  try{
    const get_user = await user.checkUsername(username);
    if (!get_user) {
      return res.status(200).send({fail:"Konto nie istnieje"});
    }
    const passwordHash = get_user.password;
    if (await user.passwordCompare(passwordHash, password)){
      const ctoken = await token.addToken(get_user._id.toString());
      if(get_user.role == "admin") {
        return res.status(200).send({token: ctoken, admin: true});
      }else {
        return res.status(200).send({token: ctoken});
      }
    }
    return res.status(200).send({fail:"Niepoprawne hasło."});

  }catch(error){
      return res.status(500);
  }
})

// WYLOGOWYWANIE
app.post('/logout', async (req, res) => {
  const ctoken = req.body.token;
  console.log('token1 '+ctoken);
  if (ctoken){
      token.removeToken(ctoken);
      return res.send({success: "wylogowano"})
  }
})

// TWORZENIE KONTA PRACOWNIKA
app.post('/registration', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  {
    let err = false;
    let errors = {
      username:[],
      password:[]
    };
    validation.check(errors.username,username);
    validation.username(errors.username,username);
    await admin.usernameUnique(errors.username,username);
    errors.username.length > 0?err=true:null;
  
    validation.check(errors.password,password);
    validation.password(errors.password,password);
    validation.min(errors.password,password,4);
    validation.max(errors.password,password,20);
    errors.password.length > 0?err=true:null;
  
    if (err){
      res.status(200).json({ errors });
      return;
    }
  }

  try{
    if(await admin.add(username, password)){
      return res.status(200).json({ success: true });
    }else {
      errors.username.push("Nie można utworzyć konta")
      return res.status(200).json({ errors });
    }
  }catch(error){
    console.error(error)
    return res.status(500);
  }
});

// POBRANIE DANYCH Z KONT
app.post('/userDetails', async (req, res) => {
  try{
    let data = {}
      data.details = (await admin.getUsers());
    return res.status(200).send(data);
  }catch(error){
    return res.status(500);
  }
});

// POBRANIE DANYCH Z KONT PO ID
app.post('/getAccountById', async (req, res) => {
  const id = req.body.id;
  var dataInventoryId = null;
  try{
    if(!id){
      console.log("blad")
      return res.status(200).send({fail: true});
    }
      const data = (await admin.getUserById(id));
      if(data.inventoryId == "aaaaaaaaaaaaaaaaaaaaaaaa"){
        dataInventoryId = "Brak tablicy";
      }else {
        dataInventoryId = (await admin.getTableById(data.inventoryId));
      }
      console.log("data: "+data)
      console.log("dataInventoryId: "+dataInventoryId)
      
    return res.status(200).send({data,dataInventoryId});
  }catch(error){
    console.log(error);
    return res.status(500);
  }
});

// POBRANIE DANYCH Z TABELI PO ID
app.post('/getTableById', async (req, res) => {
  const id = req.body.id;
  try{
    if(!id){
      console.log("blad")
      return res.status(200).send({fail: true});
    }
      const data = (await admin.getTableById(id));
      console.log("data: "+data)
    return res.status(200).send(data);
  }catch(error){
    console.log(error);
    return res.status(500);
  }
});

// ZMIANA DANYCH KONTA
app.post('/setUserDetails', async (req,res) => {
  const id = req.body.id;
  let get_user = null;
  try{
    get_user = await admin.getUserById(id);
    if(!get_user){
      return res.status(500)
    }
  }catch{
    return res.status(500)
  }

  const username = req.body.username
  const password = req.body.password
  const idTable = req.body.idTable
  
  let errors = {
    username:[],
    password:[],
    idTable:[]
  };
  let updated = {};
  if (username != get_user.username){
    validation.check(errors.username,username);
    validation.username(errors.username,username);
    await admin.usernameUnique(errors.username,username);
    if(errors.username.length == 0){
      console.log("username update! ")
      get_user.username = username;
      await get_user.save()
      updated.username = true;
    }
  }
  
  if (password != ''){
    if (!validation.check(errors.password,password)){
      if (!user.passwordCompare(get_user.passwordHash, password)){
        errors.password.push("Podane hasło jest niepoprawne.");
      }
    }
    if (!validation.check(errors.password,password)){
      validation.password(errors.password,password);
      validation.min(errors.password,password,4);
      validation.max(errors.password,password,20);
    }
    if(errors.password.length == 0){
      await admin.changePassword(get_user, password);
      updated.password = true;
    }
  }

  const addInventory = await admin.addUserInventory(username, idTable);

  get_user.idTable = addInventory;
  await get_user.save();
  updated.idTable = true;
  console.log("przypisano table "+idTable)
    
  return res.status(200).json({ errors,updated });
})

// TWORZENIE TABELI
app.post('/createTable', async (req, res) => {
  const tableName = req.body.tableName;

  {
    let err = false;
    let errors = {
      tableName:[]
    };
    validation.check(errors.tableName,tableName);
    validation.tableName(errors.tableName,tableName);
    await admin.tableNameUnique(errors.tableName,tableName);
    errors.tableName.length > 0?err=true:null;
  
    if (err){
      res.status(200).json({ errors });
      return;
    }
  }

  try{
    if(await admin.addTable(tableName)){
      return res.status(200).json({ success: true });
    }else {
      errors.username.push("Nie można utworzyć tabeli")
      return res.status(200).json({ errors });
    }
  }catch(error){
    console.error(error)
    return res.status(500);
  }
});

// DODAWANIE PRODUKTÓW DO TABELI
app.post('/addProduct', async (req, res) => {
  const tableName = req.body.tableName;
  const qrCode = req.body.qrCode;
  const name = req.body.name;
  const quantity = req.body.quantity;

  {
    let err = false;
    let errors = {
      qrCode:[],
      name:[],
      quantity:[]
    };
    validation.check(errors.qrCode,qrCode);
    validation.qrCode(errors.qrCode,qrCode);
    await admin.qrCodeUnique(errors.qrCode,qrCode);
    errors.qrCode.length > 0?err=true:null;
  
    validation.check(errors.name,name);
    validation.name(errors.name,name);
    await admin.nameUnique(errors.name,name);
    errors.name.length > 0?err=true:null;

    validation.check(errors.quantity,quantity);
    validation.quantity(errors.quantity,quantity);
    errors.quantity.length > 0?err=true:null;
  
    if (err){
      res.status(200).json({ errors });
      return;
    }
  }

  try{
    if(await admin.addProduct(tableName, qrCode, name, quantity)){
      return res.status(200).json({ success: true });
    }else {
      errors.name.push("Nie można dodać produktu")
      return res.status(200).json({ errors });
    }
  }catch(error){
    console.error(error)
    return res.status(500);
  }
});

// DODAWANIE PRODUKTÓW DO TABELI
app.post('/productDelete', async (req, res) => {  // prowizorka
  if (await admin.removeProduct(req.body.id, req.body.idProduct)) {
    res.status(200).json({ success: "Pomyślnie usunięto produkt" });
  } else {
    res.status(200).json({ fail: "Nie udało się usunąć produktu" });
  }
});

// POBRANIE DANYCH Z TABEL
app.post('/tableDetails', async (req, res) => {
  try{
    let data = {}
      data.details = await admin.getTable();
    return res.status(200).send(data);
  }catch(error){
    return res.status(500);
  }
});

// POBRANIE INVENTORY ID DLA UŻYTKOwNIKA
app.post('/getInventoryId', async (req, res) => {
  const ctoken = req.body.token;

  try{
    const userID = await token.getUserIDByToken(ctoken);
    const data = await admin.getUserById(userID);
    console.log("inventoryId: "+data.inventoryId)
    return res.status(200).send(data);
  }catch(error){
    console.log(error)
    return res.status(500);
  }
});

// WYSYŁANIE KODU QR
app.post('/sendQrCode', async (req, res) => {
  const idTable = req.body.idTable;
  const qrCode = req.body.qrCode;

  try{
    const inventory = await admin.getTableById(idTable);

    if (inventory) {
      const product = inventory.products.find(p => p.qrCode === qrCode);

      if (product) {
        return res.status(200).send({ success: "Znaleziono produkt" });
      } else {
        return res.status(200).send({ fail: "Nie znaleziono produktu z takim kodem QR" });
      }
    } else {
      return res.status(200).send({ fail: "Nie znaleziono tabeli o podanym ID" });
    }
  }catch(error){
  console.log(error)
  return res.status(500);
  }
});

// POBIERANIE PRODUKTU
app.post('/getProduct', async (req, res) => {
  const id = req.body.id;
  const qr = req.body.qr;

  try{
    const table = await admin.getTableById(id);
    const tableName = table.tableName;

    if (table) {
      const product = table.products.find(p => p.qrCode === qr);
      const data = {product, tableName}
      if (product) {
        return res.status(200).send({ data });
      } else {
        return res.status(200).send({ error: "Nie znaleziono produktu z takim kodem QR" });
      }
    } else {
      return res.status(200).send({ error: "Nie znaleziono tabeli o podanym ID" });
    }
  }catch(error){
  console.log(error)
  return res.status(500);
  }
});

// AKTUALIZACJA ILOŚCI
app.post('/setChangeQuantity', async (req, res) => {
  const idTable = req.body.idTable;
  const qrCode = req.body.qrCode;
  const quantity = req.body.quantity;
  const inventory = req.body.inventory;

  try{
    const table = await admin.getTableById(idTable);
    if(!table){
      return res.status(200).send({ error: "Nie znaleziono tabeli o podanym ID" });
    }
    const product = table.products.find(p => p.qrCode === qrCode);
    if(!product){
      return res.status(200).send({ error: "Nie znaleziono produktu z takim kodem QR" });
    }

    let errors = {
      quantity:[]
    };
    let updated = {};
      validation.quantity(errors.quantity,quantity);
      if(errors.quantity.length == 0){
        console.log("quantity update! ")
        admin.updateProduct(product, quantity, inventory, table);
        updated.quantity = true;
      }
    return res.status(200).json({ errors,updated });
  }catch(error){
  console.log(error)
  return res.status(500);
  }
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
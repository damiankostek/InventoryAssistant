const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).send();
  } else {
    next();
  }
});

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))

const user = require("./controllers/user");
const validation = require("./controllers/validation");
const token = require("./controllers/token");
const admin = require("./controllers/admin");

app.get('/', (req, res) => { 
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

// POBRANIE DANYCH Z TABEL
app.post('/tableDetails', async (req, res) => {
  try{
    let data = {}
      data.details = (await admin.getTables());
    return res.status(200).send(data);
  }catch(error){
    return res.status(500);
  }
});

// POBRANIE DANYCH Z KONT PO ID
app.post('/getAccountById', async (req, res) => {
  const id = req.body.id;
  try{
    if(!id){
      return res.status(200).send({fail: true});
    }
      const data = (await admin.getUserById(id));
      
    return res.status(200).send({data});
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
      return res.status(200).send({fail: true});
    }
      const data = (await admin.getTableById(id));
      const allProducts = await admin.getAllProducts(data.name);
      const allPositions = await admin.getAllPositions(data.name);
      // console.log("data: "+data)
      // console.log("allProducts: " + JSON.stringify(allProducts));
      // console.log("allPositions: " + JSON.stringify(allPositions));
    return res.status(200).send({data: data, allProducts: allProducts, allPositions: allPositions});
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
  
  let errors = {
    username:[],
    password:[]
  };
  let updated = {};
  if (username != get_user.username){
    validation.check(errors.username,username);
    validation.username(errors.username,username);
    await admin.usernameUnique(errors.username,username);
    if(errors.username.length == 0){
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

  await get_user.save();
    
  return res.status(200).json({ errors,updated });
})

// DODAWANIE MAGAZYNU
app.post('/createWarehouse', async (req, res) => {
  const ctoken = req.body.token;
  const warehouseName = req.body.warehouseName;

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
        let err = false;
        let errors = {
          warehouseName:[],
        };
        validation.check(errors.warehouseName,warehouseName);
        validation.warehouseName(errors.warehouseName,warehouseName);
        await admin.warehouseNameUnique(warehouseName);
        errors.warehouseName.length > 0?err=true:null;
      
        if (err){
          res.status(200).json({ errors });
          return;
        }
      
        try{
            if(await admin.addWarehouse(warehouseName)){
              return res.status(200).json({ success: true });
            }else {
              errors.username.push("Nie można utworzyć magazynu")
              return res.status(200).json({ errors });
            }
        }catch(error){
          console.error(error)
          return res.status(500);
        }
      }
    }else{
      return res.status(200).send({fail:"Niepoprawne dane"});
    }
  }catch(error){
    console.log(error)
    return res.status(500);
  }
});

// DODAWANIE INSTYTUCJI
app.post('/createInstitution', async (req, res) => {
  const ctoken = req.body.token;
  const institutionName = req.body.institutionName;

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
        let err = false;
        let errors = {
          institutionName:[],
        };
        validation.check(errors.institutionName,institutionName);
        validation.institutionName(errors.institutionName,institutionName);
        await admin.institutionNameUnique(institutionName);
        errors.institutionName.length > 0?err=true:null;
      
        if (err){
          res.status(200).json({ errors });
          return;
        }
      
        try{
            if(await admin.addInstitution(institutionName)){
              return res.status(200).json({ success: true });
            }else {
              errors.username.push("Nie można utworzyć instytucji")
              return res.status(200).json({ errors });
            }
        }catch(error){
          console.error(error)
          return res.status(500);
        }
      }
    }else{
      return res.status(200).send({fail:"Niepoprawne dane"});
    }
  }catch(error){
    console.log(error)
    return res.status(500);
  }
});

// DODAWANIE HALI
app.post('/addHall', async (req, res) => {
  const listName = req.body.listName;
  const hallName = req.body.hallName;

  {
    let err = false;
    let errors = {
      hallName:[],
    };

    validation.check(errors.hallName,hallName);
    await admin.hallNameUnique(errors.hallName, listName, hallName);
    errors.hallName.length > 0?err=true:null;

    if (err){
      res.status(200).json({ errors });
      return;
    }
  }
  try{
    if(await admin.addHall(listName, hallName)) {
      return res.status(200).json({ success: "Dodano hale" });
    }else {
      errors.hallName.push("Nie można dodać hali")
      return res.status(200).json({ errors });
    }
  }catch(error){
    console.error(error)
    return res.status(500);
  }
});

// DODAWANIE ALEJKI
app.post('/addSection', async (req, res) => {
  const listName = req.body.listName;
  const hallName = req.body.hallName;
  const sectionName = req.body.sectionName;

  {
    let err = false;
    let errors = {
      sectionName:[],
    };

    validation.check(errors.sectionName,sectionName);
    await admin.sectionNameUnique(errors.sectionName, listName, hallName, sectionName);
    errors.sectionName.length > 0?err=true:null;

    if (err){
      res.status(200).json({ errors });
      return;
    }
  }
  try{
    if(await admin.addSection(listName, hallName, sectionName)) {
      return res.status(200).json({ success: "Dodano alejke" });
    }else {
      errors.sectionName.push("Nie można dodać alejki")
      return res.status(200).json({ errors });
    }
  }catch(error){
    console.error(error)
    return res.status(500);
  }
});

// DODAWANIE REGAŁU
app.post('/addRack', async (req, res) => {
  const listName = req.body.listName;
  const hallName = req.body.hallName;
  const sectionName = req.body.sectionName;
  const rackName = req.body.rackName;
  
  {
    let err = false;
    let errors = {
      rackName:[],
    };

    validation.check(errors.rackName,rackName);
    await admin.rackNameUnique(errors.rackName, listName, hallName, sectionName, rackName);
    errors.rackName.length > 0?err=true:null;

    if (err){
      res.status(200).json({ errors });
      return;
    }
  }
  try{
    if(await admin.addRack(listName, hallName, sectionName, rackName)) {
      return res.status(200).json({ success: "Dodano regał" });
    }else {
      errors.rackName.push("Nie można dodać regału")
      return res.status(200).json({ errors });
    }
  }catch(error){
    console.error(error)
    return res.status(500);
  }
});

// DODAWANIE POKOJU
app.post('/addRoom', async (req, res) => {
  const listName = req.body.listName;
  const hallName = req.body.hallName;
  const sectionName = req.body.sectionName;
  const roomName = req.body.roomName;
  const roomOwners = req.body.roomOwners;
  
  {
    let err = false;
    let errors = {
      roomName:[],
    };

    validation.check(errors.roomName,roomName);
    await admin.roomNameUnique(errors.roomName, listName, hallName, sectionName, roomName);
    errors.roomName.length > 0?err=true:null;

    if (err){
      res.status(200).json({ errors });
      return;
    }
  }
  try{
    if(await admin.addRoom(listName, hallName, sectionName, roomName, roomOwners)) {
      return res.status(200).json({ success: "Dodano pokój" });
    }else {
      errors.roomName.push("Nie można dodać pokoju")
      return res.status(200).json({ errors });
    }
  }catch(error){
    console.error(error)
    return res.status(500);
  }
});

// DODAWANIE PÓŁKI
app.post('/addShelf', async (req, res) => {
  const listName = req.body.listName;
  const hallName = req.body.hallName;
  const sectionName = req.body.sectionName;
  const rackName = req.body.rackName;
  const shelfName = req.body.shelfName;

  {
    let err = false;
    let errors = {
      shelfName:[],
    };

    validation.check(errors.shelfName,shelfName);
    await admin.shelfNameUnique(errors.shelfName, listName, hallName, sectionName, rackName, shelfName);
    errors.shelfName.length > 0?err=true:null;

    if (err){
      res.status(200).json({ errors });
      return;
    }
  }
  try{
    if(await admin.addShelf(listName, hallName, sectionName, rackName, shelfName)) {
      return res.status(200).json({ success: "Dodano półkę" });
    }else {
      errors.shelfName.push("Nie można dodać półki")
      return res.status(200).json({ errors });
    }
  }catch(error){
    console.error(error)
    return res.status(500);
  }
});

// DODAWANIE PRODUKTÓW DO MAGAZYNU
app.post('/addProduct', async (req, res) => {
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
    if(await admin.addProduct(qrCode, name, quantity)){
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

// DODAWANIE PRODUKTÓW DO INSTYTUCJI
app.post('/addProducts', async (req, res) => {
  const qrCode = req.body.qrCode;
  const name = req.body.name;
  const productOwner = req.body.productOwner;
  const quantity = req.body.quantity;

  {
    let err = false;
    let errors = {
      qrCode:[],
      name:[],
      quantity:[]
    };


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
    if(await admin.addProducts(qrCode, name, productOwner, quantity)){
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

// USUWANIE PRODUKTÓW Z TABELI
app.post('/productDelete', async (req, res) => { 
  const ctoken = req.body.token;
  const qrCode = req.body.qrCode;
  const table = qrCode.split("-");

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
          if (await admin.removeProduct(qrCode)) {
            const productsTable = await admin.getAllProducts(table[0]);
            res.status(200).json({ success: "Pomyślnie usunięto produkt", productsTable });
          } else {
            res.status(200).json({ fail: "Nie udało się usunąć produktu" });
          }
      }
    }else{
      return res.status(200).send({fail:"Niepoprawne dane"});
    }
  }catch(error){
    console.log(error)
    return res.status(500);
  }
});

// USUWANIE POZYCJI Z INSTYTUCJI
app.post('/positionDelete', async (req, res) => { 
  const ctoken = req.body.token;
  const qrCode = req.body.qrCode;
  const table = qrCode.split("-");

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
          if (await admin.removePosition(qrCode)) {
            const positionsTable = await admin.getAllPositions(table[0]);
            res.status(200).json({ success: "Pomyślnie usunięto pozycję", positionsTable });
          } else {
            res.status(200).json({ fail: "Nie udało się usunąć pozycji" });
          }
      }
    }else{
      return res.status(200).send({fail:"Niepoprawne dane"});
    }
  }catch(error){
    console.log(error)
    return res.status(500);
  }
});

// USUWANIE PÓŁKI Z REGAŁU
app.post('/shelfDelete', async (req, res) => { 
  const ctoken = req.body.token;
  const qrCode = req.body.qrCode;

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
          if (await admin.removeShelf(qrCode)) {
            res.status(200).json({ success: "Pomyślnie usunięto półkę" });
          } else {
            res.status(200).json({ fail: "Nie udało się usunąć półki" });
          }
      }
    }else{
      return res.status(200).send({fail:"Niepoprawne dane"});
    }
  }catch(error){
    console.log(error)
    return res.status(500);
  }
});

// USUWANIE POKOJU Z SEKCJI
app.post('/roomDelete', async (req, res) => { 
  const ctoken = req.body.token;
  const qrCode = req.body.qrCode;

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
          if (await admin.removeRoom(qrCode)) {
            res.status(200).json({ success: "Pomyślnie usunięto pokój" });
          } else {
            res.status(200).json({ fail: "Nie udało się usunąć pokoju" });
          }
      }
    }else{
      return res.status(200).send({fail:"Niepoprawne dane"});
    }
  }catch(error){
    console.log(error)
    return res.status(500);
  }
});

// USUWANIE REGAŁÓW Z SEKCJI
app.post('/rackDelete', async (req, res) => { 
  const ctoken = req.body.token;
  const qrCode = req.body.qrCode;

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
          if (await admin.removeRack(qrCode)) {
            res.status(200).json({ success: "Pomyślnie usunięto regał" });
          } else {
            res.status(200).json({ fail: "Nie udało się usunąć regału" });
          }
      }
    }else{
      return res.status(200).send({fail:"Niepoprawne dane"});
    }
  }catch(error){
    console.log(error)
    return res.status(500);
  }
});

// USUWANIE SEKCJI Z HALI
app.post('/sectionDelete', async (req, res) => { 
  const ctoken = req.body.token;
  const qrCode = req.body.qrCode;

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
          if (await admin.removeSection(qrCode)) {
            res.status(200).json({ success: "Pomyślnie usunięto sekcję" });
          } else {
            res.status(200).json({ fail: "Nie udało się usunąć sekcji" });
          }
      }
    }else{
      return res.status(200).send({fail:"Niepoprawne dane"});
    }
  }catch(error){
    console.log(error)
    return res.status(500);
  }
});

// USUWANIE HALI Z TABELI
app.post('/hallDelete', async (req, res) => { 
  const ctoken = req.body.token;
  const qrCode = req.body.qrCode;

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
          if (await admin.removeHall(qrCode)) {
            res.status(200).json({ success: "Pomyślnie usunięto halę" });
          } else {
            res.status(200).json({ fail: "Nie udało się usunąć hali" });
          }
      }
    }else{
      return res.status(200).send({fail:"Niepoprawne dane"});
    }
  }catch(error){
    console.log(error)
    return res.status(500);
  }
});

// USUWANIE TABELI
app.post('/tableDelete', async (req, res) => { 
  const ctoken = req.body.token;
  const tableName = req.body.tableName;

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
          if (await admin.removeTable(tableName)) {
            res.status(200).json({ success: "Pomyślnie usunięto tabele" });
          } else {
            res.status(200).json({ fail: "Nie udało się usunąć tabeli" });
          }
      }
    }else{
      return res.status(200).send({fail:"Niepoprawne dane"});
    }
  }catch(error){
    console.log(error)
    return res.status(500);
  }
});

// POBRANIE INVENTORY ID DLA UŻYTKOwNIKA
app.post('/getInventoryId', async (req, res) => {  //narazie nie potrzebne
  const ctoken = req.body.token;

  try{
    const userID = await token.getUserIDByToken(ctoken);
    const data = await admin.getUserById(userID);
    return res.status(200).send(data);
  }catch(error){
    console.log(error)
    return res.status(500);
  }
});

// WYSYŁANIE KODU QR
app.post('/sendQrCode', async (req, res) => {  // przerobic
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
app.post('/getProduct', async (req, res) => {  // przerobic
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
app.post('/setChangeQuantity', async (req, res) => {  // przerobic
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
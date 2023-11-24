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
    if(req.body.details){
      data.details = (await admin.getUsers());
    }
    return res.status(200).send(data);
  }catch(error){
    return res.status(500);
  }
});

// ZMIANA DANYCH KONTA
app.post('/setUserDetails', async (req,res) => {
  const id = req.body.id;
  let get_user = null;
  try{
    get_user = await admin.getUserById(id);
    console.log("get user: "+get_user)
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
  return res.status(200).json({ errors,updated });
})

// TWORZENIE TABELI
app.post('/createTable', async (req, res) => {  // dodac
  
});

// DODAWANIE PRODUKTÓW DO TABELI
app.post('/addProduct', async (req, res) => {  // dodac
  
});

// POBRANIE DANYCH Z TABEL
app.post('/tableDetails', async (req, res) => {  // prowizorka xD
  try{
    let data = {}
    if(req.body.details){
      data.details = await admin.getTable();
    }
    return res.status(200).send(data);
  }catch(error){
    return res.status(500);
  }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
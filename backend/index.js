const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;

//this is new \/
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

//this is new \/
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,   //access-control-allow-credentials:true
   optionSuccessStatus:200,
}
//this is new \/
app.use(cors(corsOptions)) // Use this after the variable declaration

const user = require("./controllers/user");

//

app.post('/', (req, res) => { 
  res.json("welcome to our server") 
}); 


// const mongojs = require('mongojs')
// const db = mongojs('mongodb+srv://dkostek:<password>@cluster0.zai7k7p.mongodb.net/', ['Inventory'])


// app.post('/auth', async (req, res) => {
//   const id = req.body.user;
//   if (!id){
//     return res.status(200).send({login: false});
//   }
//   try{
//     const get_user = await user.auth(id);
//     if(!get_user){
//       return res.status(200).send({login: false});
//     }else{
//       return res.status(200).send({login: true});
//     }
//   }catch(error){
//     return res.status(500);
//   }
// });

app.post("/login", async (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  try{
    if (req.body.username == "admin" && req.body.password == "admin"){
      return res.json({success:"admin"});
    }else{
    const get_user = await user.checkUsername(username);
    if (!get_user) {
      return res.status(200).send({fail:"Konto nie istnieje"});
    }
    const passwordHash = get_user.passwordHash;
    if (await user.passwordCompare(passwordHash, password)){
      return res.status(200).send({success:get_user._id});
    }
    return res.status(200).send({fail:"Niepoprawne hasło."});
    }
  }catch(error){
      return res.status(500);
  }

  //   if (req.body.username == "admin" && req.body.password == "admin"){
  //     return res.json({success:"admin"});
  //   }else{
  //     return res.json({success:"user"});
  //   }
  // }catch(error){
  //   return res.json({fail: error});
  // }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
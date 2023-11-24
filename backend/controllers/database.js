const mongoose = require('mongoose');


// const mongojs = require('mongojs')
// const db = mongojs('mongodb+srv://dkostek:<password>@cluster0.zai7k7p.mongodb.net/', ['Inventory'])

const dbHost = 'mongodb+srv://dkostek:haslo1234@cluster0.zai7k7p.mongodb.net/InventoryDB'; 

mongoose.connect(dbHost, { useNewUrlParser: true, useUnifiedTopology: true }); 
const db = mongoose.connection;
db.on('error', (error) => {
  console.error('Błąd połączenia z bazą danych:', error);
});
db.once('open', () => {
  console.log('Połączono z bazą danych MongoDB');
});

const tokenSchema = new mongoose.Schema({
  userID: String,
  token: String,
  created_at: {type: Date, default: new Date()},
  updated_at: {type: Date, default: new Date()},
});
const Token = mongoose.model('Token', tokenSchema);

const userSchema = new mongoose.Schema({
    role: {type: String, default: "user"},
    username: String,
    password: String,
    created_at: {type: Date, default: new Date()},
    updated_at: {type: Date, default: new Date()},
});
const User = mongoose.model('User', userSchema);

//do obgadania
const tableSchema = new mongoose.Schema({
  tableName: String,
  products: [
    {
      qrCode: String,
      name: String,
      quantity: Number,
      inventory: String,
    }
  ], // dopytac jak zrobic liste w 1 tabelce
  created_at: {type: Date, default: new Date()},
  updated_at: {type: Date, default: new Date()},
});
const Inventory = mongoose.model('Inventory', tableSchema);

module.exports = { User, Inventory, Token };
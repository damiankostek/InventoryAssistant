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
    // inventoryId: String,           ogranac id do stringa bo ObjectId musi miec 24 znaki
    // inventoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', get: id => id.toString(), default: "aaaaaaaaaaaaaaaaaaaaaaaa" },
    created_at: {type: Date, default: new Date()},
    updated_at: {type: Date, default: new Date()},
});
const User = mongoose.model('User', userSchema);

// const tableSchema = new mongoose.Schema({
//   tableName: String,
//   products: [
//     {
//       // ownerProduct: String,  //(nie jest wymagany)
//       qrCode: String,
//       name: String,
//       // quantity: Number,
//       // newQuantity: Number,
//       // lokalizacja      Leg-H1-B-10-2
//       inventory: {type: String, default: ""},
//     }
//   ],
//   created_at: {type: Date, default: new Date()},
//   updated_at: {type: Date, default: new Date()},
// });
// const Inventory = mongoose.model('Inventory', tableSchema);

const globalSchema = new mongoose.Schema({
  name: String, // magazyn lub instytucja
  halls: [  // hala lub budynek
    {
      name: String,
      sections: [  // alejka w magazynie lub pietro
        {
          name: String,
          racks: [  // regał 
            {
              name: String,
              shelfs: [  // półka 
                {
                  name: String,
                  product: {
                    qrCode: String,
                    name: String,
                    quantity: Number,
                    newQuantity: Number,
                  },
                }
              ],
            }
          ],
          rooms: [ // pokoj
            {
              name: String,
              ownerRoom: String,
              products: [{
                ownerProduct: String,
                qrCode: String,
                name: String,
                quantity: Number,
                newQuantity: Number,
              }],
            }
          ],
        }
      ],
    }
  ],
  created_at: {type: Date, default: new Date()},
  updated_at: {type: Date, default: new Date()},
});
const Global = mongoose.model('Global', globalSchema);


module.exports = { User, Token, Global };
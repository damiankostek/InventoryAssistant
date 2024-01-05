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

const globalSchema = new mongoose.Schema({
  name: String, // magazyn lub instytucja
  type: String,
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
                  available: {type: Number, default: 0},
                  product: {
                    qrCode: String,
                    name: String,
                    quantity: Number,
                    newQuantity: Number,
                    employee: String,
                  },
                }
              ],
            }
          ],
          rooms: [ // pokoj
            {
              name: String,
              roomOwners: [{id: String}],
              products: [{
                productOwner: String,
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
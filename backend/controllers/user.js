const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');


// const mongojs = require('mongojs')
// const db = mongojs('mongodb+srv://dkostek:<password>@cluster0.zai7k7p.mongodb.net/', ['Inventory'])

const dbHost = 'mongodb+srv://dkostek:haslo1234@cluster0.zai7k7p.mongodb.net/InventoryDB'; 

mongoose.connect(dbHost, { useNewUrlParser: true, useUnifiedTopology: true });  //przestarzała wersja
const db = mongoose.connection;
db.on('error', (error) => {
  console.error('Błąd połączenia z bazą danych:', error);
});
db.once('open', () => {
  console.log('Połączono z bazą danych MongoDB');
});

const userSchema = new mongoose.Schema({
    username: String,
    passwordHash: String,
    created_at: {type: Date, default: new Date()},
    updated_at: {type: Date, default: new Date()},
    counter: {type: Number, default: 0},
});
const User = mongoose.model('User', userSchema);

async function checkUsername(username) {
    try {
        const user = await User.findOne({ username: username }).exec();
        console.log('Użytkownik znaleziony:', username);
        return user;
    } catch (error) {
        console.error('Błąd podczas pobierania osób:', error);
        throw error;
    }
}

async function passwordCompare( password) {
    try {
        if (await bcrypt.compare(password, passwordHash)){
            return true;
        }
        return false;
        // return true; //jak to zrobic xD
    } catch (error) {
        console.error('Błąd podczas pobierania osób:', error);
        throw error;
    }
}

module.exports = { checkUsername, passwordCompare };
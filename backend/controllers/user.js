// const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

const db = require("./database.js");

async function checkUsername(username) {
    try {
        const user = await db.User.findOne({ username: username }).exec();
        console.log('Użytkownik znaleziony:', username);
        return user;
    } catch (error) {
        console.error('Błąd podczas pobierania osób:', error);
        throw error;
    }
}

async function passwordCompare( passwordHash, password ) {
    try {
        if (await bcrypt.compare(password, passwordHash)){
            return true;
        }
        return false;
    } catch (error) {
        console.error('Błąd podczas pobierania osób:', error);
        throw error;
    }
}



module.exports = { checkUsername, passwordCompare };
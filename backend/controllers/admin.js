const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

const db = require("./database.js");

async function changePassword(user, password) {
    try {
        user.passwordHash = await bcrypt.hash(password, 10);
        await user.save();
        return true;
    } catch (error) {
        console.error('Błąd podczas pobierania osób:', error);
        throw error;
    }
}

async function add(username, passwd) {
    try {
        const password = await bcrypt.hash(passwd, 10);
        const newUser = new db.User({ 
            username,
            password
        });
        await newUser.save();
        console.log('Osoba została dodana do bazy danych.');
        return true;
    } catch (error) {
        console.error('Błąd podczas dodawania osoby:', error);
    }
    return false;
}

async function usernameUnique(arr, username) {
    try {
        const newUser = await db.User.findOne({ username: username }).exec();
        if(newUser){
            arr.push("Konto o tej nazwie użytkownika już istnieje.");
            return true;
        }
        return false;
    } catch (error) {
        console.error('Błąd podczas sprawdzania unikalności nazwy użytkownika:', error);
        throw error;
    }
}

async function getUserById(id) {
    try {
        const user = await db.User.findById(new ObjectId(id)).exec();
        if(user) {
            return user;
        }
        return false;
    }catch (error) {
        console.error('Błąd podczas sprawdzania unikalności nazwy użytkownika:', error);
        throw error;
    }
}

async function getUsers(){
    try {
        return await db.User.find({'role':'user'});
    } catch (error) {
        console.error('Błąd podczas pobierania osób:', error);
        throw error;
    }
}

async function getTable(){  // prowizorka xd
    try {
        return await db.Inventory.find();
    } catch (error) {
        console.error('Błąd podczas pobierania tabel:', error);
        throw error;
    }
}

module.exports = { changePassword, add, usernameUnique, getUserById, getUsers, getTable};
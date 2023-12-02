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

async function addProduct(tableName, qrCode, name, quantity) {
    try {
        const existingInventory = await db.Inventory.findOne({ tableName });

        if (existingInventory) {
            existingInventory.products.push({
                qrCode,
                name,
                quantity
            });

            existingInventory.updated_at = new Date();

            await existingInventory.save();
            console.log('Produkt został dodany do istniejącej tabeli w bazie danych.');
            return true;
        } else {
            console.error('Tabela o nazwie', tableName, 'nie istnieje.');
        }
    } catch (error) {
        console.error('Błąd podczas dodawania produktu:', error);
    }

    return false;
}

async function removeProduct(id, idProduct){
    db.Inventory.findById(new ObjectId(id)).products.findById(new ObjectId(idProduct))  // ogarnac to
    .then((test) => {
        console.log(test)
        return true;
    })
    .catch((error) => {
        console.error(error)
        return false;
    })
}

async function addTable(tableName) {
    try {
        const newTable = new db.Inventory({ 
            tableName
        });
        await newTable.save();
        console.log('Tabela została dodana do bazy danych.');
        return true;
    } catch (error) {
        console.error('Błąd podczas dodawania tabeli:', error);
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

async function tableNameUnique(arr, tableName) {
    try {
        const newTable = await db.Inventory.findOne({ tableName: tableName }).exec();
        if(newTable){
            arr.push("Tabela o tej nazwie już istnieje.");
            return true;
        }
        return false;
    } catch (error) {
        console.error('Błąd podczas sprawdzania unikalności nazwy tabeli:', error);
        throw error;
    }
}

async function qrCodeUnique(arr, qrCode) {  // przerobic zeby sprawdzało tylko w jednej tabeli
    try {
        const newQRCode = await db.Inventory.findOne({ qrCode: qrCode }).exec();
        if(newQRCode){
            arr.push("Taki kod QR już istnieje.");
            return true;
        }
        return false;
    } catch (error) {
        console.error('Błąd podczas sprawdzania unikalności kodu QR:', error);
        throw error;
    }
}

async function nameUnique(arr, name) {  // przerobic zeby sprawdzało tylko w jednej tabeli
    try {
        const newName = await db.Inventory.findOne({ name: name }).exec();
        if(newName){
            arr.push("Taka nazwa produktu już istnieje.");
            return true;
        }
        return false;
    } catch (error) {
        console.error('Błąd podczas sprawdzania unikalności nazwy produktu:', error);
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

async function getTableById(id) {
    try {
        const tabeName = await db.Inventory.findById(new ObjectId(id)).exec();
        if(tabeName) {
            return tabeName;
        }
        return false;
    }catch (error) {
        console.error('Błąd podczas sprawdzania unikalności nazwy tabeli:', error);
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

async function getTable(){ 
    try {
        return await db.Inventory.find();
    } catch (error) {
        console.error('Błąd podczas pobierania tabel:', error);
        throw error;
    }
}

const addUserInventory = async (username, inventoryIdToAdd) => {
    try {
        const existingUser = await db.User.findOne({ username });

        if (!existingUser) {
            console.error('Użytkownik nie istnieje.');
            return;
        }

        const result = await db.User.updateOne(
            { username },
            { $set: { inventoryId: inventoryIdToAdd } }
        );

        if (result.nModified > 0) {
            console.log('Użytkownik zaktualizowany pomyślnie.');
        } else {
            console.error('Nie udało się zaktualizować użytkownika.');
        }
    } catch (error) {
        console.error('Błąd podczas dodawania inventoryId do użytkownika:', error);
    }
};

module.exports = { changePassword, add, addProduct, removeProduct, addTable, usernameUnique, tableNameUnique, qrCodeUnique, nameUnique, getUserById, getTableById, getUsers, getTable, addUserInventory };
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

const db = require("./database.js");
const { quantity, name } = require('./validation.js');

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

async function addProduct(qrCode, name, quantity) {
    try {
        const table = qrCode.split("-");
        const existingInventory = await db.Global.findOne({ name: table[0] });

        if (existingInventory) {
                for (let index = 0; index < existingInventory.halls.length; index++) {
                    if(existingInventory.halls[index].name == table[1]) {
                        for (let i = 0; i < existingInventory.halls[index].sections.length; i++) {
                            if(existingInventory.halls[index].sections[i].name == table[2]) {
                                for (let j = 0; j < existingInventory.halls[index].sections[i].racks.length; j++) {
                                    if(existingInventory.halls[index].sections[i].racks[j].name == table[3]) {
                                        for (let z = 0; z < existingInventory.halls[index].sections[i].racks[j].shelfs.length; z++) {
                                            if(existingInventory.halls[index].sections[i].racks[j].shelfs[z].name == table[4]) {
                                                existingInventory.halls[index].sections[i].racks[j].shelfs[z].product = {qrCode: qrCode, name: name, quantity: quantity};
                                                existingInventory.halls[index].sections[i].racks[j].shelfs[z].available = 1;
                                            }
                                        } 
                                    }
                                } 
                            }
                        } 
                    }
                }

            existingInventory.updated_at = new Date();

            await existingInventory.save();
            console.log('Produkt został dodany do istniejącej tabeli w bazie danych.');
            return true;
        } else {
            console.error('Tabela o nazwie', table, 'nie istnieje.');
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

async function updateProduct(product, newQuantity, newInventory, table){
    if (product.quantity !== newQuantity) {
        product.quantity = newQuantity;
      }
    
      if (product.inventory !== newInventory) {
        product.inventory = newInventory;
      }
    
      table.updated_at = new Date();
    
      table.save();
}

async function addWarehouse(warehouseName) {
    try {
        const newSchema = new db.Global({ 
            name: warehouseName,
            type: "wh",
            halls:[]
        });
        await newSchema.save();
        console.log('Magazyn został dodany do bazy danych.');
        return true;
    } catch (error) {
        console.error('Błąd podczas dodawania magazynu:', error);
    }
    return false;
}

async function addInstitution() {
    // try {
    //     const newSchema = new db.Global({ 
    //         name: "Pcz",
    //         halls:[{
    //             name: "biblio",
    //             sections:[{
    //                 name: "pietro",
    //                 rooms: [{
    //                     name: "512",
    //                     ownerRoom: "Łukasz Biś",
    //                     productNumber: "aaaaaaaaa"
    //                 }]
    //             }]
    //         }]
    //     });
    //     await newSchema.save();
    //     console.log('Tabela została dodana do bazy danych.');
    //     return true;
    // } catch (error) {
    //     console.error('Błąd podczas dodawania tabeli:', error);
    // }
    // return false;
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

async function warehouseNameUnique(arr, warehouseName) {
    try {
        const newTable = await db.Global.findOne({ name: warehouseName }).exec();
        if(newTable){
            return newTable._id;
        }
        return false;
    } catch (error) {
        console.error('Błąd podczas sprawdzania unikalności nazwy tabeli:', error);
        throw error;
    }
}

async function qrCodeUnique(arr, qrCode) {  // przerobic zeby sprawdzało tylko w jednej tabeli
    try {
        const newQRCode = await db.Global.findOne({ qrCode: qrCode }).exec();
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
        const newName = await db.Global.findOne({ name: name }).exec();
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

async function getWarehouseById(id) {
    try {
        const tabeName = await db.Global.findById(new ObjectId(id));
        if(tabeName) {
            return tabeName;
        }
        return false;
    }catch (error) {
        console.error('Błąd podczas sprawdzania unikalności nazwy tabeli:', error);
        throw error;
    }
}

async function getTableById(id) {
    try {
        const tabeName = await db.Global.findById(new ObjectId(id));
        if(tabeName) {
            return tabeName;
        }
        return false;
    }catch (error) {
        console.error('Błąd podczas sprawdzania unikalności nazwy tabeli:', error);
        throw error;
    }
}

async function getAllProducts(name) {
    const pipeline = [
        {
            $unwind: { path: '$halls', preserveNullAndEmptyArrays: true }
          },
          {
            $unwind: { path: '$halls.sections', preserveNullAndEmptyArrays: true }
          },
          {
            $unwind: { path: '$halls.sections.racks', preserveNullAndEmptyArrays: true }
          },
          {
            $unwind: { path: '$halls.sections.racks.shelfs', preserveNullAndEmptyArrays: true }
          },
          {
            $match: { "name": name }
          },
        {
          $project: {

            _id: 0,
            qrCode: '$halls.sections.racks.shelfs.product.qrCode',
            productName: '$halls.sections.racks.shelfs.product.name',
            quantity: '$halls.sections.racks.shelfs.product.quantity'
            // dopisac newQuantity, os. odp.
          }
        }
      ];
      
      const result = await db.Global.aggregate(pipeline);

      return result;
}

async function getUsers(){
    try {
        return await db.User.find({'role':'user'});
    } catch (error) {
        console.error('Błąd podczas pobierania osób:', error);
        throw error;
    }
}

async function getTables(){
    try {
        return await db.Global.find();
    } catch (error) {
        console.error('Błąd podczas pobierania tabel:', error);
        throw error;
    }
}

async function addHall(listName, hallName) {
    try {
        const tableName = await db.Global.findOne({ name: listName }).exec();
        if(tableName) {
           tableName.halls.push({name: hallName, sections: []});
           tableName.save();    
           return true;     
        }
        return false;
    }catch (error) {
        throw error;
    }
}

async function addSection(listName, hallName, sectionName) {
    try {
        const tableName = await db.Global.findOne({ name: listName }).exec();
        if(tableName) {
            for (let index = 0; index < tableName.halls.length; index++) {
                if(tableName.halls[index].name == hallName) {
                    tableName.halls[index].sections.push({name: sectionName, racks: []});
                    tableName.save();   
                }
            } 
           return true;     
        }
        return false;
    }catch (error) {
        throw error;
    }
}

async function addRack(listName, hallName, sectionName, rackName) {
    try {
        const tableName = await db.Global.findOne({ name: listName }).exec();
        if(tableName) {
            for (let index = 0; index < tableName.halls.length; index++) {
                if(tableName.halls[index].name == hallName) {
                    for (let i = 0; i < tableName.halls[index].sections.length; i++) {
                        if(tableName.halls[index].sections[i].name == sectionName) {
                            tableName.halls[index].sections[i].racks.push({name: rackName, shelfs: []});
                            tableName.save();   
                        }
                    } 
                }
            } 
           return true;     
        }
        return false;
    }catch (error) {
        throw error;
    }
}

async function addShelf(listName, hallName, sectionName, rackName, shelfName) {
    try {
        const tableName = await db.Global.findOne({ name: listName }).exec();
        if(tableName) {
            for (let index = 0; index < tableName.halls.length; index++) {
                if(tableName.halls[index].name == hallName) {
                    for (let i = 0; i < tableName.halls[index].sections.length; i++) {
                        if(tableName.halls[index].sections[i].name == sectionName) {
                            for (let j = 0; j < tableName.halls[index].sections[i].racks.length; j++) {
                                if(tableName.halls[index].sections[i].racks[j].name == rackName) {
                                    tableName.halls[index].sections[i].racks[j].shelfs.push({name: shelfName, product: {}});
                                    tableName.save();   
                                }
                            } 
                        }
                    } 
                }
            } 
           return true;     
        }
        return false;
    }catch (error) {
        throw error;
    }
}

module.exports = { changePassword, add, addProduct, getAllProducts, updateProduct, addInstitution, removeProduct, addWarehouse, usernameUnique, warehouseNameUnique, qrCodeUnique, nameUnique, getUserById, getTableById, getUsers, getTables, getWarehouseById, addHall, addSection, addRack, addShelf};
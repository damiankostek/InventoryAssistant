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

async function removeUser(usernameToDelete) {
    const filter = { username: usernameToDelete };

    try {
    const result = await db.User.deleteOne(filter);
  
      if (result.deletedCount > 0) {
        console.log('Usunieto konto');
        return true;
      } else {
        console.log(`Nie znaleziono konta`);
        return false;
      }
    } catch (error) {
      console.error(`Error removing account: ${error}`);
      throw error;
    }
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

async function addProducts(qrCode, name, productOwner, quantity) {
    try {
        const table = qrCode.split("-");
        const existingInventory = await db.Global.findOne({ name: table[0] });

        if (existingInventory) {
                for (let index = 0; index < existingInventory.halls.length; index++) {
                    if(existingInventory.halls[index].name == table[1]) {
                        for (let i = 0; i < existingInventory.halls[index].sections.length; i++) {
                            if(existingInventory.halls[index].sections[i].name == table[2]) {
                                for (let j = 0; j < existingInventory.halls[index].sections[i].rooms.length; j++) {
                                    if(existingInventory.halls[index].sections[i].rooms[j].name == table[3]) {
                                        existingInventory.halls[index].sections[i].rooms[j].products = [...existingInventory.halls[index].sections[i].rooms[j].products, {
                                                "productOwner": productOwner,
                                                "qrCode": qrCode,
                                                "name": name,
                                                "quantity": quantity
                                        }]
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

async function removeTable(nameToDelete) {
    const filter = { name: nameToDelete };

    try {
    const result = await db.Global.deleteOne(filter);
  
      if (result.deletedCount > 0) {
        console.log('Usunieto tabele');
        return true;
      } else {
        console.log(`Nie znaleziono tabeli`);
        return false;
      }
    } catch (error) {
      console.error(`Error removing table: ${error}`);
      throw error;
    }
  }

async function removeHall(qrCode) {
  const table = qrCode.split("-");

    const filter = {
        'name': table[0],
    };
    
    const update = {
        $pull: {
        'halls': { 'name': table[1] }
        }
    };

      
    try {
      const result = await db.Global.updateOne(filter, update);
  
      if (result.modifiedCount > 0) {
        console.log(`Hall with qrCode ${qrCode} removed successfully.`);
        return true;
      } else {
        console.log(`Hall with qrCode ${qrCode} not found.`);
        return false;
      }
    } catch (error) {
      console.error(`Error removing hall: ${error}`);
      throw error;
    }
  }

async function removeSection(qrCode) {
    const table = qrCode.split("-");

        const filter = {
            'name': table[0],
            'halls.name': table[1],
        };
        
        const update = {
            $pull: {
            'halls.$[].sections': { 'name': table[2] }
            }
        };

        
        try {
        const result = await db.Global.updateOne(filter, update);

        if (result.modifiedCount > 0) {
            console.log(`Section with qrCode ${qrCode} removed successfully.`);
            return true;
        } else {
            console.log(`Section with qrCode ${qrCode} not found.`);
            return false;
        }
        } catch (error) {
        console.error(`Error removing section: ${error}`);
        throw error;
        }
}

async function removeRack(qrCode) {
    const table = qrCode.split("-");

        const filter = {
            'name': table[0],
            'halls.name': table[1],
            'halls.sections.name': table[2]
        };
        
        const update = {
            $pull: {
            'halls.$[].sections.$[].racks': { 'name': table[3] }
            }
        };
        
        try {
        const result = await db.Global.updateOne(filter, update);

        if (result.modifiedCount > 0) {
            console.log(`Rack with qrCode ${qrCode} removed successfully.`);
            return true;
        } else {
            console.log(`Rack with qrCode ${qrCode} not found.`);
            return false;
        }
        } catch (error) {
        console.error(`Error removing rack: ${error}`);
        throw error;
        }
}

async function removeRoom(qrCode) {
    const table = qrCode.split("-");

        const filter = {
            'name': table[0],
            'halls.name': table[1],
            'halls.sections.name': table[2]
        };
        
        const update = {
            $pull: {
            'halls.$[].sections.$[].rooms': { 'name': table[3] }
            }
        };
        
        try {
        const result = await db.Global.updateOne(filter, update);

        if (result.modifiedCount > 0) {
            console.log(`Room with qrCode ${qrCode} removed successfully.`);
            return true;
        } else {
            console.log(`Room with qrCode ${qrCode} not found.`);
            return false;
        }
        } catch (error) {
        console.error(`Error removing room: ${error}`);
        throw error;
        }
}

async function removeShelf(qrCode) {
    const table = qrCode.split("-");

        const filter = {
            'name': table[0],
            'halls.name': table[1],
            'halls.sections.name': table[2],
            'halls.sections.racks.name': table[3]
        };
        
        const update = {
            $pull: {
            'halls.$[].sections.$[].racks.$[].shelfs': { 'name': table[4] }
            }
        };
        
        try {
        const result = await db.Global.updateOne(filter, update);

        if (result.modifiedCount > 0) {
            console.log(`Shelf with qrCode ${qrCode} removed successfully.`);
            return true;
        } else {
            console.log(`Shelf with qrCode ${qrCode} not found.`);
            return false;
        }
        } catch (error) {
        console.error(`Error removing shelf: ${error}`);
        throw error;
        }
}

async function removeProduct(qrCode) {
    const filter = {
        'halls.sections.racks.shelfs.product.qrCode': qrCode
      };
      
      const update = {
        $pull: {
          'halls.$[].sections.$[].racks.$[].shelfs': {
            'product.qrCode': qrCode
          }
        }
      };
      
    try {
      const result = await db.Global.updateOne(filter, update);
  
      if (result.modifiedCount > 0) {
        console.log(`Product with qrCode ${qrCode} removed successfully.`);
        return true;
      } else {
        console.log(`Product with qrCode ${qrCode} not found.`);
        return false;
      }
    } catch (error) {
      console.error(`Error removing product: ${error}`);
      throw error;
    }
  }

async function findProduct(qrCode) {
    const filter = {
        $or: [
            {'halls.sections.racks.shelfs.product.qrCode': qrCode},
            {'halls.sections.racks.shelfs.product': {$elemMatch: {qrCode: qrCode}}}
        ]
    };

    const projection = {
        _id: 0 
    };


    try {
        const result = await db.Global.findOne(filter, { projection });

        if (result && result.halls) {
            for (const hall of result.halls) {
                for (const section of hall.sections) {
                    for (const rack of section.racks) {
                        for (const shelf of rack.shelfs) {
                            const product = shelf.product;
                            if (product && product.qrCode === qrCode) {
                                console.log(`Product with qrCode ${qrCode} found. Data:`);
                                return product;
                            }
                        }
                    }
                }
            }

            console.log(`Product with qrCode ${qrCode} not found.`);
            return null;
        } else {
            console.log(`Product with qrCode ${qrCode} not found.`);
            return null;
        }
    } catch (error) {
        console.error(`Error getting product data: ${error}`);
        throw error;
    }
}

async function findPosition(qrCode) {
    const filter = {
        $or: [
            {'halls.sections.rooms.products.qrCode': qrCode},
            {'halls.sections.rooms.products': {$elemMatch: {qrCode: qrCode}}}
        ]
    };

    const projection = {
        _id: 0 
    };


    try {
        const result = await db.Global.findOne(filter, { projection });

        if (result && result.halls) {
            for (const hall of result.halls) {
                for (const section of hall.sections) {
                    for (const room of section.rooms) {
                        for (const product of room.products) {
                            if (product.qrCode === qrCode) {
                                console.log(`Produkt o kodzie QR ${qrCode} znaleziony. Dane:`);
                                return product;
                            }
                        }
                    }
                }
            }

            console.log(`Position with qrCode ${qrCode} not found.`);
            return null;
        } else {
            console.log(`Position with qrCode ${qrCode} not found.`);
            return null;
        }
    } catch (error) {
        console.error(`Error getting position data: ${error}`);
        throw error;
    }
}

  async function removePosition(qrCode) {
    const filter = {
        'halls.sections.rooms.products.qrCode': qrCode
      };
      
      const update = {
        $pull: {
            'halls.$[].sections.$[].rooms.$[].products': {
                'qrCode': qrCode
            }
        }
    };
      
    try {
      const result = await db.Global.updateOne(filter, update);
  
      if (result.modifiedCount > 0) {
        console.log(`Position with qrCode ${qrCode} removed successfully.`);
        return true;
      } else {
        console.log(`Position with qrCode ${qrCode} not found.`);
        return false;
      }
    } catch (error) {
      console.error(`Error removing position: ${error}`);
      throw error;
    }
  }

async function updateProduct(qrCode, newQuantity, user){ 
    const filter = {
        'halls.sections.racks.shelfs.product.qrCode': qrCode
    };

    const update = {
        $set: {
            'halls.$[].sections.$[].racks.$[].shelfs.$[shelf].product.newQuantity': newQuantity,
            'halls.$[].sections.$[].racks.$[].shelfs.$[shelf].product.employee': user,
            'halls.$[].sections.$[].racks.$[].shelfs.$[shelf].product.updated_at': new Date()
        }
    };

    const arrayFilters = [
        {
            'shelf.product.qrCode': qrCode
        }
    ];

    try {
        const result = await db.Global.updateOne(filter, update, { arrayFilters });

        if (result.modifiedCount > 0) {
            console.log(`Product with qrCode ${qrCode} updated successfully.`);
            return true;
        } else {
            console.log(`Product with qrCode ${qrCode} not found.`);
            return false;
        }
    } catch (error) {
        console.error(`Error updating product quantity: ${error}`);
        throw error;
    }
}

async function updatePosition(qrCode, newQuantity, user){ 
    console.log(user)
    const filter = {
        'halls.sections.rooms.products.qrCode': qrCode
    };

    const update = {
        $set: {
            'halls.$[].sections.$[].rooms.$[roomFilter].products.$[productFilter].newQuantity': newQuantity,
            'halls.$[].sections.$[].rooms.$[roomFilter].products.$[productFilter].employee': user,
            'halls.$[].sections.$[].rooms.$[roomFilter].products.$[productFilter].updated_at': new Date()
        }
    };

    const arrayFilters = [
        {
            'roomFilter.products.qrCode': qrCode
        },
        {
            'productFilter.qrCode': qrCode
        }
    ];

    try {
        const result = await db.Global.updateOne(filter, update, { arrayFilters });

        if (result.modifiedCount > 0) {
            console.log(`Position with qrCode ${qrCode} updated successfully.`);
            return true;
        } else {
            console.log(`Position with qrCode ${qrCode} not found.`);
            return false;
        }
    } catch (error) {
        console.error(`Error updating position quantity: ${error}`);
        throw error;
    }
}

async function updateWH(tableToUpdate) {
    try {
    const document = await db.Global.findOne({ 'name': tableToUpdate });

    document.halls.forEach(hall => {
      hall.sections.forEach(section => {
        section.racks.forEach(rack => {
          rack.shelfs.forEach(shelf => {
            shelf.product.quantity = shelf.product.newQuantity;
          });
        });
      });
    });

    await db.Global.replaceOne({ 'name': tableToUpdate }, document);
      console.log('Replace successful' );
      await db.Global.updateMany(
        { 'name': tableToUpdate },
        {
          $set: {
            'halls.$[].sections.$[].racks.$[].shelfs.$[].product.newQuantity': null,
            'halls.$[].sections.$[].racks.$[].shelfs.$[].product.employee': ''
          }
        }
      );
      console.log('Update successful' );
      return true;
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

async function updateIN(tableToUpdate){ 
    try {
        const document = await db.Global.findOne({ 'name': tableToUpdate });

        document.halls.forEach(hall => {
            hall.sections.forEach(section => {
                section.rooms.forEach(room => {
                  room.products.forEach(product => {
                    if (product && product.newQuantity !== undefined) {
                      product.quantity = product.newQuantity;
                      product.newQuantity = null;
                      product.employee = '';
                    }
                  });
                });
            });
          });
    
        await db.Global.replaceOne({ 'name': tableToUpdate }, document);
          console.log('Replace successful' );
          
          console.log('Update successful' );
          return true;
        } catch (error) {
          console.error('Error updating document:', error);
          throw error;
        }
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

async function addInstitution(institutionName) {
    try {
        const newSchema = new db.Global({ 
            name: institutionName,
            type: "in",
            halls:[]
        });
        await newSchema.save();
        console.log('Instytucja został dodany do bazy danych.');
        return true;
    } catch (error) {
        console.error('Błąd podczas dodawania magazynu:', error);
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

async function warehouseNameUnique(arr, warehouseName) {
    try {
        const newTable = await db.Global.findOne({ name: warehouseName }).exec();
        if(newTable){
            arr.push("Magazyn o tej nazwie już istnieje.");
            return true;
        }
        return false;
    } catch (error) {
        console.error('Błąd podczas sprawdzania unikalności nazwy tabeli:', error);
        throw error;
    }
}

async function institutionNameUnique(arr, institutionName) {
    try {
        const newTable = await db.Global.findOne({ name: institutionName }).exec();
        if(newTable){
            arr.push("Instytucja o tej nazwie już istnieje.");
            return true;
        }
        return false;
    } catch (error) {
        console.error('Błąd podczas sprawdzania unikalności nazwy tabeli:', error);
        throw error;
    }
}

async function hallNameUnique(arr, listName, hallName) {
    try {
      const existingInventory = await db.Global.findOne({ name: listName }).exec();
  
      if (existingInventory) {
        const hallExists = existingInventory.halls.some(hall => hall.name === hallName);
  
        if (hallExists) {
          arr.push("Już istnieje.");
          return true;
        }
  
        return false;
      }
  
      return false;
    } catch (error) {
      console.error('Błąd podczas sprawdzania unikalności nazwy hali:', error);
      throw error;
    }
  }

async function sectionNameUnique(arr, listName, hallName, sectionName) {
    try {
        const existingInventory = await db.Global.findOne({ name: listName }).exec();

        if (existingInventory) {
        const hallExists = existingInventory.halls.some(hall => hall.name === hallName);

        if (hallExists) {
            const sectionExists = existingInventory.halls.some(hall => hall.name === hallName && hall.sections.some(section => section.name === sectionName));

            if(sectionExists) {
                arr.push("Już istnieje.");
                return true;  
            }
        }

        return false;
        }

        return false;
    } catch (error) {
        console.error('Błąd podczas sprawdzania unikalności nazwy alejki:', error);
        throw error;
    }
}

async function rackNameUnique(arr, listName, hallName, sectionName, rackName) {
    try {
        const existingInventory = await db.Global.findOne({ name: listName }).exec();

        if (existingInventory) {
            const hallExists = existingInventory.halls.some(hall => hall.name === hallName);

            if (hallExists) {
                const sectionExists = existingInventory.halls.some(hall => hall.name === hallName && hall.sections.some(section => section.name === sectionName));

                if (sectionExists) {
                    const rackExists = existingInventory.halls.some(hall => hall.name === hallName && hall.sections.some(section => section.name === sectionName && section.racks.some(rack => rack.name === rackName)));

                    if (rackExists) {
                        arr.push("Już istnieje.");
                        return true;
                    }
                }
            }
            return false;
        }

        return false;
    } catch (error) {
        console.error('Błąd podczas sprawdzania unikalności nazwy alejki:', error);
        throw error;
    }
}

async function roomNameUnique(arr, listName, hallName, sectionName, roomName) {
    try {
        const existingInventory = await db.Global.findOne({ name: listName }).exec();

        if (existingInventory) {
            const hallExists = existingInventory.halls.some(hall => hall.name === hallName);

            if (hallExists) {
                const sectionExists = existingInventory.halls.some(hall => hall.name === hallName && hall.sections.some(section => section.name === sectionName));

                if (sectionExists) {
                    const roomExists = existingInventory.halls.some(hall => hall.name === hallName && hall.sections.some(section => section.name === sectionName && section.rooms.some(room => room.name === roomName)));

                    if (roomExists) {
                        arr.push("Już istnieje.");
                        return true;
                    }
                }
            }
            return false;
        }

        return false;
    } catch (error) {
        console.error('Błąd podczas sprawdzania unikalności nazwy alejki:', error);
        throw error;
    }
}

async function shelfNameUnique(arr, listName, hallName, sectionName, rackName, shelfName) {
    try {
        const existingInventory = await db.Global.findOne({ name: listName }).exec();

        if (existingInventory) {
            const hallExists = existingInventory.halls.some(hall => hall.name === hallName);

            if (hallExists) {
                const sectionExists = existingInventory.halls.some(hall => hall.name === hallName && hall.sections.some(section => section.name === sectionName));

                if (sectionExists) {
                    const rackExists = existingInventory.halls.some(hall => hall.name === hallName && hall.sections.some(section => section.name === sectionName && section.racks && section.racks.some(rack => rack.name === rackName)));

                    if (rackExists) {
                        const shelfExists = existingInventory.halls.some(hall => hall.name === hallName && hall.sections.some(section => section.name === sectionName && section.racks && section.racks.some(rack => rack.name === rackName && rack.shelfs && rack.shelfs.some(shelf => shelf.name === shelfName))));

                        if (shelfExists) {
                            arr.push("Już istnieje.");
                            return true;
                        }
                    }
                }
            }

            return false;
        }

        return false;
    } catch (error) {
        console.error('Błąd podczas sprawdzania unikalności nazwy półki:', error);
        throw error;
    }
}

async function qrCodeUnique(arr, qrCode) { 
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

async function nameUnique(arr, name) {
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
        console.error('Błąd podczas pobierania użytkownika:', error);
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
        console.error('Błąd podczas pobierania tabeli:', error);
        throw error;
    }
}

async function getTableByName(qrCode){
    try {
        const existingTable =  await db.Global.findOne({ name: qrCode }).exec();
        if(existingTable){
            return existingTable;
        }else {
            return false;
        }
    } catch (error) {
        console.error('Błąd podczas pobierania tabeli:', error);
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
            $unwind: { path: '$halls.sections.racks.shelfs' }
          },
          {
            $match: { "name": name }
          },
        {
          $project: {

            _id: 0,
            qrCode: '$halls.sections.racks.shelfs.product.qrCode',
            name: '$halls.sections.racks.shelfs.product.name',
            quantity: '$halls.sections.racks.shelfs.product.quantity',
            newQuantity: '$halls.sections.racks.shelfs.product.newQuantity',
            employee: '$halls.sections.racks.shelfs.product.employee',
            updated_at: '$halls.sections.racks.shelfs.product.updated_at'
          }
        }
      ];
      
      const result = await db.Global.aggregate(pipeline);

      return result;
}

async function getAllPositions(name) {
    const pipeline = [
        {
            $unwind: { path: '$halls', preserveNullAndEmptyArrays: true }
          },
          {
            $unwind: { path: '$halls.sections', preserveNullAndEmptyArrays: true }
          },
          {
            $unwind: { path: '$halls.sections.rooms', preserveNullAndEmptyArrays: true }
          },
          {
            $unwind: { path: '$halls.sections.rooms.products'}
          },
          {
            $match: { "name": name }
          },
        {
          $project: {

            _id: 0,
            productOwner: '$halls.sections.rooms.products.productOwner',
            qrCode: '$halls.sections.rooms.products.qrCode',
            name: '$halls.sections.rooms.products.name',
            quantity: '$halls.sections.rooms.products.quantity',
            newQuantity: '$halls.sections.rooms.products.newQuantity',
            employee: '$halls.sections.rooms.products.employee',
            updated_at: '$halls.sections.rooms.products.updated_at'
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
        console.error('Błąd podczas dodawania hali:', error);
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
        console.error('Błąd podczas dodawania sekcji:', error);
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
        console.error('Błąd podczas dodawania regału:', error);
        throw error;
    }
}

async function addRoom(listName, hallName, sectionName, roomName, roomOwners) {
    try {
        const tableName = await db.Global.findOne({ name: listName }).exec();
        if (tableName) {
            for (let index = 0; index < tableName.halls.length; index++) {
                if (tableName.halls[index].name == hallName) {
                    for (let i = 0; i < tableName.halls[index].sections.length; i++) {
                        if (tableName.halls[index].sections[i].name == sectionName) {
                            tableName.halls[index].sections[i].rooms.push({
                                name: roomName,
                                roomOwners: roomOwners.map(ownerId => ({ id: ownerId })),
                            });
                            await tableName.save();
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    } catch (error) {
        console.error('Błąd podczas dodawania pokoju:', error);
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
        console.error('Błąd podczas dodawania półki:', error);
        throw error;
    }
}

module.exports = { changePassword, add, removeUser, addProduct, addProducts, findPosition, getAllProducts, getAllPositions, updateProduct, updatePosition, updateWH, updateIN, addInstitution, removeTable, removeHall, removeSection, removeRack, removeRoom, removeShelf, removeProduct, findProduct, removePosition, addWarehouse, usernameUnique, warehouseNameUnique, institutionNameUnique, hallNameUnique, sectionNameUnique, rackNameUnique, roomNameUnique, shelfNameUnique, qrCodeUnique, nameUnique, getUserById, getTableById, getTableByName, getUsers, getTables, addHall, addSection, addRack, addRoom, addShelf};
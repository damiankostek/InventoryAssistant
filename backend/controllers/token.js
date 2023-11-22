const db = require("./database");

async function addToken(userID) {
    try {
        let token = generateToken();
        while(await checkToken(token)){
            token = generateToken();
        }
            
        newToken = new db.Token({ 
            userID,
            token
        });
        await newToken.save();
        console.log('Token dodany dla usera '+userID+'.');
        return token;
    } catch (error) {
        console.error('Błąd podczas dodawania tokenu:', error);
        return false;
    }
}
function removeToken(token) {
    console.log('token2 '+token);
    db.Token.findOneAndDelete({ token: token })
        .then((doc) => {
            if (doc) {
                console.log('Usunięto token:', token);
            } else {
                console.log('Nie znaleziono tokenu:', token);
            }
        })
        .catch((err) => {
            console.error('Błąd podczas usuwania elementu:', err);
        });
}
function generateToken() {
    const signs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
  
    for (let i = 0; i < 30; i++) {
        const randomIndex = Math.floor(Math.random() * signs.length);
        token += signs.charAt(randomIndex);
    }
  
    return token;
}
async function getTokenByUserID(userID) {
    try {
        const findToken = await db.Token.findOne({ userID: userID }).exec();
        if (findToken){
            console.log('Znaleziony token:', findToken.token);
        }else{
            console.log('Nie znaleziono tokenu dla: ', userID);
        }
        return findToken.token;
    } catch (error) {
        console.error('Błąd podczas wyszukiwania tokenu:', error);
    }
}
async function getUserIDByToken(token) {
    try {
        const findUserID = await db.Token.findOne({ token: token }).exec();
        if (findUserID){
            console.log('Znaleziony userID:', findUserID.userID);
        }else{
            console.log('Nie znaleziono userID dla: ', token);
        }
        return findUserID.userID;
    } catch (error) {
        console.error('Błąd podczas wyszukiwania userID:', error);
    }
}
async function checkToken(token) {
    try {
        const findToken = await db.Token.findOne({ token: token }).exec();
        if (findToken){
            return true;
        }
        return false;
    } catch (error) {
        console.error('Błąd podczas wyszukiwania userID:', error);
    }
}
async function removeOld(min) {
    const time = new Date();
    time.setMinutes(time.getMinutes() - min);
  
    try {
        const wynik = await db.Token.deleteMany({ created_at: { $lt: time } });
        wynik>0?console.log('Usunięto', wynik.deletedCount, 'elementów.'):null;
    } catch (error) {
        console.error('Błąd podczas usuwania elementów:', error);
    }
}

module.exports = { addToken,getTokenByUserID,getUserIDByToken,checkToken,removeToken,removeOld };
const fs = require('fs/promises');
const db = require('./db.json');
const bcrypt = require('bcrypt');

async function saveDb() {
    const data = JSON.stringify(db);

    await fs.writeFile('./db.json', data);
}

async function registerUser(username, password){
    if(db.users.some(x => x.username == username)){
        throw 'Username already exist!'
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    db.users.push({
        username,
        password: hash
    });

    await saveDb();
}


async function loginUser(username, password){
    const user = db.users.find(x => x.username == username);
    
    if(!user) {
        throw 'Username or pass are wrong!';
    }

    const isAuthenticated = await bcrypt.compare(password, user.password);

    if(!isAuthenticated) {
        throw 'Username or pass are wrong!';
    }

    return user;
}

module.exports = {
    registerUser,
    loginUser
}
const fs = require('fs');

const newId = () => {
    return (Math.random()*100000).toString().slice(-4);
}

let data = JSON.parse(fs.readFileSync('./services/data.json'));

function getAll() {
    return data;
}

function getById(id) {
    return data.find(x => x.id == id);
}

function createItem(item) {
    const createdItem = { ...item, id: newId()};

    data.push(createdItem);

    fs.writeFile('./services/data.json', JSON.stringify(data), () => {
        console.log(`created item >>> { name: ${createdItem.name}, price: ${createdItem.price} }`);
    });
}

function editItemById(id, newItem) {
    data = data.map(x => x.id == id ? {id: x.id, ...newItem} : {...x});
}

function deleteById(id) {
    data = data.filter(x => x.id != id);
    
    fs.writeFile('./services/data.json', JSON.stringify(data), () => {
        console.log(`deleted item with id ${id}`);
    });
}

function checkId(id) {
    return data.some(x => x.id == id);
}
 
module.exports = {
    getAll,
    getById,
    createItem,
    editItemById,
    deleteById,
    checkId
}

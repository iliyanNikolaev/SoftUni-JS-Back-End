const homeController = require('../controllers/homeController');
const cubeController = require('../controllers/cubeController');
const accessoryController = require('../controllers/accessoryController');
const authController = require('../controllers/authController');

function setupRoutes(app) {
    app.use(homeController);
    app.use(cubeController);
    app.use('/accessory', accessoryController);
    app.use(authController);
}

module.exports = setupRoutes;


const express = require('express');
const hbs = require('express-handlebars').create({
    extname: '.hbs'
});
const cookieParser = require('cookie-parser');
const defaultTitle = require('../middlewares/defaultTitle');
const auth = require('../middlewares/auth');

const jwtSecret = 'mysecredword0227';


module.exports = (app) => {
    app.engine('.hbs', hbs.engine);
    app.set('view engine', '.hbs');
    app.use(express.urlencoded({ extended: true })); // forms
    app.use('/static', express.static('static'));
    app.use(cookieParser());
    app.use(auth(jwtSecret));
    app.use(defaultTitle('SoftUni Default Title'));
}
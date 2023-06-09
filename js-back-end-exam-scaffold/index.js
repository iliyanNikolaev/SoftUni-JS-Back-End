const express = require('express');
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const routes = require('./routes');
const { authentication } = require('./middlewares/authenticationMiddleware');

const app = express();

app.engine('hbs', handlebars.engine({
    extname: 'hbs'
}));

app.set('view engine', 'hbs');

app.use('/static', express.static('static'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(authentication);
app.use(routes);

//TODO: change database name
mongoose.set('strictQuery', false); 
mongoose.connect('mongodb://127.0.0.1:27017/crypto');

app.listen(3000, () => console.log('Server is listenning on port 3000...'));
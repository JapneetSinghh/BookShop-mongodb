const express = require('express');
const path = require('path');

const app = express();
// MAKING THE CSS FOLDER PUBLIC
app.use(express.static(path.join(__dirname, 'public')));

// SETTING THE VIEW ENGINE EJS
app.set('view engine', 'ejs');
app.set('views', 'views');


// Adding Body Parser
const bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({extended:false}))

// Import routes
const adminRoutes = require('./routers/admin');
const shopRoutes = require('./routers/shop');
app.use(shopRoutes.routes);
app.use(adminRoutes.routes);

// ADDING ERRPR 404 PAGE
const errorController = require('./controller/error')
app.use(errorController.get404);


// STARTING THE SERVER
app.listen(2100);
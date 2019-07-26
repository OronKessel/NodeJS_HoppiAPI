var express = require('express');
const app = require('express')();
var session = require('express-session')
const bodyParser = require("body-parser");
var database = require("./src/utils/database")

database.connectDatabase();
app.set('view engine','ejs');
app.use(express.static(__dirname + '/assets'));
// app.use(bodyParser.urlencoded({
//     extended: true
// }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
// app.use(express.urlencoded());

// // Parse JSON bodies (as sent by API clients)
// app.use(express.json());

app.use(session({
    secret: 'hoppi',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));
var routes = require('./routes/routes')
routes(app);
app.listen(3000)
console.log('Started Hoppi Server');
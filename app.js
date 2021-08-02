const express = require('express');
const hbs = require("hbs");
const multer  = require("multer");

const homeRouter = require('./routes/homeRouter');

require('dotenv').config()

const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({extended: true});
const {PORT, HOST} = process.env;
const app = express();


// путь к шаблонным частям
hbs.registerPartials(__dirname + "/views/partials");

app.set("view engine", "hbs");

// путь к статик файлам
app.use(express.static(__dirname+'/public'));

app.use(multer({dest:"uploads"}).fields([{ name: 'fileDocx', maxCount: 1 }, { name: 'fileJson', maxCount: 1 }]));


app.use('/', urlencodedParser,homeRouter);


app.listen(PORT, HOST, ()=>{
    console.log(`Сервер стартовал на http://${HOST}:${PORT}`);
});
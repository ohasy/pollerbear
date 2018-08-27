const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const path = require('path');
var http = require('http');
var https = require('https');

// const publicPath = path.join(__dirname, './views/layouts');
const api_v1 = require("./routes/api_v1/router_v1");
//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// app.get('/check', function(req, res){
//    if(req.session.page_views){
//       req.session.page_views++;
//       res.send("You visited this page " + req.session.page_views + " times");
//    } else {
//       req.session.page_views = 1;
//       res.send("Welcome to this page for the first time!");
//    }
// });
// app.listen(3000);

//DB Config
const db = require("./config/keys").mongoURI;

//connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("Mongo DB connected."))
  .catch(err => console.log("Error message: ", err))


// Register Handlebars view engine
app.engine('.hbs', exphbs({defaultLayout:'main',extname:'.hbs'}));
// Use .handlebars view engine
app.set('view engine', '.hbs');
//const publicPath = path.join(__dirname, './views');
// app.use('/', express.static(publicPath));
// app.get('/', (req, res) => {
//   res.render('index');

// });

// app.get('/answer', (req, res) => {
//   res.render('answer');
// });

// app.get('/poll', (req, res) => {
//   res.render('polls');
// });
//api v1 routes
app.use("/",api_v1);
const port = process.env.PORT || 3000;
const localHost =require("./config/keys").localhostURI;

const host = process.env.HOST || localHost;
app.listen(port,host, () => {
  console.log('app is running → PORT 3000');
});

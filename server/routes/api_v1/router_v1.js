const express = require("express");
const router = express.Router();
const polls = require("./polls");

const path = require('path');
const publicPath = path.join(__dirname, '../../views/layouts');
router.use('/poll',polls);
router.use('/', express.static(publicPath));

//router.engine('.hbs', exphbs({defaultLayout:'main',extname:'.hbs'}));
// Use .handlebars view engine
//router.set('view engine', '.hbs');

module.exports = router;
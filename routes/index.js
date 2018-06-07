var express = require('express');
var router = express.Router();
var path = require("path");
//var app = express();
//app.use(express.static(__dirname + '/../public/views'));

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  //res.sendFile(path.join(__dirname + '/../public/views/index.html'));
  res.render('index');
});

module.exports = router;


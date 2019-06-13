var express = require('express');
var router = express.Router();
var path = require("path");
var db = require('../utils/database');
var config = require('../utils/config');
//var app = express();
//app.use(express.static(__dirname + '/../public/views'));

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  //res.sendFile(path.join(__dirname + '/../public/views/index.html'));
  res.render('index');
});

router.get('/products', function(req, res){
    console.log("start");
  res.setHeader('Content-Type', 'application/json');
    res.status(500);
    //db.saveNetworkLog("Client", "BackEnd", req.query);
    //if (req.query != undefined && req.query.type != undefined){
    
    db.getProductsByVehicleType(req.query.type.toUpperCase(), function(err, result){
      if (err){
        res.status(400).json({error: "Invalid request"});
        return;
      }
      var highways = [];
      var yearlyCounty = [];
      result.forEach(item => {
        if (item.productCounty != null){
          console.log("productCounty nem null");
          console.log(item.productCounty);
          yearlyCounty.push(item);
        } else {
          highways.push(item);
        }
      });
      var resp = { highways: highways,
      yearlyCounty: yearlyCounty };
      var respJson = JSON.stringify(resp);
          db.saveNetworkLog("BackEnd", "Client", respJson);
          res.status(200).json(resp);
    });
  
  
})

module.exports = router;


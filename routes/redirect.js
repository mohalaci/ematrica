var express = require('express');
var router = express.Router();
var path = require("path");
var ejs = require('ejs');
var async = require('async');
var db = require('../utils/database');


router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    //res.sendFile(path.join(__dirname + '/../public/views/index.html'));
    res.render('index');
  });

/*router.get('/', function(req, res, next){
    var dbResult;
    async.series([
        function (callback) {
            db.getNetworkData(function (err, result) {
                if (err) {
                    dbResult = { status: "FAILED" }
                    return callback(dbResult)
                }
                dbResult = result
                callback()
            })
        }], function (err) {
            res.setHeader('Content-Type', 'text/html')
            if (!err) {
                res.status(200);
                var rows = [];
                dbResult.forEach(item => {
                    var row = {
                        happenedAt : item.happenedAt,
                        type : item.type,
                        body : item.body
                    };
                    rows.push(row);
                });
                res.render('callbacks', { callbackRows: rows });
            } else {
                res.status(500);
                res.end;
            }
        })
})*/

module.exports = router;
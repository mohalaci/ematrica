var express = require('express');
var router = express.Router();
var path = require("path");
var ejs = require('ejs');
var async = require('async');
var db = require('../utils/database');


/* GET home page. */
router.post('/', function(req, res, next) {
    res.status(500);
    if (req != null){
        if (db == null || db == undefined) {
            console.log("db is null");
        } else {
            db.saveNetworkData(req.body);
            res.status(200);
        }
    }
    res.end();
});

router.get('/', function(req, res, next){
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
})

module.exports = router;
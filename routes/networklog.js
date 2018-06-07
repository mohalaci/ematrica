var express = require('express');
var router = express.Router();
var path = require("path");
var ejs = require('ejs');
var async = require('async');
var db = require('../utils/database');

router.get('/', function (req, res, next) {
    res.status(500);
    var dbResult;
    async.series([
        function (callback) {
            db.getNetworkData(function (err, result) {
                if (err) {
                    dbResult = { status: "FAILED" }
                    return callback(dbResult)
                } else {
                    dbResult = result
                    callback()
                }
            })
        }], function (err) {
            res.setHeader('Content-Type', 'text/html')
            if (!err) {
                console.log(dbResult.length);
                var rows = [];
                dbResult.forEach(item => {
                    var row = {
                        happenedAt: item.happenedAt,
                        from: item.from,
                        to: item.to,
                        body: item.body
                    };
                    rows.push(row);
                });
                res.status(200).render('networkLog', { callbackRows: rows });
            } else {
                res.status(500);
            }
        })
})

module.exports = router;
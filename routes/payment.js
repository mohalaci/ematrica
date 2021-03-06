var express = require('express');
var router = express.Router();
var path = require("path");
var ejs = require('ejs');
var async = require('async');
var db = require('../utils/database');
var bodyParser = require('body-parser');
var config = require('../utils/config');
const uuidv1 = require('uuid/v1');

var urlencodedParser = bodyParser.urlencoded({ extended: true });
app = express();
app.use(bodyParser.json());

var barion = new (require('barion-nodejs'))(BarionTest);

// Import BarionError
var BarionError = barion.BarionError;

// Import the built-in requestbuilders
var BarionRequestBuilderFactory = barion.BarionRequestBuilderFactory;
//var getPaymentStateRequestBuilder = BarionRequestBuilderFactory.BarionGetPaymentStateRequestBuilder();


router.get('/paymentState', function(req, res, next){
    res.setHeader('Content-Type', 'application/json');
    res.status(500);
    db.saveNetworkLog("Client", "BackEnd", req.query);
    var paymentId = req.query.paymentId
    console.log(paymentId)
    if (paymentId != null) {
        var getPaymentStateRequestBuilder = new BarionRequestBuilderFactory.BarionGetPaymentStateRequestBuilder();

        var getPaymentStateOptionsWithBuilder = getPaymentStateRequestBuilder
            .setPOSKey(config.shop.posKey)
            .setPaymentId(paymentId)
            .build();
console.log("megvan a requestguilder, indul a request")
        var paymentState;
        async.series([
        function (callback) {
            barion.getPaymentState(getPaymentStateOptionsWithBuilder, function (err, data) {
                if (err) {
                    console.log(err)
                    var respJson = JSON.stringify(err);
                    db.saveNetworkLog("BarionAPI", "BackEnd", respJson);
                    paymentData = "errror";
                    callback()
                } else {
                    console.log("getPaymentState result, data: ")
                    //console.log(data)
                    var respJson = JSON.stringify(data);
                    db.saveNetworkLog("BarionAPI", "BackEnd", respJson);
                    callback(data)
                }
            })
        }], function (data) {
            if (data) {
                res.status(200)
                var respJson = JSON.stringify(data);
                db.saveNetworkLog("BackEnd", "Client", respJson)
                console.log(JSON.stringify({ status: data.Status }))
                res.json({ status: data.Status })
            } else {
                res.status(400)
                res.json({ ERROR: "ERROR" })
            }
        })
    }
});

router.post('/start', urlencodedParser, function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.status(500);

    if (req.body == null || req.body == undefined) {
        var resp = { error: "body is null" };
        var respJson = JSON.stringify(resp);
        console.log(respJson);
        db.saveNetworkLog("BackEnd", "Client", respJson);
        res.status(400).json(resp);
        return;
    }
    console.log("lsdfslfsldfslfsdf");

    db.saveNetworkLog("Client", "Payment/Start", JSON.stringify(req.body));

    console.log(req.body);
    var vignettes = req.body.vIds;
    console.log(vignettes);
    for (var i=0;i<vignettes.length;i++){
        console.log(vignettes[i]);
    }
    db.getProductsById(req.body.vIds, function(err, product){
        console.log("callback function called");
        console.log(product);
        if (product != null){
            var paymentStartRequestBuilder = new BarionRequestBuilderFactory.BarionPaymentStartRequestBuilder();

            try {
        
                let locale = req.body.locale;
                if (locale == null || locale == undefined) {
                    var resp = { error: "locale is null" };
                    var respJson = JSON.stringify(resp);
                    db.saveNetworkLog("BackEnd", "Client", respJson);
                    res.status(400).json(resp);
                    return;
                }
        
                let currency = req.body.currency;
                if (currency == null || currency == undefined) {
                    var resp = { error: "currency is null" };
                    var respJson = JSON.stringify(resp);
                    db.saveNetworkLog("BackEnd", "Client", respJson);
                    res.status(400).json(resp);
                    return;
                }
        console.log("totalprice:")
        
                let totalPrice = 0;
                for (var i= 0;i<product.length;i++){
                    totalPrice += product[i].productUnitPrice;
                }
                if (totalPrice == null || totalPrice == undefined) {
                    var resp = { error: "totalPrice is null" };
                    var respJson = JSON.stringify(resp);
                    db.saveNetworkLog("BackEnd", "Client", respJson);
                    res.status(400).json(resp);
                    return;
                }
        
                var items = [];
                if (product != null && product != undefined) {
        
                    product.forEach(i => {
        
                        var name;
                        if (i.productCounty != null){
                            name = i.productName + " - " + i.productCounty;
                        } else {
                            name = i.productName;
                        }
                        let desc = i.productDescription;
                        let quantity = 1;
                        let unit = i.productUnit;
                        let unitPrice = i.productUnitPrice;
                        //let itemTotal = i.itemTotal;
        
                        let item = {
                            Name: name,
                            Description: desc,
                            Quantity: quantity,
                            Unit: unit,
                            UnitPrice: unitPrice,
                            ItemTotal: totalPrice
                        };
        
                        items.push(item);
        
                    });
        
                } else {
                    var resp = { error: "items array is null or empty" };
                    var respJson = JSON.stringify(resp);
                    db.saveNetworkLog("BackEnd", "Client", respJson);
                    res.status(400).json(resp);
                    return;
                }
        
                if (items.length == 0) {
                    var resp = { error: "items array is null or empty" };
                    var respJson = JSON.stringify(resp);
                    db.saveNetworkLog("BackEnd", "Client", respJson);
                    res.status(400).json(resp);
                    return;
                }
        
                let paymentRequestId = uuidv1();
                let posTransactionId = uuidv1();
                var paymentStartOptionsWithObject = {
                    POSKey: config.shop.posKey,
                    PaymentType: "Immediate",
                    GuestCheckOut: true,
                    FundingSources: ["All"],
                    PaymentRequestId: paymentRequestId,
                    Locale: locale,
                    Currency: currency,
                    CallbackUrl: config.shop.callbackUrl,
                    RedirectUrl: config.shop.redirectUrl,
                    Transactions: [
                        {
                            POSTransactionId: posTransactionId,
                            Payee: config.shop.payee,
                            Total: totalPrice,
                            Items: items
                        }
                    ]
                };
        
                var paymentResponseData;
                async.series([
                    function (callback) {
                        let reqJson = JSON.stringify(paymentStartOptionsWithObject);
                        db.saveNetworkLog("BackEnd", "BarionAPI", reqJson);
                        barion.startPayment(paymentStartOptionsWithObject, function (err, data) {
                            if (err) {
                                callback(err.errors);
                            } else {
                                paymentResponseData = data;
                                callback();
                            }
                        })
                    }], function (data) {
        
                        if (!data) {
                            let respJson = JSON.stringify(paymentResponseData);
                            db.saveNetworkLog("BarionAPI", "BackEnd", respJson);
                            res.status(200).json({ paymentId: paymentResponseData.PaymentId });
                        } else {
                            db.saveNetworkLog("BarionAPI", "BackEnd", JSON.stringify(data));
                            res.json({ error: data });
                        }
                    })
        
            } catch (e) {
                console.log(e);
                var resp = { error: "Unknown error" };
                var respJson = JSON.stringify(resp);
                db.saveNetworkLog("BackEnd", "Client", respJson);
                res.json(resp);
        
            }
        }
    });
    


    
});

module.exports = router;
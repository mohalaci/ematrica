
var mongo = require('mongodb');
var db = mongo.MongoClient;
var networkDb = "mongodb://localhost:27017/network";
var ematricaDb = "mongodb://localhost:27017/ematrica";

function getProductsById(selectedProductIds, callback){
    console.log("getProductById started");
    console.log(selectedProductIds);
    //var obj_ids = selectedProductIds.map(function(id){
      //  return ObjectId(id);
    //});
    //console.log(obj_ids);
    //var ids = selectedProductIds.toArray();
    db.connect(ematricaDb, function(err, database){
        if (err){
            console.log(err);
            return;
        }
        var dBase = database.db("ematrica");

        var resultData = new Array();
        var cursor = dBase.collection("products").find();
        //console.log(cursor.length);
        //var a = cursor.map(it => selectedProductIds.filter(p => it.productId == p));
        //console.log(a);
        cursor.each(function (err, item) {
            if (err || item == null) {
                database.close();
                console.log("done");
                console.log(resultData.length);
                if (resultData.length > 0) {
                    callback(null, resultData);
                } else {
                    callback(err);
                }
            } else {
                var f = selectedProductIds.filter(p => item.productId == p);
                
                if (f.length > 0){
                    var data = {
                        productId: item.productId,
                        productName: item.productName,
                        productType: item.productType,
                        productDescription: item.productDescription,
                        productUnit: item.productUnit,
                        productUnitPrice: item.productUnitPrice,
                        productCurrency: item.productCurrency
                    }
                    if (resultData.indexOf(data) == -1){
                        resultData.push(data);
                    }
                    //resultData.push(data)
                }
                
            }
        })
        
    }); 
}

function initProductsIfNotExist(){
    db.connect(ematricaDb, function(err, database){
        if (err){
            //console.log(err);
            return;
        }
        var dBase = database.db("ematrica");
        //console.log("dBase created");
        var isExists = false;
        console.log("start");
        dBase.listCollections().toArray(function(err, colls){
            console.log(colls.length);
            if (err){
                console.log(err);
            }
            for (let i = 0; i < colls.length; i++){
                console.log(colls[i]);
                if (colls[i].name == "products"){
                    isExists = true;
                }
            }
            console.log("initdata");
        if (!isExists){
            console.log("isExists is false;");
            //dBase.createCollection("products");
            dBase.collection("products").insertMany([{
                productId: "D1-01",
                productName: "10 napos matrica",
                productType: "D1",
                productDescription: "D1 - 10 napos matrica",
                productUnit: "db",
                productUnitPrice: 2975,
                productCurrency: "HUF"
            },{
                productId: "D1-02",
                productName: "Havi matrica",
                productType: "D1",
                productDescription: "D1 - havi matrica",
                productUnit: "db",
                productUnitPrice: 4780,
                productCurrency: "HUF"
            },{
                productId: "D1-03",
                productName: "Éves országos matrica",
                productType: "D1",
                productDescription: "D1 - Éves országos matrica",
                productUnit: "db",
                productUnitPrice: 42980,
                productCurrency: "HUF"
            },{
                productId: "D1-04",
                productName: "Éves megyei matrica",
                productType: "D1",
                productDescription: "D1 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "D2-01",
                productName: "10 napos matrica",
                productType: "D2",
                productDescription: "D2 - 10 napos matrica",
                productUnit: "db",
                productUnitPrice: 5950,
                productCurrency: "HUF"
            },{
                productId: "D2-02",
                productName: "Havi matrica",
                productType: "D2",
                productDescription: "D2 - havi matrica",
                productUnit: "db",
                productUnitPrice: 9560,
                productCurrency: "HUF"
            },{
                productId: "D2-03",
                productName: "Éves országos matrica",
                productType: "D2",
                productDescription: "D2 - Éves országos matrica",
                productUnit: "db",
                productUnitPrice: 42980,
                productCurrency: "HUF"
            },{
                productId: "D2-04",
                productName: "Éves megyei matrica",
                productType: "D2",
                productDescription: "D2 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 10000,
                productCurrency: "HUF"
            },{
                productId: "U-01",
                productName: "10 napos matrica",
                productType: "U",
                productDescription: "U - 10 napos matrica",
                productUnit: "db",
                productUnitPrice: 2975,
                productCurrency: "HUF"
            },{
                productId: "U-02",
                productName: "Havi matrica",
                productType: "U",
                productDescription: "U - havi matrica",
                productUnit: "db",
                productUnitPrice: 4780,
                productCurrency: "HUF"
            },{
                productId: "U-03",
                productName: "Éves országos matrica",
                productType: "U",
                productDescription: "U - Éves országos matrica",
                productUnit: "db",
                productUnitPrice: 42980,
                productCurrency: "HUF"
            },{
                productId: "U-04",
                productName: "Éves megyei matrica",
                productType: "U",
                productDescription: "U - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "B2-01",
                productName: "10 napos matrica",
                productType: "B2",
                productDescription: "B2 - 10 napos matrica",
                productUnit: "db",
                productUnitPrice: 13385,
                productCurrency: "HUF"
            },{
                productId: "B2-02",
                productName: "Havi matrica",
                productType: "B2",
                productDescription: "B2 - havi matrica",
                productUnit: "db",
                productUnitPrice: 21975,
                productCurrency: "HUF"
            },{
                productId: "B2-03",
                productName: "Éves országos matrica",
                productType: "B2",
                productDescription: "B2 - Éves országos matrica",
                productUnit: "db",
                productUnitPrice: 199975,
                productCurrency: "HUF"
            },{
                productId: "B2-04",
                productName: "Éves megyei matrica",
                productType: "B2",
                productDescription: "B2 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 20000,
                productCurrency: "HUF"
            },{
                productId: "D1M-01",
                productName: "10 napos matrica",
                productType: "D1M",
                productDescription: "D1M - 10 napos matrica",
                productUnit: "db",
                productUnitPrice: 1470,
                productCurrency: "HUF"
            },{
                productId: "D1M-02",
                productName: "Havi matrica",
                productType: "D1M",
                productDescription: "D1M - havi matrica",
                productUnit: "db",
                productUnitPrice: 2500,
                productCurrency: "HUF"
            }]);
        }
        database.close();
        });
        
    });
}

function saveNetworkLog(from, to, body){
    var data = {
        HappenedAt: new Date().toISOString(),
        From: from,
        To: to,
        Body: body
    }
    saveNetworkData(data);
}

function saveNetworkData(data){
    db.connect(networkDb, function (err, database) {
        if (err) {
            console.log(err);
            return;
        }
        var dBase = database.db("network")
        dBase.collection("network").insertOne(data, function (err, res) {
            if (err) {
                console.log(err);
                database.close();
                return;
            }
            database.close();
        })
    })
}

function getNetworkData(callback){
    db.connect(networkDb, function (err, database) {
        var resultData = [];
        if (err) {
            console.log(err);
            return;
        }
        var dBase = database.db("network")
        var cursor = dBase.collection("network").find().sort( { HappenedAt: -1 } )//.limit(1000)
        cursor.each(function (err, item) {
            if (err || item == null) {
                database.close();
                if (resultData.length > 0) {
                    callback(null, resultData);
                } else {
                    callback(err);
                }
            } else {
                var data = {
                    happenedAt: item.HappenedAt,
                    from: item.From,
                    to: item.To,
                    body: item.Body
                }
                resultData.push(data)
            }
        })
    })
}

module.exports.getNetworkData = getNetworkData;
module.exports.saveNetworkData = saveNetworkData;
module.exports.saveNetworkLog = saveNetworkLog;
module.exports.initProductsIfNotExist = initProductsIfNotExist;
module.exports.getProductsById = getProductsById;
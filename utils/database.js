
var mongo = require('mongodb');
var db = mongo.MongoClient;
var networkDb = "mongodb://localhost:27017/network";
var ematricaDb = "mongodb://localhost:27017/ematrica";

function getProductsByVehicleType(selectedVehicleType, callback){
    db.connect(ematricaDb, function(err, database){
        if (err){
            console.log(err);
            callback(err, null);
            return;
        }
        var dBase = database.db("ematrica");
        var resultData = new Array();
        var cursor = dBase.collection("products").find({'productAvailableCategory' : selectedVehicleType});
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
                //console.log("item:");
                //console.log(item);
                var data = {
                    productId: item.productId,
                    productName: item.productName,
                    productCounty: item.productCounty,
                    productType: item.productType,
                    productDescription: item.productDescription,
                    productUnit: item.productUnit,
                    productUnitPrice: item.productUnitPrice,
                    productCurrency: item.productCurrency
                }
                if (resultData.indexOf(data) == -1){
                    resultData.push(data);
                }
                
            }
        })
    })
}

function getProductsById(selectedProductIds, callback){
    console.log("getProductById started");
    console.log(selectedProductIds);
    
    db.connect(ematricaDb, function(err, database){
        if (err){
            console.log(err);
            return;
        }
        var dBase = database.db("ematrica");

        var resultData = new Array();
        var cursor = dBase.collection("products").find();
        
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
        if (isExists){
            console.log("drop old products table");
            dBase.collection("products").remove({});
            isExists = false;
        }
        if (!isExists){
            console.log("isExists is false;");
            //dBase.createCollection("products");
            dBase.collection("products").insertMany([{
                productId: "D1-01",
                productName: "10 napos matrica",
                productType: "D1",
                productAvailableCategory: ["CAR", "TRAILER"],
                productDescription: "D1 - 10 napos matrica",
                productUnit: "db",
                productUnitPrice: 2975,
                productCurrency: "HUF"
            },{
                productId: "D1-02",
                productName: "Havi matrica",
                productType: "D1",
                productAvailableCategory: ["CAR", "TRAILER","MOTOR"],
                productDescription: "D1 - havi matrica",
                productUnit: "db",
                productUnitPrice: 4780,
                productCurrency: "HUF"
            },{
                productId: "D1-03",
                productName: "Éves országos matrica",
                productType: "D1",
                productAvailableCategory: ["CAR", "TRAILER", "MOTOR"],
                productDescription: "D1 - Éves országos matrica",
                productUnit: "db",
                productUnitPrice: 42980,
                productCurrency: "HUF"
            },{
                productId: "D1-04-01",
                productCounty: "Baranya",
                productName: "Éves megyei matrica",
                productType: "D1",
                productAvailableCategory: ["CAR", "TRAILER", "MOTOR"],
                productDescription: "D1 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "D1-04-02",
                productCounty: "Borsod-Abaúj-Zemplén",
                productName: "Éves megyei matrica",
                productType: "D1",
                productAvailableCategory: ["CAR", "TRAILER", "MOTOR"],
                productDescription: "D1 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "D1-04-03",
                productCounty: "Bács-Kiskun",
                productName: "Éves megyei matrica",
                productType: "D1",
                productAvailableCategory: ["CAR", "TRAILER", "MOTOR"],
                productDescription: "D1 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "D1-04-04",
                productCounty: "Csongrád",
                productName: "Éves megyei matrica",
                productType: "D1",
                productAvailableCategory: ["CAR", "TRAILER", "MOTOR"],
                productDescription: "D1 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "D1-04-05",
                productCounty: "Fejér",
                productName: "Éves megyei matrica",
                productType: "D1",
                productAvailableCategory: ["CAR", "TRAILER", "MOTOR"],
                productDescription: "D1 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "D1-04-06",
                productCounty: "Győr-Moson-Sopron",
                productName: "Éves megyei matrica",
                productType: "D1",
                productAvailableCategory: ["CAR", "TRAILER", "MOTOR"],
                productDescription: "D1 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "D1-04-07",
                productCounty: "Heves",
                productName: "Éves megyei matrica",
                productType: "D1",
                productAvailableCategory: ["CAR", "TRAILER", "MOTOR"],
                productDescription: "D1 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "D1-04-08",
                productCounty: "Hajdú-Bihar",
                productName: "Éves megyei matrica",
                productType: "D1",
                productAvailableCategory: ["CAR", "TRAILER", "MOTOR"],
                productDescription: "D1 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "D1-04-09",
                productCounty: "Komárom-Esztergom",
                productName: "Éves megyei matrica",
                productType: "D1",
                productAvailableCategory: ["CAR", "TRAILER", "MOTOR"],
                productDescription: "D1 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "D1-04-10",
                productCounty: "Pest",
                productName: "Éves megyei matrica",
                productType: "D1",
                productAvailableCategory: ["CAR", "TRAILER", "MOTOR"],
                productDescription: "D1 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "D1-04-11",
                productCounty: "Somogy",
                productName: "Éves megyei matrica",
                productType: "D1",
                productAvailableCategory: ["CAR", "TRAILER", "MOTOR"],
                productDescription: "D1 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "D1-04-12",
                productCounty: "Szabolcs-Szatmár-Bereg",
                productName: "Éves megyei matrica",
                productType: "D1",
                productAvailableCategory: ["CAR", "TRAILER", "MOTOR"],
                productDescription: "D1 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "D1-04-13",
                productCounty: "Tolna",
                productName: "Éves megyei matrica",
                productType: "D1",
                productAvailableCategory: ["CAR", "TRAILER", "MOTOR"],
                productDescription: "D1 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "D1-04-14",
                productCounty: "Vas",
                productName: "Éves megyei matrica",
                productType: "D1",
                productAvailableCategory: ["CAR", "TRAILER", "MOTOR"],
                productDescription: "D1 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "D1-04-15",
                productCounty: "Veszprém",
                productName: "Éves megyei matrica",
                productType: "D1",
                productAvailableCategory: ["CAR", "TRAILER", "MOTOR"],
                productDescription: "D1 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "D1-04-16",
                productCounty: "Zala",
                productName: "Éves megyei matrica",
                productType: "D1",
                productAvailableCategory: ["CAR", "TRAILER", "MOTOR"],
                productDescription: "D1 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "D2-01",
                productName: "10 napos matrica",
                productType: "D2",
                productAvailableCategory: ["TRUCK", "VAN"],
                productDescription: "D2 - 10 napos matrica",
                productUnit: "db",
                productUnitPrice: 5950,
                productCurrency: "HUF"
            },{
                productId: "D2-02",
                productName: "Havi matrica",
                productType: "D2",
                productAvailableCategory: ["TRUCK", "VAN"],
                productDescription: "D2 - havi matrica",
                productUnit: "db",
                productUnitPrice: 9560,
                productCurrency: "HUF"
            },{
                productId: "D2-03",
                productName: "Éves országos matrica",
                productType: "D2",
                productAvailableCategory: ["TRUCK", "VAN"],
                productDescription: "D2 - Éves országos matrica",
                productUnit: "db",
                productUnitPrice: 42980,
                productCurrency: "HUF"
            },{
                productId: "D2-04-01",
                productCounty: "Baranya",
                productName: "Éves megyei matrica",
                productType: "D2",
                productAvailableCategory: ["TRUCK", "VAN"],
                productDescription: "D2 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 10000,
                productCurrency: "HUF"
            },{
                productId: "D2-04-02",
                productCounty: "Borsod-Abaúj-Zemplén",
                productName: "Éves megyei matrica",
                productType: "D2",
                productAvailableCategory: ["TRUCK", "VAN"],
                productDescription: "D2 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 10000,
                productCurrency: "HUF"
            },{
                productId: "D2-04-03",
                productCounty: "Bács-Kiskun",
                productName: "Éves megyei matrica",
                productType: "D2",
                productAvailableCategory: ["TRUCK", "VAN"],
                productDescription: "D2 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 10000,
                productCurrency: "HUF"
            },{
                productId: "D2-04-04",
                productCounty: "Csongrád",
                productName: "Éves megyei matrica",
                productType: "D2",
                productAvailableCategory: ["TRUCK", "VAN"],
                productDescription: "D2 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 10000,
                productCurrency: "HUF"
            },{
                productId: "D2-04-05",
                productCounty: "Fejér",
                productName: "Éves megyei matrica",
                productType: "D2",
                productAvailableCategory: ["TRUCK", "VAN"],
                productDescription: "D2 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 10000,
                productCurrency: "HUF"
            },{
                productId: "D2-04-06",
                productCounty: "Győr-Moson-Sopron",
                productName: "Éves megyei matrica",
                productType: "D2",
                productAvailableCategory: ["TRUCK", "VAN"],
                productDescription: "D2 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 10000,
                productCurrency: "HUF"
            },{
                productId: "D2-04-07",
                productCounty: "Heves",
                productName: "Éves megyei matrica",
                productType: "D2",
                productAvailableCategory: ["TRUCK", "VAN"],
                productDescription: "D2 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 10000,
                productCurrency: "HUF"
            },{
                productId: "D2-04-08",
                productCounty: "Hajdú-Bihar",
                productName: "Éves megyei matrica",
                productType: "D2",
                productAvailableCategory: ["TRUCK", "VAN"],
                productDescription: "D2 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 10000,
                productCurrency: "HUF"
            },{
                productId: "D2-04-09",
                productCounty: "Komárom-Esztergom",
                productName: "Éves megyei matrica",
                productType: "D2",
                productAvailableCategory: ["TRUCK", "VAN"],
                productDescription: "D2 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 10000,
                productCurrency: "HUF"
            },{
                productId: "D2-04-09",
                productCounty: "Pest",
                productName: "Éves megyei matrica",
                productType: "D2",
                productAvailableCategory: ["TRUCK", "VAN"],
                productDescription: "D2 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 10000,
                productCurrency: "HUF"
            },{
                productId: "D2-04-10",
                productCounty: "Somogy",
                productName: "Éves megyei matrica",
                productType: "D2",
                productAvailableCategory: ["TRUCK", "VAN"],
                productDescription: "D2 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 10000,
                productCurrency: "HUF"
            },{
                productId: "D2-04-11",
                productCounty: "Szabolcs-Szatmár-Bereg",
                productName: "Éves megyei matrica",
                productType: "D2",
                productAvailableCategory: ["TRUCK", "VAN"],
                productDescription: "D2 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 10000,
                productCurrency: "HUF"
            },{
                productId: "D2-04-12",
                productCounty: "Tolna",
                productName: "Éves megyei matrica",
                productType: "D2",
                productAvailableCategory: ["TRUCK", "VAN"],
                productDescription: "D2 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 10000,
                productCurrency: "HUF"
            },{
                productId: "D2-04-13",
                productCounty: "Vas",
                productName: "Éves megyei matrica",
                productType: "D2",
                productAvailableCategory: ["TRUCK", "VAN"],
                productDescription: "D2 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 10000,
                productCurrency: "HUF"
            },{
                productId: "D2-04-14",
                productCounty: "Veszprém",
                productName: "Éves megyei matrica",
                productType: "D2",
                productAvailableCategory: ["TRUCK", "VAN"],
                productDescription: "D2 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 10000,
                productCurrency: "HUF"
            },{
                productId: "D2-04-15",
                productCounty: "Zala",
                productName: "Éves megyei matrica",
                productType: "D2",
                productAvailableCategory: ["TRUCK", "VAN"],
                productDescription: "D2 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 10000,
                productCurrency: "HUF"
            },{
                productId: "U-01",
                productName: "10 napos matrica",
                productType: "U",
                productAvailableCategory: ["TRAILER"],
                productDescription: "U - 10 napos matrica",
                productUnit: "db",
                productUnitPrice: 2975,
                productCurrency: "HUF"
            },{
                productId: "U-02",
                productName: "Havi matrica",
                productType: "U",
                productAvailableCategory: ["TRAILER"],
                productDescription: "U - havi matrica",
                productUnit: "db",
                productUnitPrice: 4780,
                productCurrency: "HUF"
            },{
                productId: "U-03",
                productName: "Éves országos matrica",
                productType: "U",
                productAvailableCategory: ["TRAILER"],
                productDescription: "U - Éves országos matrica",
                productUnit: "db",
                productUnitPrice: 42980,
                productCurrency: "HUF"
            },{
                productId: "U-04-01",
                productCounty: "Baranya",
                productName: "Éves megyei matrica",
                productType: "U",
                productAvailableCategory: ["TRAILER"],
                productDescription: "U - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "U-04-02",
                productCounty: "Borsod-Abaúj-Zemplén",
                productName: "Éves megyei matrica",
                productType: "U",
                productAvailableCategory: ["TRAILER"],
                productDescription: "U - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "U-04-03",
                productCounty: "Bács-Kiskun",
                productName: "Éves megyei matrica",
                productType: "U",
                productAvailableCategory: ["TRAILER"],
                productDescription: "U - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "U-04-04",
                productCounty: "Csongrád",
                productName: "Éves megyei matrica",
                productType: "U",
                productAvailableCategory: ["TRAILER"],
                productDescription: "U - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "U-04-05",
                productCounty: "Fejér",
                productName: "Éves megyei matrica",
                productType: "U",
                productAvailableCategory: ["TRAILER"],
                productDescription: "U - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "U-04-06",
                productCounty: "Győr-Moson-Sopron",
                productName: "Éves megyei matrica",
                productType: "U",
                productAvailableCategory: ["TRAILER"],
                productDescription: "U - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "U-04-07",
                productCounty: "Heves",
                productName: "Éves megyei matrica",
                productType: "U",
                productAvailableCategory: ["TRAILER"],
                productDescription: "U - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "U-04-08",
                productCounty: "Hajdú-Bihar",
                productName: "Éves megyei matrica",
                productType: "U",
                productAvailableCategory: ["TRAILER"],
                productDescription: "U - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "U-04-09",
                productCounty: "Komárom-Esztergom",
                productName: "Éves megyei matrica",
                productType: "U",
                productAvailableCategory: ["TRAILER"],
                productDescription: "U - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "U-04-09",
                productCounty: "Pest",
                productName: "Éves megyei matrica",
                productType: "U",
                productAvailableCategory: ["TRAILER"],
                productDescription: "U - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "U-04-10",
                productCounty: "Somogy",
                productName: "Éves megyei matrica",
                productType: "U",
                productAvailableCategory: ["TRAILER"],
                productDescription: "U - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "U-04-11",
                productCounty: "Szabolcs-Szatmár-Bereg",
                productName: "Éves megyei matrica",
                productType: "U",
                productAvailableCategory: ["TRAILER"],
                productDescription: "U - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "U-04-12",
                productCounty: "Tolna",
                productName: "Éves megyei matrica",
                productType: "U",
                productAvailableCategory: ["TRAILER"],
                productDescription: "U - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "U-04-13",
                productCounty: "Vas",
                productName: "Éves megyei matrica",
                productType: "U",
                productAvailableCategory: ["TRAILER"],
                productDescription: "U - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "U-04-14",
                productCounty: "Veszprém",
                productName: "Éves megyei matrica",
                productType: "U",
                productAvailableCategory: ["TRAILER"],
                productDescription: "U - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "U-04-15",
                productCounty: "Zala",
                productName: "Éves megyei matrica",
                productType: "U",
                productAvailableCategory: ["TRAILER"],
                productDescription: "U - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "B2-01",
                productName: "10 napos matrica",
                productType: "B2",
                productAvailableCategory: ["BUS"],
                productDescription: "B2 - 10 napos matrica",
                productUnit: "db",
                productUnitPrice: 13385,
                productCurrency: "HUF"
            },{
                productId: "B2-02",
                productName: "Havi matrica",
                productType: "B2",
                productAvailableCategory: ["BUS"],
                productDescription: "B2 - havi matrica",
                productUnit: "db",
                productUnitPrice: 21975,
                productCurrency: "HUF"
            },{
                productId: "B2-03",
                productName: "Éves országos matrica",
                productType: "B2",
                productAvailableCategory: ["BUS"],
                productDescription: "B2 - Éves országos matrica",
                productUnit: "db",
                productUnitPrice: 199975,
                productCurrency: "HUF"
            },{
                productId: "B2-04-01",
                productCounty: "Baranya",
                productName: "Éves megyei matrica",
                productType: "B2",
                productAvailableCategory: ["BUS"],
                productDescription: "B2 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 20000,
                productCurrency: "HUF"
            },{
                productId: "B2-04-02",
                productCounty: "Borsod-Abaúj-Zemplén",
                productName: "Éves megyei matrica",
                productType: "B2",
                productAvailableCategory: ["BUS"],
                productDescription: "B2 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 20000,
                productCurrency: "HUF"
            },{
                productId: "B2-04-03",
                productCounty: "Bács-Kiskun",
                productName: "Éves megyei matrica",
                productType: "B2",
                productAvailableCategory: ["BUS"],
                productDescription: "B2 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 20000,
                productCurrency: "HUF"
            },{
                productId: "B2-04-04",
                productCounty: "Csongrád",
                productName: "Éves megyei matrica",
                productType: "B2",
                productAvailableCategory: ["BUS"],
                productDescription: "B2 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 20000,
                productCurrency: "HUF"
            },{
                productId: "B2-04-05",
                productCounty: "Fejér",
                productName: "Éves megyei matrica",
                productType: "B2",
                productAvailableCategory: ["BUS"],
                productDescription: "B2 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 20000,
                productCurrency: "HUF"
            },{
                productId: "B2-04-06",
                productCounty: "Győr-Moson-Sopron",
                productName: "Éves megyei matrica",
                productType: "B2",
                productAvailableCategory: ["BUS"],
                productDescription: "B2 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 5000,
                productCurrency: "HUF"
            },{
                productId: "B2-04-07",
                productCounty: "Heves",
                productName: "Éves megyei matrica",
                productType: "B2",
                productAvailableCategory: ["BUS"],
                productDescription: "B2 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 20000,
                productCurrency: "HUF"
            },{
                productId: "B2-04-08",
                productCounty: "Hajdú-Bihar",
                productName: "Éves megyei matrica",
                productType: "B2",
                productAvailableCategory: ["BUS"],
                productDescription: "B2 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 20000,
                productCurrency: "HUF"
            },{
                productId: "B2-04-09",
                productCounty: "Komárom-Esztergom",
                productName: "Éves megyei matrica",
                productType: "B2",
                productAvailableCategory: ["BUS"],
                productDescription: "B2 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 20000,
                productCurrency: "HUF"
            },{
                productId: "B2-04-09",
                productCounty: "Pest",
                productName: "Éves megyei matrica",
                productType: "B2",
                productAvailableCategory: ["BUS"],
                productDescription: "B2 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 20000,
                productCurrency: "HUF"
            },{
                productId: "B2-04-10",
                productCounty: "Somogy",
                productName: "Éves megyei matrica",
                productType: "B2",
                productAvailableCategory: ["BUS"],
                productDescription: "B2 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 20000,
                productCurrency: "HUF"
            },{
                productId: "B2-04-11",
                productCounty: "Szabolcs-Szatmár-Bereg",
                productName: "Éves megyei matrica",
                productType: "B2",
                productAvailableCategory: ["BUS"],
                productDescription: "B2 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 20000,
                productCurrency: "HUF"
            },{
                productId: "B2-04-12",
                productCounty: "Tolna",
                productName: "Éves megyei matrica",
                productType: "B2",
                productAvailableCategory: ["BUS"],
                productDescription: "B2 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 20000,
                productCurrency: "HUF"
            },{
                productId: "B2-04-13",
                productCounty: "Vas",
                productName: "Éves megyei matrica",
                productType: "B2",
                productAvailableCategory: ["BUS"],
                productDescription: "B2 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 20000,
                productCurrency: "HUF"
            },{
                productId: "B2-04-14",
                productCounty: "Veszprém",
                productName: "Éves megyei matrica",
                productType: "B2",
                productAvailableCategory: ["BUS"],
                productDescription: "B2 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 20000,
                productCurrency: "HUF"
            },{
                productId: "B2-04-15",
                productCounty: "Zala",
                productName: "Éves megyei matrica",
                productType: "B2",
                productAvailableCategory: ["BUS"],
                productDescription: "B2 - Éves megyei matrica",
                productUnit: "db",
                productUnitPrice: 20000,
                productCurrency: "HUF"
            },{
                productId: "D1M-01",
                productName: "10 napos matrica",
                productType: "D1M",
                productAvailableCategory: ["MOTOR"],
                productDescription: "D1M - 10 napos matrica",
                productUnit: "db",
                productUnitPrice: 1470,
                productCurrency: "HUF"
            },{
                productId: "D1M-02",
                productName: "Havi matrica",
                productType: "D1M",
                productAvailableCategory: ["MOTOR"],
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
module.exports.getProductsByVehicleType = getProductsByVehicleType;
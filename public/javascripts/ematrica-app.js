var $productData;
var $vehicle = {
    licensePlate: "",
    type: "",
    countryCode: ""
};

var $data = {
    licensePlate: "",
    selectedVignette: "",
    selectedVignetteName: "",
    selectedVignetteId: "",
    selectedVignetteValidity: "",
    validityInfo: {
        from: "",
        to: ""
    },
    image: "",
    getValidityRange: function () {
        return this.validityInfo.from + " - " + this.validityInfo.to;
    },
    isComplete: function () {
        return this.licensePlate != "" && this.selectedVignetteId != "" && this.validityInfo.from != "" && this.validityInfo.to != "";
    }
}
var $dd;

var $highwaysVignetteTypes = [];
var $yearlyCountyVignetteTypes = [];

var $cSelectVehicleTemplate;
var $cSelectVignetteTemplate;
var $cSelectValidityTemplate;
var $cContentTemplate;
var $cVignetteTypesTemplate;

var $typeSelectVisible = false;
var $dateSelectVisible = false;

var app = new Framework7({
    root: '#app',
    name: 'My App',
    id: 'com.myapp.test',
    panel: {
        swipe: 'left',
    },
    routes: [
        {
            name: 'vignetteTypes',
            path: '/vignetteTypes/',
            url: '/',
            on: {
                pageInit: function (e, page) {
                    getVignetteTypesForVehicleCategory($vehicle.type, function callback(data){
                        $highwaysVignetteTypes = data.highways;
                        $yearlyCountyVignetteTypes = data.yearlyCounty;
                        var content = $cVignetteTypesTemplate(
                            {
                                highways: data.highways,
                                yearlyCounty: data.yearlyCounty
                            });
                        $$(".page-content").html(content);
                    });
                    
                    
                }
            }
        },
        {
            name: 'main',
            path: '/main/',
            page: 'main',
            url: '/', 
            on: {
                pageInit: function(e, page){
                    initMainPage();
                }
            }
        },
        {
            name: 'redirect',
            path: '/redirect/',
            page: 'redirect',
            on: {
                pageInit: function(e, page){
                    console.log("Loaded.");
                }
            }
        },
        
        {
            path: '/done/',
            url: '/done.html'
        },
        {
            path: '/failed/',
            url: '/failed'
        }
    ],
    navbar: {
        hideOnPageScroll: false,
        iosCenterTitle: true
    },
    statusbar: {
        enabled: true,
        overlay: true,
        iosOverlaysWebView: false,
        iosBackgroundColor: '#0097DB',
        materialBackgroundColor: '#0097DB'
    }
});

var $$ = Dom7;

var barionMarket = new BarionMarket();
var mainView = app.views.create('.view-main');
mainView.router.allowPageChange = true;

app.statusbar.setIosTextColor('white');
app.statusbar.setBackgroundColor('#0097DB');

app.on('init', function () {
    if ($$('html.device-ios').length > 0) {
        $$('body').scrollTop(20);
        $$('.view').scrollTop(20);
    } else {
        app.statusbar.hide();
        $$('body').scrollTop(20);
        $$('.view').scrollTop(20);
    }
});

function initMainPage() {
    
    var content = $cContentTemplate($data);
    $$(".page-content").html(content);
    showNextStep();

    var calendarModal = app.calendar.create({
        inputEl: '#changeValidityButton',
        openIn: 'customModal',
        minDate: new Date(),
        maxDate: new Date(new Date().getFullYear(), 11, 31),
        header: true,
        footer: true,
        animate: true,
        dateFormat: 'MM dd yyyy',
        on: {
            close: function (calendar) {
                if (calendar.value != undefined) {
                    var selectedDays = parseInt($data.selectedVignetteValidity);
                    var startDate = new Date(calendar.value[0]);
                    var endDate = new Date(calendar.value[0]);
                    if (selectedDays == 365) {
                        endDate = new Date((new Date().getFullYear() + 1) + "-01-31");
                        $$("#changeValidityButton").removeClass("item-link");
                        $$(".edit-validity").hide();
                    } else {
                        endDate.setDate(endDate.getDate() + selectedDays);
                        $$("#changeValidityButton").addClass("item-link");
                        $$(".edit-validity").show();
                    }

                    $data.validityInfo.from = startDate.toLocaleDateString("en-US");
                    $data.validityInfo.to = endDate.toLocaleDateString("en-US");
                    $$(".validity-range").text($data.getValidityRange());
                    showNextStep();
                }
            },
            open: function (calendar) {
                if ($data.selectedVignetteValidity == "365") {
                    calendar.close();
                }
            }
        }
    });   
}

function showNextStep() {
    $$('#selectVignetteSection').hide();
    $$('#selectValiditySection').hide();
    $$('#payWithBarionButton').hide();

    if ($data.licensePlate != null && $data.licensePlate != "") {
        if ($typeSelectVisible) {
            $$('#selectVignetteSection').show();
        } else {
            $typeSelectVisible = true;
            $$('#selectVignetteSection').css("height", "0px").show().addClass("sliding").css("height", "56px");
        }
    }
    if ($data.selectedVignetteId != null && $data.selectedVignetteId != "") {
        if ($data.validityInfo.from == "" || $data.validityInfo.to == "") {
            setDefaultValidity();
        }
        if ($dateSelectVisible) {
            $$('#selectValiditySection').show();
        } else {
            $dateSelectVisible = true;
            $$('#selectValiditySection').css("height", "0px").show().addClass("sliding").css("height", "56px");
        }
    }
    if ($data.isComplete()) {
        $$('#payWithBarionButton').show();
    }
}

function setDefaultValidity() {
    if ($data.selectedVignetteValidity == "365") {
        var startDate = new Date();
        var endDate = new Date((new Date().getFullYear() + 1) + "-01-31");
        $data.validityInfo.from = startDate.toLocaleDateString("en-US");
        $data.validityInfo.to = endDate.toLocaleDateString("en-US");
        $$("#changeValidityButton").removeClass("item-link");
        $$(".edit-validity").hide();
    } else {
        var selectedDays = parseInt($data.selectedVignetteValidity);
        var startDate = new Date();
        var endDate = new Date();
        endDate.setDate(endDate.getDate() + selectedDays);
        $data.validityInfo.from = startDate.toLocaleDateString("en-US");
        $data.validityInfo.to = endDate.toLocaleDateString("en-US");
        $$("#changeValidityButton").addClass("item-link");
        $$(".edit-validity").show();
    }
    $$(".validity-range").text($data.getValidityRange());
}

$$(document).on('DOMContentLoaded', function(){

    //pre-complie templates
    var vignetteTypesTemplate = $$('script#vignetteTypesTemplate').html();
    $cVignetteTypesTemplate = Template7.compile(vignetteTypesTemplate);

    var selectVehicleTemplate = $$('script#selectVehicleTemplate').html();
    var selectVignetteTemplate = $$('script#selectVignetteTemplate').html();
    var selectValidityTemplate = $$('script#selectValidityTemplate').html();

    Template7.registerPartial('selectVehicle', selectVehicleTemplate);
    Template7.registerPartial('selectVignette', selectVignetteTemplate);
    Template7.registerPartial('selectValidity', selectValidityTemplate);

    var contentTemplate = $$('script#contentTemplate').html();
    $cContentTemplate = Template7.compile(contentTemplate);

    initMainPage();
    
    if ($$('html.device-ios').length > 0) {
        $$('body').scrollTop(20);
        $$('.view').scrollTop(20);
    } else {
        app.statusbar.hide();
        $$('body').scrollTop(20);
        $$('.view').scrollTop(20);
    }

    $$(document).on('click', "#payWithBarionButton", startPayment);
    $$(document).on('click', "#buyVignetteButton", startPayment);
    $$(document).on('click', "#setShippingButton", barionMarket.getShippingAddress);
    $$(document).on('click', "#resultButton", barionMarket.closePlugin);
    $$(document).on('click', "#exitButton", barionMarket.closePlugin);
    $$(document).on('click', "#changeAddressButton", barionMarket.selectAddress);
    $$(document).on('click', "#changeVehicleButton", barionMarket.getVehicle);

    $$(document).on('click', "#selectVignetteType", function(){
        var selectedVignetteId = $$(this).attr("data-vignette-id");
        $data.selectedVignetteId = selectedVignetteId;
        var idParams = selectedVignetteId.split("-");
        if (idParams != null && idParams.length > 2){
            $yearlyCountyVignetteTypes.forEach(function(item){
                if (item.productId == selectedVignetteId) {
                    $data.selectedVignette = item.productDescription + " " + item.productCounty;
                    $data.selectedVignetteName = item.productType;
                    $data.selectedVignetteValidity = item.productValidityDays;
                    $data.validityInfo.from = "";
                    $data.validityInfo.to = "";
                    return;
                }
            })
        } else {
            $highwaysVignetteTypes.forEach(function(item){
                if (item.productId == selectedVignetteId){
                    $data.selectedVignette = item.productDescription;
                    $data.selectedVignetteName = item.productType;
                    $data.selectedVignetteValidity = item.productValidityDays;
                    $data.validityInfo.from = "";
                    $data.validityInfo.to = "";
                    return;
                }
            })
        }
        
        mainView.router.back('/main/', { force: true });
    });

    $$(document).on('click', "#showVignetteTypes", function () {
        if ($vehicle.type != ""){
        mainView.router.navigate("/vignetteTypes/");
        } else {
            app.toast.create({
                closeTimeout: 3000,
                text: 'At first please select a vehicle.',
                position: 'center'
            }).open();
        }
    });   

    $$(document).on('click', ".backToList-link", function (e) {
        e.preventDefault();
        e.stopPropagation();
        mainView.router.back('/booklist/', { force: true });
    });

    $$(document).on('click', ".navbar, .statusbar", function (e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    });
});

function createRandomVehicle() {
    var t = "CAR";
    var r = Math.floor(Math.random() * 5);
    switch (r) {
        case 0: t = "CAR"; break;
        case 1: t = "BUS"; break;
        case 2: t = "VAN"; break;
        case 3: t = "MOTOR"; break;
        case 4: t = "TRAILER"; break;
    }
    var v = {
        licensePlate: "TST" + (100 + Math.floor(Math.random() * 900)),
        countryCode: "HU",
        category: t
    };
    setVehicle(JSON.stringify(v));
}   
     

function getVignetteTypesForVehicleCategory(vehicleCategory, callback){
    if (vehicleCategory != undefined){
    app.request({
        method: "GET",
        url: "/products?type="+vehicleCategory,
        error: function (xhr, status, error) {
            alert("ERROR: " + error + "\r\nStatus: " + status);
        },
        success: function (data, status, xhr) {
            if (status == 200) {
                callback(JSON.parse(data));
            } else {
            }
        }
    });
}
}


function startPayment() {
    $$("#payWithBarionButton").addClass('disabled').attr('disabled', 'disabled');
    var vignette = $data.selectedVignetteId;
    var vignettes = new Array();
    vignettes.push(vignette);
    app.request({
        method: "POST",
        url: "/payment/start",
        data: JSON.stringify({
            vIds: vignettes,
            locale: "hu-HU",
            currency: "HUF"

        }),
        contentType: "application/json",
        traditional: true,
        dataType: "json",
        error: function (xhr, status, error) {
            alert("ERROR: " + error + "\r\nStatus: " + status);
        },
        success: function (data, status, xhr) {
            if (status == 200) {
                //var content = $cRedirectTemplate;
                    //$$(".redirect-template").html(content);
                redirectToBarionPaymentGateway(data.paymentId);
                
            } else {
                alert("Request finished with status code '" + status + "', could not process response.");
            }
        },
        complete: function () {
            $$("#buyVignetteButton").removeClass('disabled').removeAttr('disabled');
        }
    });
}

function getPaymentState(paymentId){
    if (paymentId != "undefined") {
        app.request({
        method: "GET",
        url: "/payment/paymentstate?paymentId="+paymentId,
        error: function (xhr, status, error) {
            alert("ERROR: " + error + "\r\nStatus: " + status);
        },
        success: function (data, status, xhr) {
            if (JSON.parse(data).status == "Succeeded") {
                mainView.router.navigate('/done/', { animate: false });
            } else {
                mainView.router.navigate('/failed/', { animate: false });
            }
        },
        complete: function () {
            $$("#payWithBarionButton").removeClass('disabled').removeAttr('disabled');
        }
    });
    }
}

function redirectToBarionPaymentGateway(paymentId) {
    window.location.href = "https://test.barion.com/pay?id=" + paymentId;
}

function setVehicle(vehicle) {
    var s = JSON.parse(vehicle);
    $vehicle = {
        licensePlate: s.licensePlate,
        countryCode: s.countryCode,
        type: s.category
    };
    
    $data.licensePlate = $vehicle.licensePlate;
    $data.image = getIconByVehicleCategory($vehicle.type);
    
    var content = $cContentTemplate($data);
    $$(".page-content").html(content);
    
    showNextStep();
}

function getIconByVehicleCategory(category) {
    var imageUrl = "/img/vehicle_car.png";
    if (category != undefined){
        switch (category.toLowerCase()){
            case "bus":
            imageUrl = "/img/vehicle_bus.png";
            break;
            case "car":
            imageUrl = "/img/vehicle_car.png";
            break;
            case "van":
            imageUrl = "/img/vehicle_van.png";
            break;
            case "trailer":
            imageUrl = "/img/vehicle_trailer.png";
            break;
            case "motor":
            imageUrl = "/img/vehicle_motor.png";
            break;
            default:
            imageUrl = "/img/vehicle_car.png";
            break;
        }
    }
    return imageUrl;
}
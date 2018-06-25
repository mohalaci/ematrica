

var $productData;
var $vehicle = {
    licensePlate: "",
    type: "",
    countryCode: ""
};

var $data = {
    licensePlate: "",
    selectedVignette: "",
    selectedVignetteId: "",
    dateOfValidity: ""
}

var $highwaysVignetteTypes = [];
var $yearlyCountyVignetteTypes = [];

var $cContentTemplate;
var $cVignetteTypesTemplate;


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

function initMainPage(){
    var content = $cContentTemplate($data);
                        $$(".page-content").html(content);
                        $$('#payWithBarionButton').hide();
                        var calendarModal = app.calendar.create({
                            inputEl: '#demo-calendar-modal',
                            openIn: 'customModal',
                            minDate: new Date(),
                            maxDate: new Date(new Date().getFullYear(), 11, 31),
                            header: true,
                            footer: true,
                            animate: true,
                            dateFormat: 'MM dd yyyy',
                            on: {
                                change: function(calendar, data){
                                    console.log(data);
                                    $data.dateOfValidity = data;
                                    showBuyButton();
                                }
                            }
                          });   
}

function showBuyButton(){
    if ($data.licensePlate != null && $data.selectedVignetteId != null && $data.dateOfValidity != null){
        $$('#payWithBarionButton').show();
    }
}

$$(document).on('DOMContentLoaded', function(){

    

    //pre-complie templates
    var vignetteTypesTemplate = $$('script#vignetteTypesTemplate').html();
    $cVignetteTypesTemplate = Template7.compile(vignetteTypesTemplate);

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
                if (item.productId == selectedVignetteId){
                    $data.selectedVignette = item.productDescription + " " + item.productCounty;

                    return;
                }
            })
        } else {
            $highwaysVignetteTypes.forEach(function(item){
                if (item.productId == selectedVignetteId){
                    $data.selectedVignette = item.productDescription;
                    return;
                }
            })
        }
        //$data.vignetteType = selectedVignetteId;
        console.log(selectedVignetteId);
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
    console.log(vignette);
    var vignettes = new Array();
    vignettes.push(vignette);
    //vignettes.push(vignette);
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

function setVehicle(vehicle){
    console.log(vehicle);
    var s = JSON.parse(vehicle);
    $vehicle = {
        licensePlate: s.licensePlate,
        countryCode: s.countryCode,
        type: s.category
    };
    
    $data.licensePlate = $vehicle.licensePlate;
    
    var content = $cContentTemplate($data);
    $$(".page-content").html(content);
    showBuyButton();
}
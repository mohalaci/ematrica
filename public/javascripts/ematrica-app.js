var $selectedVignetteId;
var $vignetteList = [
    {
        vignetteId: "D1-01",
        vignetteTime: "Heti",
        vignetteTitle: "D1 heti matrica",
        vignettePrice: "2975 Ft"
    },
    {
        vignetteId: "D1-02",
        vignetteTime: "Havi",
        vignetteTitle: "D1 havi matrica",
        vignettePrice: "4780 Ft"
    },
    {
        vignetteId: "D1-03",
        vignetteTime: "Eves orszagos",
        vignetteTitle: "D1 eves orszagos matrica",
        vignettePrice: "42980 Ft"
    },
    {
        vignetteId: "D1-04",
        vignetteTime: "Eves megyei",
        vignetteTitle: "D1 eves megyei matrica",
        vignettePrice: "5000 Ft"
    }
];
var $shippingAddress = null;
var $defaultShipping = {
    "stairway": "A",
    "lastName": "Doe",
    "prefix": "Dr.",
    "firstName": "John",
    "street": "Teszt utca",
    "type": "Private",
    "comment": "",
    "city": "Budapest",
    "postalCode": "1234",
    "streetNumber": "32.",
    "floor": "2",
    "taxNumber": "10203040",
    "countryCode": "HU",
    "door": "5",
    "companyName": "Test Inc."
};
var $productData;
var $v = {
    licensePlate: "ASD321",
    type: "CAR",
    countryCode: "H"
};
var $summaryData = {
    vehicle: $v,
    address: $defaultShipping
}

var $cTimeTemplate;
var $cVignetteTemplate;
var $cSummaryTemplate;
var $cRedirectTemplate;

var app = new Framework7({
    root: '#app',
    name: 'My App',
    id: 'com.myapp.test',
    panel: {
        swipe: 'left',
    },
    routes: [
        {
            name: 'vignetteList',
            path: '/vignettelist/',
            page: 'vignettelist',
            url: '/',
            on: {
                pageInit: function (e, page) {
                    var content = $cVignetteTemplate({ vignetteList: $vignetteList });
                    $$(".list-template").html(content);
                }
            }
        },
        /*{
            name: 'bookdetails',
            path: '/bookdetails/',
            url: '/bookdetails.html',
            on: {
                pageInit: function (e, page) {
                    if ($selectedBook > 0) {
                        var bookData = books[$selectedBook - 1];
                        var content = $cDetailsTemplate(bookData);
                        $(".book-template").html(content);
                    }
                }
            }
        },*/
        {
            name: 'summary',
            path: '/summary/',
            url: '/summary.html',
            on: {
                pageInit: function (e, page) {
                    if ($v != null && $shippingAddress != null) {
                        //var bookData = books[$selectedBook - 1];
                        
                        //var content = $cSummaryTemplate({ summaryData: $v });
                        //$$(".summary-template").html(content);
                    }
                }
            }
        },
        {
            name: 'time',
            path: '/time/',
            url: '/',
            on: {
                pageInit: function (e, page) {
                    console.log("time oldal betoltodik");
                    if ($selectedVignetteId != null) {
                        //var bookData = books[$selectedBook - 1];
                        $vignette = {
                            time: "unknown",
                            title: "unknown"
                        };
                        switch ($selectedVignetteId) {
                            case "D1-01":
                                $vignette = {
                                    title: "matol 10 nap",
                                    time: "10 nap"
                                }
                                break;
                            case "D1-02":
                                $vignette = {
                                    title: "1 honap",
                                    time: "1 honap"
                                };
                                break;
                            case "D1-03":
                                $vignette = {
                                    title: "1 ev",
                                    time: "1 ev"
                                };
                                break;
                            case "D1-04":
                                $vignette = {
                                    title: "1 ev regionalis",
                                    time: "1 ev regionalis"
                                };
                                break;
                        };
                        $productData = {
                            vignetteId: $selectedVignetteId,
                            vignette: $vignette
                        };
                        var content = $cTimeTemplate({ productData: $productData });
                        console.log(content.productData);
                        $$(".time-template").html(content);
                    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    var calendarInline = app.calendar.create({
                        containerEl: '#demo-calendar-inline-container',
                        value: [new Date()],
                        weekHeader: false,
                        renderToolbar: function () {
                            return '<div class="toolbar calendar-custom-toolbar no-shadow">' +
                                '<div class="toolbar-inner">' +
                                '<div class="left">' +
                                '<a href="#" class="link icon-only"><i class="icon icon-back ' + (app.theme === 'md' ? 'color-black' : '') + '"></i></a>' +
                                '</div>' +
                                '<div class="center"></div>' +
                                '<div class="right">' +
                                '<a href="#" class="link icon-only"><i class="icon icon-forward ' + (app.theme === 'md' ? 'color-black' : '') + '"></i></a>' +
                                '</div>' +
                                '</div>' +
                                '</div>';
                        },
                        on: {
                            init: function (c) {
                                $$('.calendar-custom-toolbar .center').text(monthNames[c.currentMonth] + ', ' + c.currentYear);
                                $$('.calendar-custom-toolbar .left .link').on('click', function () {
                                    calendarInline.prevMonth();
                                });
                                $$('.calendar-custom-toolbar .right .link').on('click', function () {
                                    calendarInline.nextMonth();
                                });
                            },
                            monthYearChangeStart: function (c) {
                                $$('.calendar-custom-toolbar .center').text(monthNames[c.currentMonth] + ', ' + c.currentYear);
                            }
                        }
                    });

                    
                    }
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
        },
        {
            path: '/redirect',
            url: '/',
            on: {
                pageInit: function (e, page) {
                    var content = $cRedirectTemplate;
                    $$(".redirect-template").html(content);
                    var query = page.route.query;
                    console.log("redirect page init");
                    console.log(query);
                    getPaymentState(query.paymentId);
                }
            }
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
        iosBackgroundColor: '#1A80BB',
        materialBackgroundColor: '#1A80BB'
    }
});

var $$ = Dom7;

var barionMarket = new BarionMarket();
var mainView = app.views.create('.view-main');
mainView.router.allowPageChange = true;

app.statusbar.setIosTextColor('white');
app.statusbar.setBackgroundColor('#1A80BB');

app.on('init', function () {
    if ($$('html.ios').length > 0) {
        $$('body').scrollTop(20);
        $$('.view').scrollTop(20);
    } else {
        app.statusbar.hide();
    }
});

$$(document).on('DOMContentLoaded', function(){
    //pre-complie templates
    var timetTemplate = $$('script#timeTemplate').html();
    $cTimeTemplate = Template7.compile(timetTemplate);

    var vignetteTemplate = $$('script#vignetteTemplate').html();
    $cVignetteTemplate = Template7.compile(vignetteTemplate);

    var summaryTemplate = $$('script#summaryTemplate').html();
    $cSummaryTemplate = Template7.compile(summaryTemplate);

    var redirectTemplate = $$('script#redirectTemplate').html();
    $cRedirectTemplate = Template7.compile(redirectTemplate);

    var content = $cSummaryTemplate($v);
    $$(".list-template").html(content);

    $$(document).on('click', "#payWithBarionButton", startPayment);
    $$(document).on('click', "#buyVignetteButton", startPayment);
    $$(document).on('click', "#setShippingButton", barionMarket.getShippingAddress);
    $$(document).on('click', "#resultButton", barionMarket.closePlugin);
    $$(document).on('click', "#exitButton", barionMarket.closePlugin);
    $$(document).on('click', "#changeAddressButton", barionMarket.selectAddress);
    $$(document).on('click', "#changeVehicleButton", barionMarket.getVehicle);

    $$(document).on('click', "#selectVignetteButton", function () {
        var $card = $$(this).find('.card');
        $card.addClass('touched');
        $selectedVignetteId = $$(this).attr("data-vignette-id");
        mainView.router.navigate("/vignettelist/");
    });

    $$(document).on('click', ".vignette-type-list-item", function () {
        var $card = $$(this).find('.card');
        $card.addClass('touched');
        console.log("menjunk a time oldalra most azonnal!");
        $selectedVignetteId = $$(this).attr("data-vignette-id");
        mainView.router.navigate("/time/");
    });

    $$(document).on('click', ".backToList-link", function (e) {
        e.preventDefault();
        e.stopPropagation();
        mainView.router.back('/booklist/', { force: true });
    });

    $$(document).on('click', ".backToDetails-link", function (e) {
        e.preventDefault();
        e.stopPropagation();
        mainView.router.back('/bookdetails/', { force: true });
    });

    $$(document).on('click', ".book-link", function () {
        $selectedBook = $$(this).attr("data-book-id");
    });

    $$(document).on('click', ".navbar, .statusbar", function (e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    });
});



function startPayment() {
    $$("#buyVignetteButton").addClass('disabled').attr('disabled', 'disabled');
    var vignette = $selectedVignetteId;
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
                redirectToBarionPaymentGateway(data.paymentId);
                var content = $cRedirectTemplate;
                    $$(".redirect-template").html(content);
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
    var v = {
        licensePlate: s.licensePlate,
        countryCode: s.countryCode,
        type: s.category
    };
    var content = $cSummaryTemplate(v);
    $$(".list-template").html(content);
}
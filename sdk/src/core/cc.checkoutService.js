cc.define('cc.CheckoutService', function($http, $q, basketService){

    'use strict';

    var self = {};

    var FORM_DATA_HEADERS = {'Content-Type': 'application/x-www-form-urlencoded'},
        FULL_CHECKOUT_URL = cc.Config.checkoutUrl + 'ajax.php';
    
    //allow this service to raise events
    cc.observable.mixin(self);

    //we might want to put this into a different service
    var toFormData = function(obj) {
        var str = [];
        for(var p in obj){
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
        return str.join("&");
    };

    //The backend is not returning valid JSON.
    //It sends it wrapped with parenthesis.
    var toJson = function(str){
        if (!str || !str.length || str.length < 2){
            return null;
        }

        var jsonStr = str.substring(1, str.length -1);

        return JSON.parse(jsonStr);
    };

    var createQuoteData = function(){

        var data = {};
        basketService
            .getItems()
            .forEach(function(item){
                data[item.product.id] = {
                    qty: item.quantity,
                    variantID: item.getVariantID(),
                    //TODO: the option ID lives on the variant on the sencha version. Check again!
                    optionID: item.getOptionID()
                };
            });

        return data;
    };

    //we need to transform the checkoutModel into something the backend understands
    var createRequestData = function(checkoutModel){

        if (!checkoutModel){
            return null;
        }

        var modelCopy = cc.Util.clone(checkoutModel);
        var requestModel = {};

        if (modelCopy.billingAddress && modelCopy.billingAddress.country){
            modelCopy.billingAddress.country = checkoutModel.billingAddress.country.value;
            modelCopy.billingAddress.countryLabel = checkoutModel.billingAddress.country.label;
            requestModel.invoiceAddress = JSON.stringify(modelCopy.billingAddress);
        }

        if (modelCopy.shippingAddress && modelCopy.shippingAddress.country){
            modelCopy.shippingAddress.country = checkoutModel.shippingAddress.country.value;
            modelCopy.shippingAddress.countryLabel = checkoutModel.shippingAddress.country.label;
            requestModel.shippingAddress = JSON.stringify(modelCopy.shippingAddress);
        }

        if (modelCopy.selectedPaymentMethod && modelCopy.selectedPaymentMethod.method){
            requestModel.paymentMethod = JSON.stringify(modelCopy.selectedPaymentMethod.method);
        }

        if(modelCopy.selectedShippingMethod && modelCopy.selectedShippingMethod.method){
            requestModel.shippingMethod = JSON.stringify(modelCopy.selectedShippingMethod.method);
        }

        requestModel.quote = JSON.stringify(createQuoteData());

        return requestModel;
    };

    self.getSupportedCheckoutMethods = function(checkoutModel){

        var requestModel = createRequestData(checkoutModel);
        requestModel.task = 'GETPAYMENTMETHODS';

        return $http({
            method: 'POST',
            url: FULL_CHECKOUT_URL,
            headers: FORM_DATA_HEADERS,
            transformRequest: toFormData,
            data: requestModel
        })
        .then(function(response){
            var data = null;

            if(response.data ){
                data = toJson(response.data);

                if (data){

                    //We need to fix some types. It's a bug in the backend
                    //https://github.com/couchcommerce/admin/issues/42
                                                
                    data.paymentMethods = data.paymentMethods
                                            .map(function(method){
                                                method.surcharge = parseFloat(method.surcharge);
                                                return method;
                                            });

                    data.shippingMethods = data.shippingMethods
                                            .map(function(method){
                                                method.price = parseFloat(method.price);
                                                return method;
                                            });
                }
            }

            return data;
        }, function(fail){
            console.log(fail);
        });
    };

    self.checkoutWithCouchCommerce = function(checkoutModel){

        var requestModel = createRequestData(checkoutModel);
        requestModel.task = 'CHECKOUT';

        return $http({
            method: 'POST',
            url: FULL_CHECKOUT_URL,
            headers: FORM_DATA_HEADERS,
            transformRequest: toFormData,
            data: requestModel
        })
        .then(function(response){
            var data = null;
            if(response.data){
                data = toJson(response.data);
                data = data.token || null;
            }
            return data;
        }, function(fail){
            console.log(fail);
        });
    };

    var safeUse = function(property){
        return property === undefined || property === null ? '' : property;
    };

    //unfortunately the backend uses all sorts of different address formats
    //this one converts an address coming from a summary response to the
    //generic app address format.
    var convertAddress = function(backendAddress){

        backendAddress = backendAddress || {};

        var country = {
            value: safeUse(backendAddress.country),
            label: safeUse(backendAddress.countryname)
        };

        return {
            company:            safeUse(backendAddress.company),
            salutation:         safeUse(backendAddress.salutation),
            surname:            safeUse(backendAddress.lastname),
            name:               safeUse(backendAddress.firstname),
            street:             safeUse(backendAddress.street1),
            zip:                safeUse(backendAddress.zip),
            city:               safeUse(backendAddress.city),
            country:            !country.value ? null : country,
            email:              safeUse(backendAddress.email),
            telephone:          safeUse(backendAddress.telephone)
        };
    };

    //we want to make sure that the server returned summary can be used
    //out of the box to work with our summary templates/directives, hence
    //we have to convert it (similar to how we do it for the addresses).
    var convertSummary = function(backendSummary){
        backendSummary = backendSummary || {};

        return {
            sum:            safeUse(backendSummary.subtotal),
            shipping:       safeUse(backendSummary.shipping),
            surcharge:      safeUse(backendSummary.surcharge),
            vat:            safeUse(backendSummary.vat),
            total:          safeUse(backendSummary.grandtotal)
        };
    };

    self.getSummary = function(token){
        return $http({
            method: 'POST',
            url: cc.Config.checkoutUrl + 'summaryst.php',
            headers: FORM_DATA_HEADERS,
            transformRequest: toFormData,
            data: {
                details: 'get',
                token: token
            }
        })
        .then(function(response){
            var data = {};
            data.response = toJson(response.data);
            data.invoiceAddress = convertAddress(data.response.billing);
            data.shippingAddress = convertAddress(data.response.shipping);
            data.summary = convertSummary(data.response.totals);
            return data;
        });
    };

    //that's the final step to actually create the order on the backend
    self.activateOrder = function(token){
        return $http({
            method: 'POST',
            url: cc.Config.checkoutUrl + 'docheckoutst.php',
            headers: FORM_DATA_HEADERS,
            transformRequest: toFormData,
            data: {
                details: 'get',
                token: token
            }
        })
        .then(function(response){
            return toJson(response.data);
        });
    };

    return self;
});
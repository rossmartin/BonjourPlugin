// functions for PhoneGap & jQuery Mobile

//set jQuery Mobile Defaults
$(document).bind("mobileinit", function() {
    $.mobile.defaultPageTransition = "none"; // no page transitions b/c slower devices can't render
});

$(function() {
    document.addEventListener("deviceready", onDeviceReady, false);
});

function onDeviceReady() {
    $("div[data-role='page']").css("padding-top", "50px"); // needed after disabling tap toggle

    $("#deviceName").html('<u>Your Device Name</u><br>' + device.name);
    $("#devicePlatform").html('<u>Your Device Platform</u><br>' + device.platform);
    $("#deviceVersion").html('<u>Your Device Version</u><br>' + device.version);
    
//    $("div[data-role='content'] ul[data-role='listview'] li").css("line-height", "30px");
    console.log(
            'Device Name: ' + device.name + '\n' +
            'Device Cordova: ' + device.cordova + '\n' +
            'Device Platform: ' + device.platform + '\n' +
            'Device UUID: ' + device.uuid + '\n' +
            'Device Version: ' + device.version + '\n'
            );

    setupBonjour();
}

function isIpad() {
    try {
        console.log("device.platform == " + device.platform);
        if (device.platform == "iPad" || device.platform == "iPad Simulator") {
            return(true);
        } else {
            return(false);
        }
    } catch (e) {
        return(false);
    }
}

function wirelessIsConnected() { // check for WiFi connection
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.NONE] = 'No network connection';

    console.log('Connection type: ' + states[networkState]);

    if (states[networkState] == 'WiFi connection') {
        return true;
    } else {
        return false;
    }
}

function changePage(page) {
    $.mobile.changePage($(page));
}

function showDialog(code, messageVar) { // v1.1.4 RDM adding extra parameter messageVar to include dynamic messages
    console.log(arguments.callee.name + ": " + code);
    var message;
    var title;
    var buttonName = "OK";

    switch (code) {

        //success
        case 101:
            title = "Data Successfully Sent"
            message = "The JSON data was successfully sent to " + deviceNameToSendData + ".";
            break;

        case 102:
            title = "Data Successfully Received"
            message = "The JSON data was received.";
            break;

            //errors
        case 401:
            title = "No Internets Ruh Roh"
            message = "Please connect this device to your wireless router.";
            break;

        default:
            title = "Alert";
            message = "Default Alert Message";
            break;

    }

    navigator.notification.confirm(message, defaultAlertCallback, title, buttonName);
}

function defaultAlertCallback() {
    console.log(arguments.callee.name + "; alert success!!");
}

function showLoader() {
    $.mobile.showPageLoadingMsg();
}

function hideLoader() {
    $.mobile.hidePageLoadingMsg();
}
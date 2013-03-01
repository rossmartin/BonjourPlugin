// functions for PhoneGap & jQuery Mobile
var deviceNameToSendData;

//set jQuery Mobile Defaults
$(document).on('mobileinit', function() {
//$(document).bind("mobileinit", function() {
    console.log('mobileinit.start');
    $.mobile.defaultPageTransition = "none"; // no page transitions b/c slower devices can't render

    $('#publishService').live('tap', function(e) {
        console.log('publishService');
        if (wirelessIsConnected()){ // checks to see if device has wifi connection
            changePage("#publishPage");
        } else {
            showDialog(401); // show error for no wifi connectivity
        }
    });

    $('#startBrowser').live('tap', function(e) {
        console.log('startBrowser');
        if (wirelessIsConnected()){ // checks to see if device has wifi connection
            changePage("#browserPage");
        } else {
            showDialog(401); // show error for no wifi connectivity
        }
    });

    // browserPage jQM events
    $("#browserPage").live("pagebeforeshow", function(){
        console.log('about to browse');
        resetBrowserPage(); // resetBrowserPage function located below outside of dom ready
        window.plugins.bonjour.browse();
    });

    $("#browserPage").live("pagehide", function(){
        window.plugins.bonjour.stopServiceBrowser();
    });

    // publishPage jQM events

    $("#publishPage").live("pagebeforeshow", function(){
        resetPublishPage(); // resetPublishPage function located below outside of dom ready
        window.plugins.bonjour.publishService();
    });

    $("#publishPage").live("pagehide", function(){
        window.plugins.bonjour.stopService();
    });

    // browserPage functions

    $('#networkDevice').live('tap', function(e) {
        deviceNameToSendData = $(this).text(); // global defined above, will be used again in showDialog w/o being passed as a parameter
        showLoader();
        console.log("network device was clicked and deviceName ====> " + deviceNameToSendData);
        window.plugins.bonjour.selectService(deviceNameToSendData);
    });


    $('#resetBrowserPageButton').live('tap', function(e) {
        console.log("#resetBrowserPageButton was clicked, starting native call");
        // show original content now
        resetBrowserPage(); // resetBrowserPage function located below outside of dom ready
        window.plugins.bonjour.browse();
    });

    // publishPage functions

    $('#resetPublishPageButton').live('tap', function(e) {
        console.log("#resetPublishPageButton was clicked, starting native call");
        // show original content now
        resetPublishPage(); // resetPublishPage function located below outside of dom ready
        window.plugins.bonjour.publishService();
    });

    console.log('mobileinit.end');
});

// browserPage functions below that are outside of dom ready

function resetBrowserPage(){ // called in onpagebeforeshow
    $("#deviceListview").empty().hide();
    $("#doneSendingDataIcon, #resetBrowserPageButton").remove(); // remove done icon & reset btn if there
    $("#sendDataLoadIcon, #sendInstructionsContainer").show(); // show original content if it was hidden
    $("#lookForReceive").html("Looking for broadcasting devices..."); // reset to original content
    $("#sendInstructionsContainer").html('Go to "Publish Bonjour Service" on another iOS device running this app connected to this wireless network.'); // reset to original content
    $("#browserPage").trigger("create"); // calling this in case markup needs enhanced
}

function changeBrowserPage(){ // called from SocketClientDelegate.m when json string is sent from sender
    hideLoader();
    $("#deviceListview").empty();
    $("#deviceListview, #sendDataLoadIcon").hide();
    $("#doneSendingDataIcon, #resetSendContainer").remove(); // remove done icon & resetSendContainer if it is there
    $('<img id="doneSendingDataIcon" src="img/green-check.png" style="width:32px; height:32px; vertical-align:middle;" />').insertBefore( $("#lookForReceive") );
    $("#lookForReceive").html("Data Successfully Sent");
    $("#sendInstructionsContainer").html('The JSON data was sent to ' + deviceNameToSendData);
    $('<div id="resetSendContainer" style="padding-top:10px;">' +
       '<a data-role="button" id="resetBrowserPageButton" data-theme="c">Show Browser Again</a>' +
       '</div>').insertAfter( $("#deviceSendContainer") );
    $("#browserPage").trigger("create");
//    cordova.exec(stopServiceBrowserCB, stopServiceBrowserFail, 'BonjourPlugin', 'stopServiceBrowser', ['']);
}

// publishPage functions below that are outside of dom ready

function resetPublishPage(){ // called on pagebeforeshow
    if (!isIpad()){ // if device is iPhone or iPod
        $("#publishPageHeader").css("padding-left","45px");
    }
    $("#doneReceivingDataIcon, #resetPublishPageButton").remove(); // remove done icon & reset btn if there
    $("#receiveDataLoadIcon, #receiveInstructionsContainer").show(); // show original content if it was hidden
    $("#lookForSend").html("Now broadcasting..."); // reset to original content
    $("#receiveInstructionsContainer").html('Go to "Start Bonjour Browser" on another iOS device running this app connected to this wireless network.'); // reset to original content
    $("#publishPage").trigger("create"); // calling this in case markup needs enhanced
}

function changePublishPage(){ // called from SocketServerDelegate.m when the receiving device has fully read the receiving TCP byte stream
    $("#receiveDataLoadIcon").hide();
    $("#doneReceivingDataIcon").remove(); // remove done icon if it is there
    $('<img id="doneReceivingDataIcon" src="img/green-check.png" style="width:32px; height:32px; vertical-align:middle;" />').insertBefore( $("#lookForSend") );
    $("#lookForSend").html("Data Successfully Received");
    $("#receiveInstructionsContainer").html('This device successfully received JSON data from the sending device.');
    $('<div id="resetReceiveContainer" style="padding-top:10px;">' +
       '<a data-role="button" id="resetPublishPageButton" data-theme="c">Start Service Again</a>' +
       '</div>').insertAfter( $("#receiveInstructionsContainer") );
    $("#publishPage").trigger("create");

    //JSS - Probably comment this out to keep the service open.
//    window.plugins.bonjour.stopService();
    window.plugins.bonjour.sendClientData('Custom data to send.');
}

function showDataReceived(jsonEscaped){ // called from SocketServerDelegate.m when receiving device gets json data
    console.log("showDataReceived function is firing");
    //console.log("jsonEscaped ====> " + jsonEscaped);
    var jsonReceived = decodeURIComponent(jsonEscaped);
    jsonReceived = jsonReceived.replace("&#39;","'");  // sometimes an html entity slips through, replace it with apostrophe
    $("#receiveInstructionsContainer").append(
        '<div style="padding-top:20px;"><span style="color:blue">JSON Data Received ==> </span><span style="color:green;">'+jsonReceived+'</span></div>'
    );
}

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
        if (device.platform === "iPad" || device.platform === "iPad Simulator") {
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

    if (states[networkState] === 'WiFi connection') {
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
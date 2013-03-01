// Bonjour PhoneGap Plugin Sample - Ross Martin

//globals
var deviceNameToSendData;

$(function(){ // start of dom ready
    $('#publishService').live('tap', function(e) {
        if (wirelessIsConnected()){ // checks to see if device has wifi connection
            changePage("#publishPage");
        } else {
            showDialog(401); // show error for no wifi connectivity
        }
    });

    $('#startBrowser').live('tap', function(e) {
        if (wirelessIsConnected()){ // checks to see if device has wifi connection
            changePage("#browserPage");
        } else {
            showDialog(401); // show error for no wifi connectivity
        }
    });
  
    // browserPage jQM events

    $("#browserPage").on("pagebeforeshow", function(){
        resetBrowserPage(); // resetBrowserPage function located below outside of dom ready
        window.plugins.bonjour.browse();
    });
  
    $("#browserPage").on("pagehide", function(){
        window.plugins.bonjour.stopServiceBrowser();
    });
  
    // publishPage jQM events
  
    $("#publishPage").on("pagebeforeshow", function(){
        resetPublishPage(); // resetPublishPage function located below outside of dom ready
        window.plugins.bonjour.publishService();
//        cordova.exec(publishServiceCB, publishServiceFail, "BonjourPlugin", "publishService", [""]); // publishes bonjour service
    });
  
    $("#publishPage").on("pagehide", function(){
        window.plugins.bonjour.stopService();
//        cordova.exec(disconnectServiceCB, disconnectServiceFail, "BonjourPlugin", "stopService", [""]); // stops bonjour service
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
//        cordova.exec(publishServiceCB, publishServiceFail, "BonjourPlugin", "publishService", [""]);
    });
    
}); // end of dom ready

// callbacks here from native calls up above

function disconnectServiceCB(){
    console.log("disconnectServiceCB success callback");
}

function disconnectServiceFail(){
    console.log("disconnectServiceFail fail callback");        
}

function publishServiceCB(){
    console.log("publishServiceCB success callback");
}

function publishServiceFail(){
    console.log("publishServiceFail fail callback");
}

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
    //      Keep it consistent for now.
    window.plugins.bonjour.stopService();
//    cordova.exec(disconnectServiceCB, disconnectServiceFail, "BonjourPlugin", "stopService", [""]); // make native call to stop published service
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

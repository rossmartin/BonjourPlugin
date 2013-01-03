// Bonjour PhoneGap Plugin Sample - Ross Martin

//globals
var deviceNameToSendData;

$(function(){ // start of dom ready

    $("#mainPage").on("click", "#publishService", function(){
        if (wirelessIsConnected()){ // checks to see if device has wifi connection
            changePage("#publishPage");
        } else {
            showDialog(401); // show error for no wifi connectivity
        }
    });

    $("#mainPage").on("click", "#startBrowser", function(){
        if (wirelessIsConnected()){ // checks to see if device has wifi connection
            changePage("#browserPage");
        } else {
            showDialog(401); // show error for no wifi connectivity
        }
    });
  
    // browserPage jQM events

    $("#browserPage").on("pagebeforeshow", function(){
        resetBrowserPage(); // resetBrowserPage function located below outside of dom ready
        cordova.exec(sendDataCB, sendDataFail, "BonjourPlugin", "sendData", [""]); // starts bonjour service browser
    });
  
    $("#browserPage").on("pagehide", function(){
        cordova.exec(stopServiceBrowserCB, stopServiceBrowserFail, "BonjourPlugin", "stopServiceBrowser", [""]); // stops bonjour service browser
    });
  
    // publishPage jQM events
  
    $("#publishPage").on("pagebeforeshow", function(){
        resetPublishPage(); // resetPublishPage function located below outside of dom ready
        cordova.exec(receiveDataCB, receiveDataFail, "BonjourPlugin", "receiveData", [""]); // publishes bonjour service
    });
  
    $("#publishPage").on("pagehide", function(){
        cordova.exec(disconnectServiceCB, disconnectServiceFail, "BonjourPlugin", "stopService", [""]); // stops bonjour service
    });
  
    // browserPage functions
  
    $("#browserPage").on("click", "#networkDevice", function(){
        deviceNameToSendData = $(this).text(); // global defined above, will be used again in showDialog w/o being passed as a parameter
        showLoader();
        console.log("network device was clicked and deviceName ====> " + deviceNameToSendData);
        cordova.exec(selectServiceCB, selectServiceFail, "BonjourPlugin", "selectService", [deviceNameToSendData]);
    });

  
    $("#browserPage").on("click", "#resetBrowserPageButton", function(){
        console.log("#resetBrowserPageButton was clicked, starting native call");
        // show original content now
        resetBrowserPage(); // resetBrowserPage function located below outside of dom ready
        cordova.exec(sendDataCB, sendDataFail, "BonjourPlugin", "sendData", [""]);
    });
  
    // publishPage functions
  
    $("#publishPage").on("click", "#resetPublishPageButton", function(){
        console.log("#resetPublishPageButton was clicked, starting native call");
        // show original content now
        resetPublishPage(); // resetPublishPage function located below outside of dom ready
        cordova.exec(receiveDataCB, receiveDataFail, "BonjourPlugin", "receiveData", [""]);
    });
    
}); // end of dom ready

// callbacks here from native calls up above

function disconnectServiceCB(){
    console.log("disconnectServiceCB success callback");
}

function disconnectServiceFail(){
    console.log("disconnectServiceFail fail callback");        
}

function stopServiceBrowserCB(){
    console.log("stopServiceBrowserCB");
}

function stopServiceBrowserFail(){
    console.log("stopServiceBrowserFail");
}

function receiveDataCB(){
    console.log("receiveDataCB success callback");
}

function receiveDataFail(){
    console.log("receiveDataFail fail callback");
}

function selectServiceCB(){
    console.log("selectServiceCB success callback");
}

function selectServiceFail(){
    console.log("selectServiceFail fail callback");
}

function sendDataCB(){
    console.log("sendDataCB success callback");
}

function sendDataFail(){
    console.log("sendDataFail fail callback");
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

function changeBrowserPage(){ // called from NetServiceResolutionDelegate.m when json string is sent from sender
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
    cordova.exec(stopServiceBrowserCB, stopServiceBrowserFail, 'BonjourPlugin', 'stopServiceBrowser', ['']);
}

function appendNetworkDevices(jsonEscaped){ // called from SocketClientDelegate.m when sending device finishes finding devices over Bonjour
    console.log("appendNetworkDevices function is firing");
    console.log("jsonEscaped ====> " + jsonEscaped);
    var deviceJSON = decodeURIComponent(jsonEscaped);
    //console.log("deviceJSON " + deviceJSON );
    var deviceJSONArray = JSON.parse(deviceJSON);
    //console.log("deviceJSONArray ===> " + deviceJSONArray);
    $("#deviceListview").empty();
    $("#deviceListview").append('<li data-role="list-divider">Choose a Device to Send JSON</li>')
    for (var i = 0; i < deviceJSONArray.length; i++){
        var devName = deviceJSONArray[i].replace("&#39;","'");  // sometimes an html entity slips through, replace it with apostrophe
        console.log("deviceJSONArray[i] ===> " + devName);
        $('#deviceListview').append('<li class="more"><a href="#" id="networkDevice">'+devName+'</a></li>');
    }
    $("#deviceListview").listview("refresh");
    $("#browserPage").trigger("create");
    $("#deviceListview").show("slow");
}

function removeNetworkDevice(serviceNameEscaped){ // called from NetServiceBrowserDelegate.m when a service is removed
    console.log("removeNetworkDevice function is firing");
    console.log("jsonEscaped ====> " + serviceNameEscaped);
    var serviceName = decodeURIComponent(serviceNameEscaped);
    serviceName = serviceName.replace("&#39;","'");  // sometimes an html entity slips through, replace it with apostrophe
    console.log("serviceName ===> " + serviceName);
    
    // iterate the listview to find the right device to remove from it on the browser page
    var deviceCount = 0;
    $("#deviceListview #networkDevice").each(function(){
        if ( $(this).text() == serviceName ){
            $(this).parent().parent().parent().remove(); // remove the device from the listview
            $("#deviceListview").listview("refresh");
        }
        deviceCount++;
    });
    
    if (deviceCount == 1){ // if we only had 1 device to remove, empty & hide the device listview
        $("#deviceListview").empty().hide();
    }
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
    cordova.exec(disconnectServiceCB, disconnectServiceFail, "BonjourPlugin", "stopService", [""]); // make native call to stop published service
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

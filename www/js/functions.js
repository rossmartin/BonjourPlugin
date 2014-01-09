// functions for PhoneGap & jQuery Mobile

//set jQuery Mobile Defaults
$(document).bind("mobileinit", function(){
    $.mobile.defaultPageTransition = "none"; // no page transitions b/c slower devices can't render
});

$(function(){
    document.addEventListener("deviceready", onDeviceReady, false);
});

function onDeviceReady(){
    $("div[data-role='header'], div[data-role='footer']").attr("data-position","fixed");
    $("[data-role='header'], [data-role='footer']").fixedtoolbar({ tapToggle: false });
    $("div[data-role='page']").css("padding-top","50px"); // needed after disabling tap toggle
    $("div[data-role='footer']").html("<div style='text-align:center; line-height:50px;'>Bonjour, I'm a Fixed Footer :~o</div>");
    // put some empty listview elements onthe main page listview
    $("#mainListview").append(
        '<li data-role="list-divider">Your Device Info Below</li>' +
        '<li data-icon="false" class="main"><a href="#"><span class="underline">Your Device Name</span><br />'+device.name+'</a></li>' +
        '<li data-icon="false" class="main"><a href="#"><span class="underline">Your Device Platform</span><br />'+device.platform+'</a></li>' +
        '<li data-icon="false" class="main"><a href="#"><span class="underline">Your Device Version</span><br />iOS '+device.version+'</a></li>'
    );
    $(".underline").css("text-decoration","underline");
    $("#mainListview").listview("refresh"); // needed to enhance markup
    $("div[data-role='content'] ul[data-role='listview'] li").css("line-height","30px");
    console.log(
        'Device Name: '     + device.name     + '\n' +
        'Device Cordova: '  + device.cordova + '\n' +
        'Device Platform: ' + device.platform + '\n' +
        'Device UUID: '     + device.uuid     + '\n' +
        'Device Version: '  + device.version  + '\n'
    );
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
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';

    console.log('Connection type: ' + states[networkState]);
    
    if (states[networkState] == 'WiFi connection'){
        return true;
    } else {
        return false;
    }
}

function changePage(page){
	$.mobile.changePage($(page));
}

function showDialog(code, messageVar){
	console.log(arguments.callee.name + ": " + code);
	var message;
	var title;
	var buttonName = "OK";
	
	switch(code){

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

function defaultAlertCallback(){
	console.log(arguments.callee.name + "; alert success!!");
}

function showLoader(){
    $.mobile.showPageLoadingMsg();
}

function hideLoader(){
    $.mobile.hidePageLoadingMsg();
}

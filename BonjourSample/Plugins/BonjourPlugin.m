//
//  BonjourPlugin.m
//  BonjourSample
//
//  Created by Ross Martin on 12/8/12.
//
//

/********* BonjourPlugin.h Cordova Plugin Implementation *******/

#import "BonjourPlugin.h"
#import "AppDelegate.h"
#import <netinet/in.h>
#import <sys/socket.h>
#import "NetServiceBrowserDelegate.h"
#import "NetServicePublicationDelegate.h"
#import "NetServiceResolutionDelegate.h"
#import "GCDAsyncSocket.h" // this only uses TCP
#import "SocketServerDelegate.h" // server socket delegate methods are in SocketServerDelegate.m

NSNetService *service;
NSNetServiceBrowser *serviceBrowser;
NetServiceResolutionDelegate *nsResolutionDelegate;
GCDAsyncSocket *serverSocket;

@implementation BonjourPlugin

/***
browse is called from the browser page pagebeforeshow event.
A service browser is created and begins searching, it's
delegate methods are in NetServiceBrowserDelegate.m
You can make a call to this method to start a bonjour browser
***/
- (void) startBrowser:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = nil;
    NSString* javaScript = nil;

    NSString* serviceType = [command.arguments objectAtIndex:0];
    NSString* searchForServiceType = [NSString stringWithFormat:@"_%@._tcp.", serviceType];

    NetServiceBrowserDelegate *nsBrowserDelegate;
    nsBrowserDelegate = [[NetServiceBrowserDelegate alloc] init];
    serviceBrowser = [[NSNetServiceBrowser alloc] init];
    [serviceBrowser setDelegate:(id)nsBrowserDelegate];
    [serviceBrowser searchForServicesOfType:searchForServiceType inDomain:@"local."];

    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    javaScript = [pluginResult toSuccessCallbackString:command.callbackId];
    [self writeJavascript:javaScript];
}

/*** 
publishService is called from the publish page pagebeforeshow event.
A service browser is created and begins searching, it's
delegate methods are in NetServiceBrowserDelegate.m
You can make a call to this method to publish a bonjour service
***/
- (void) publishService:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = nil;
    NSString* javaScript = nil;
    
    NSString* serviceType = [command.arguments objectAtIndex:0];
    NSString* searchForServiceType = [NSString stringWithFormat:@"_%@._tcp.", serviceType];

    SocketServerDelegate *serverDelegate; // all the server socket delegate methods will be in SocketServerDelegate.m
    serverDelegate = [[SocketServerDelegate alloc] init];
    
//    GCDAsyncSocket *listenSocket;
    if (!serverSocket) {
        serverSocket = [[GCDAsyncSocket alloc] initWithDelegate:serverDelegate delegateQueue:dispatch_get_main_queue()];
    }
    
    NSError *err = nil;
	if ([serverSocket acceptOnPort:0 error:&err]) // create the server socket
	{
		// So what port did the OS give us?

		UInt16 port = [serverSocket localPort];
        NSLog(@"iOS gave us port %d", port);

		// Create and publish the bonjour service.
		// Obviously you will be using your own custom service type.
        
        NetServicePublicationDelegate *nsPublicationDelegate;
        nsPublicationDelegate = [[NetServicePublicationDelegate alloc] init];

		service = [[NSNetService alloc] initWithDomain:@"local."
                                        type:searchForServiceType
                                        name:@""
                                        port:port];

        if(service)
        {
            [service setDelegate:(id)nsPublicationDelegate];// 5
            [service publish];// 6
            NSLog(@"finished inside if(service)");
        }
        else
        {
            NSLog(@"An error occurred initializing the NSNetService object.");
        }

	}
	else
	{
		NSLog(@"Error in acceptOnPort:error: -> %@", err);
	}
        
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    javaScript = [pluginResult toSuccessCallbackString:command.callbackId];
    [self writeJavascript:javaScript];
}

// this is called when a device is selected on the browser page
- (void) selectService:(CDVInvokedUrlCommand *)command
{
    CDVPluginResult* pluginResult = nil;
    NSString* javaScript = nil;
    NSString* deviceNameIn = [command.arguments objectAtIndex:0]; // get deviceName from argument passed in cordova.exec
    
    //NSLog(@"BonjourPlugin.m selectService servicesArray ====> %@", servicesArray);
    //NSLog(@"deviceNameIn before for loop === > %@", deviceNameIn);
    
    NSString *svcName; // var holds service name from array
    int matchedNameIndex = 0; // holds index of the array if deviceName passed from js matches one in servicesArray iVar
    for (int i = 0; i < [servicesArray count]; i++){
        svcName = [[servicesArray objectAtIndex:i] name];
        //NSLog(@"svcName in for loop === > %@", svcName);
        if ([svcName isEqualToString:deviceNameIn]){ // this should always work, if not investigate single quotes & html entities
            matchedNameIndex = i;
        }
    }
    
    if (!nsResolutionDelegate) {
//    NetServiceResolutionDelegate *nsResolutionDelegate;
        nsResolutionDelegate = [[NetServiceResolutionDelegate alloc] init];
    }
    [[servicesArray objectAtIndex:matchedNameIndex] setDelegate:nsResolutionDelegate]; // use matchedNameIndex for right service selected
    [[servicesArray objectAtIndex:matchedNameIndex] resolveWithTimeout:5.0]; // use matchedNameIndex for right service selected
    
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    javaScript = [pluginResult toSuccessCallbackString:command.callbackId];
    [self writeJavascript:javaScript];
}

// this is called from the publish page pagehide event & when device has received json from sending device
- (void) unpublishService:(CDVInvokedUrlCommand *)command
{
    CDVPluginResult* pluginResult = nil;
    NSString* javaScript = nil;
    
    [service stop];
    [service stopMonitoring];
       
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    javaScript = [pluginResult toSuccessCallbackString:command.callbackId];
    [self writeJavascript:javaScript];
}

// this is called from the browser page pagehide event & when device has sent json to receiving device
- (void) stopBrowser:(CDVInvokedUrlCommand *)command
{
    CDVPluginResult* pluginResult = nil;
    NSString* javaScript = nil;
    
    [serviceBrowser stop];
       
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    javaScript = [pluginResult toSuccessCallbackString:command.callbackId];
    [self writeJavascript:javaScript];
}

// this is called when a device wants to sendData
- (void) sendDataToServer:(CDVInvokedUrlCommand *)command
{
    CDVPluginResult* pluginResult = nil;
    NSString* javaScript = nil;
    NSString* data = [command.arguments objectAtIndex:0];

    NSString *sendDataString = [NSString stringWithFormat:@"%@%@", data, @"\r\n" ]; // append CRLF after the JSON string, it is
    NSLog(@"sendDataToServer: %@", sendDataString);
    [[nsResolutionDelegate socket] writeData:[sendDataString dataUsingEncoding:NSUTF8StringEncoding]
                                 withTimeout:-1 tag:1];
    
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    javaScript = [pluginResult toSuccessCallbackString:command.callbackId];
    [self writeJavascript:javaScript];
}

- (void) sendDataToClient:(CDVInvokedUrlCommand *)command
{
    CDVPluginResult* pluginResult = nil;
    NSString* javaScript = nil;
    NSString* data = [command.arguments objectAtIndex:0];
    
    NSString *sendDataString = [NSString stringWithFormat:@"%@%@", data, @"\r\n" ]; // append CRLF after the JSON string, it is
    NSLog(@"sendDataToClient: %@", sendDataString);
    [serverSocket writeData:[sendDataString dataUsingEncoding:NSUTF8StringEncoding]
                                 withTimeout:-1 tag:1];
    
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    javaScript = [pluginResult toSuccessCallbackString:command.callbackId];
    [self writeJavascript:javaScript];
}


@end

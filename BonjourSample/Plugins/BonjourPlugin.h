//
//  BonjourPlugin.m
//  BonjourSample
//
//  Created by Ross Martin on 12/8/12.
//
//

/********* BonjourPlugin.h Cordova Plugin Header *******/

#import <Cordova/CDV.h>

@interface BonjourPlugin : CDVPlugin

- (void) startBrowser:(CDVInvokedUrlCommand*)command;

- (void) publishService:(CDVInvokedUrlCommand*)command;

- (void) selectService:(CDVInvokedUrlCommand*)command;

- (void) unpublishService:(CDVInvokedUrlCommand*)command;

- (void) stopBrowser:(CDVInvokedUrlCommand*)command;
/*
- (void) clientReceivedData:(CDVInvokedUrlCommand*)command;

- (void) serverReceivedData:(CDVInvokedUrlCommand*)command;
*/
@end
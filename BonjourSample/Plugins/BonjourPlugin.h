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

- (void) browse:(CDVInvokedUrlCommand*)command;

- (void) publishService:(CDVInvokedUrlCommand*)command;

- (void) selectService:(CDVInvokedUrlCommand*)command;

- (void) stopService:(CDVInvokedUrlCommand*)command;

- (void) stopServiceBrowser:(CDVInvokedUrlCommand*)command;

- (void) sendClientData:(CDVInvokedUrlCommand*)command;

- (void) sendServerData:(CDVInvokedUrlCommand*)command;

@end
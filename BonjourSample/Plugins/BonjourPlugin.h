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

- (void) sendData:(CDVInvokedUrlCommand*)command;

- (void) receiveData:(CDVInvokedUrlCommand*)command;

- (void) selectService:(CDVInvokedUrlCommand*)command;

- (void) stopService:(CDVInvokedUrlCommand*)command;

- (void) stopServiceBrowser:(CDVInvokedUrlCommand*)command;

@end
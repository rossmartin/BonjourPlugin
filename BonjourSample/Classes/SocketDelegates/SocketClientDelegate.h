//
//  SocketClientDelegate.h
//  BonjourSample
//
//  Created by Ross Martin on 12/29/12.
//
//

#import <Foundation/Foundation.h>
#import "GCDAsyncSocket.h"

@interface SocketClientDelegate : NSObject {}

- (void)socket:(GCDAsyncSocket *)sender didConnectToHost:(NSString *)host port:(UInt16)port;
- (void)socket:(GCDAsyncSocket *)sender didReadData:(NSData *)data withTag:(long)tag;
- (void)socket:(GCDAsyncSocket *)sock didWriteDataWithTag:(long)tag;
- (void)socket:(GCDAsyncSocket *)sender writeData:(NSData *)data withTag:(long)tag;

- (void)socketDidDisconnect:(GCDAsyncSocket *)sender withError:(NSError *)error;

@end

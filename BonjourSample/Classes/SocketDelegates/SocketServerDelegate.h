//
//  SocketServerDelegate.h
//  BonjourSample
//
//  Created by Ross Martin on 12/29/12.
//
//

#import <Foundation/Foundation.h>
#import "GCDAsyncSocket.h"

@interface SocketServerDelegate : NSObject {}

- (void)socket:(GCDAsyncSocket *)sender didAcceptNewSocket:(GCDAsyncSocket *)newSocket;
- (void)socket:(GCDAsyncSocket *)sock didWriteDataWithTag:(long)tag;
- (void)socket:(GCDAsyncSocket *)sender didReadData:(NSData *)data withTag:(long)tag;
- (void)socket:(GCDAsyncSocket *)sender didReadPartialDataOfLength:(NSUInteger)partialLength tag:(long)tag;
- (void)socketDidDisconnect:(GCDAsyncSocket *)sender withError:(NSError *)error;

@end

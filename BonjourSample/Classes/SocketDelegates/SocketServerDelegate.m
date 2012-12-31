//
//  SocketServerDelegate.m
//  BonjourSample
//
//  Created by Ross Martin on 12/29/12.
//
//

#import "SocketServerDelegate.h"
#import "AppDelegate.h"
#import "GCDAsyncSocket.h"

#define TAG_ASK_FOR_JSON 12
#define TAG_READ_JSON_DATA 13

@implementation SocketServerDelegate

// GCDAsyncSocket delegate, called when the server (device receiving JSON) accepts an incoming client connection.  another socket is spawned to handle it.
- (void)socket:(GCDAsyncSocket *)sender didAcceptNewSocket:(GCDAsyncSocket *)newSocket
{
    // The "sender" parameter is the listenSocket we created.
    // The "newSocket" is a new instance of GCDAsyncSocket.
    // It represents the accepted incoming client connection.

    // Do server stuff with newSocket...
    NSLog(@"Accepted new socket from %@:%hu", [newSocket connectedHost], [newSocket connectedPort]);

    NSString *welcomMessage = @"Server says Hi, send me some JSON \r\n";
    [newSocket writeData:[welcomMessage dataUsingEncoding:NSUTF8StringEncoding] withTimeout:-1 tag:TAG_ASK_FOR_JSON];
}

// GCDAsyncSocket delegate, this occurs when the server has sent the message asking the client to send JSON
- (void)socket:(GCDAsyncSocket *)sock didWriteDataWithTag:(long)tag
{
    if (tag == TAG_ASK_FOR_JSON) {
        NSLog(@"didWriteDataWithTag tag (TAG_ASK_FOR_JSON) in SocketServerDelegate.m - First Request sent from server to device sending JSON, asking it to send JSON data");
        
        // Now start the queue to read in the JSON stream from the client
        [sock readDataToData:[GCDAsyncSocket CRLFData] withTimeout:-1 tag:TAG_READ_JSON_DATA]; // parse all the way to CRLF
        
        // You can even specify what should be used as a terminator for a byte stream
        //NSData *term = [@"\r\n\r\n" dataUsingEncoding:NSUTF8StringEncoding];
        //[socket readDataToData:term withTimeout:-1 tag:HTTP_HEADER];
    }
}

// GCDAsyncSocket delegate, this didReadData is for data coming from client (device sending json)
- (void)socket:(GCDAsyncSocket *)sender didReadData:(NSData *)data withTag:(long)tag
{
    //NSLog(@"didReadData method is firing in SocketServerDelegate.m");
    if (tag == TAG_READ_JSON_DATA) { // tags are not sent over the socket
        [sender readDataToData:[GCDAsyncSocket CRLFData] withTimeout:-1 tag:1]; // read all the way to CRLF terminator
        
        NSString *dataString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
        NSLog(@"didReadData in SocketServerDelegate.m, JSON data coming from client (device sending) is ===> %@", dataString);
        
        NSString *jsonEscaped = [dataString stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
        
        // store nsdata - this will store the JSON byte stream to JSON-Received.txt
        NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
        NSString *documentsDirectory = [paths objectAtIndex:0]; // access documents directory
        NSString *filePath = [documentsDirectory stringByAppendingPathComponent:@"JSON-Received.txt"];
        
        [data writeToFile:filePath atomically:YES];
        //Write it overwriting any previous file (atomically writes to a temporary location before copying to permanent - good protection in case app should crash)
        
        AppDelegate *appDelegate = [[UIApplication sharedApplication] delegate];
        [appDelegate.viewController.webView stringByEvaluatingJavaScriptFromString:@"showDialog(102);"]; // show success for receiving JSON data
        [appDelegate.viewController.webView stringByEvaluatingJavaScriptFromString:@"changePublishPage();"]; // in bonjour.js
        NSString *jsCallBack = [[NSString alloc] initWithFormat:@"showDataReceived('%@');", jsonEscaped]; // show received JSON data function in bonjour.js
        [appDelegate.viewController.webView stringByEvaluatingJavaScriptFromString:jsCallBack];
    }
    
}

// GCDAsyncSocket delegate, this didReadPartialDataOfLength is for data coming from client (device sending backup file)
- (void)socket:(GCDAsyncSocket *)sender didReadPartialDataOfLength:(NSUInteger)partialLength tag:(long)tag
{
    if (tag == TAG_READ_JSON_DATA){
        //NSLog(@"didReadPartialDataOfLength method is firing in BonjourPlugin.m");
        //NSLog(@"partialLength ====> %d", partialLength);
    }
}

// GCDAsyncSocket delegate, called when a socket disconnects with or without error
- (void)socketDidDisconnect:(GCDAsyncSocket *)sender withError:(NSError *)error
{
    NSLog(@"socketDidDisconnect is firing in BonjourPlugin.m for device receiving (server)");
}

@end

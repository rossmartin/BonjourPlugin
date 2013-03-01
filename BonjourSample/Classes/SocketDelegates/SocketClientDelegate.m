//
//  SocketClientDelegate.m
//  BonjourSample
//
//  Created by Ross Martin on 12/29/12.
//
//

#import "SocketClientDelegate.h"
#import "AppDelegate.h"
#import "GCDAsyncSocket.h"

#define TAG_READ_RECEIVER_DATA 10
#define TAG_SEND_JSON_DATA 11

@implementation SocketClientDelegate

// GCDAsyncSocket delegate, this is called when sender (client) connects to receiver (server)
- (void)socket:(GCDAsyncSocket *)sender didConnectToHost:(NSString *)host port:(UInt16)port
{
    NSLog(@"Connected to server:%@ on port:%d", host, port);
    
    // here you could send data, but in this case we want to put a read in the queue and wait until the server sends message asking for JSON
    
    //NSString *someStr = @"test string \r\n"; // use CRLF for stream terminator
    //NSData *someData = [someStr dataUsingEncoding:NSUTF8StringEncoding];
    //[sender writeData:someData withTimeout:-1 tag:1];

    NSString* address = [NSString stringWithFormat:@"%@:%hu", host, port];

    AppDelegate *appDelegate = [[UIApplication sharedApplication] delegate];
    NSString *jsCallBack = [[NSString alloc] initWithFormat:@"window.plugins.bonjour.didConnectToHost('%@');", address];
    [appDelegate.viewController.webView stringByEvaluatingJavaScriptFromString:jsCallBack];

    // put a read in the queue, read all the way to CRLF
    [sender readDataToData:[GCDAsyncSocket CRLFData] withTimeout:-1 tag:TAG_READ_RECEIVER_DATA];
}


// GCDAsyncSocket delegate, this writeData is for data coming from server (device receiving JSON)
- (void)socket:(GCDAsyncSocket *)sender writeData:(NSData *)data withTag:(long)tag
{
    NSString *sendDataString = [NSString stringWithFormat:@"%@%@", data, @"\r\n" ]; // append CRLF after the JSON string, it is the stream terminator
    [sender writeData:[sendDataString dataUsingEncoding:NSUTF8StringEncoding] withTimeout:-1 tag:TAG_SEND_JSON_DATA];
}

// GCDAsyncSocket delegate, this didReadData is for data coming from server (device receiving JSON)
- (void)socket:(GCDAsyncSocket *)sender didReadData:(NSData *)data withTag:(long)tag
{
    //NSLog(@"didReadData method is firing in NetServiceResolutionDelegate.m");
    if (tag == TAG_READ_RECEIVER_DATA) { // tags are not sent over the socket
        NSLog(@"didReadData method tag (TAG_READ_RECEIVER_DATA) in SocketClientDelegate.m");
        NSString *dataString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
        NSLog(@"data in SocketClientDelegate.m didReadData ===> %@", dataString); // resonse from server, asking for JSON

        NSLog(@"*********** didReadData ************");
        
        
        AppDelegate *appDelegate = [[UIApplication sharedApplication] delegate];
        NSString *theData = [dataString substringToIndex:[dataString length]-2]; //trim the \r\n
        NSString *jsCallBack = [[NSString alloc] initWithFormat:@"window.plugins.bonjour.clientReceivedData('%@');", theData];
        [appDelegate.viewController.webView stringByEvaluatingJavaScriptFromString:jsCallBack];

        // get nsdata - I'm leaving this below, this shows how you could get JSON from an existing file
        
        //NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
        //NSString *documentsDirectory = [paths objectAtIndex:0]; // Get documents directory
        //NSString *filePath = [documentsDirectory stringByAppendingPathComponent:@"JSON-String.txt"];
        //NSData *fileData;
        //fileData = [NSData dataWithContentsOfFile:filePath];
        //if (!fileData){
        //    NSLog(@"Error - File not found");
        //}
/*JSS-
        NSMutableArray *jsonArray;
        jsonArray = [NSMutableArray arrayWithObjects: @"The", @"best", @"things", @"in", @"life", @"are", @"free", @" ;'~) ", nil];
        // the JSON data can have an apostrophe in it, like the last index in the array above
        
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:jsonArray options:NSJSONWritingPrettyPrinted error:nil];
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        jsonString = [jsonString stringByReplacingOccurrencesOfString:@"'" withString:@"&#39;"]; // replace apostrophe with html entity        
        NSString *sendDataString = [NSString stringWithFormat:@"%@%@", jsonString, @"\r\n" ]; // append CRLF after the JSON string, it is the stream terminator
        
        [sender writeData:[sendDataString dataUsingEncoding:NSUTF8StringEncoding] withTimeout:-1 tag:TAG_SEND_JSON_DATA];
-JSS*/
    }
}

// GCDAsyncSocket delegate, this didWriteData is for the client (device sending JSON)
- (void)socket:(GCDAsyncSocket *)sock didWriteDataWithTag:(long)tag
{
    if (tag == TAG_SEND_JSON_DATA) {
        NSLog(@"didWriteDataWithTag - Tag (TAG_SEND_JSON_DATA) JSON sent from device sending backup to device receiving backup (server) in SocketClientDelegate.m ");
        // could queue up a read here if receiving device wants to send back a response after receiving json
        AppDelegate *appDelegate = [[UIApplication sharedApplication] delegate];
        [appDelegate.viewController.webView stringByEvaluatingJavaScriptFromString:@"changeBrowserPage();"]; // show success on browserPage
        [appDelegate.viewController.webView stringByEvaluatingJavaScriptFromString:@"showDialog(101);"]; // success dialog for file being sent
    }
}

// GCDAsyncSocket delegate, called when a socket disconnects with or without error
- (void)socketDidDisconnect:(GCDAsyncSocket *)sender withError:(NSError *)error
{
    NSLog(@"JSS: socketDidDisconnect is firing in SocketClientDelegate.m for device sending (client)");
    NSLog(@"Error Text: %@", [error localizedDescription]);
    
    AppDelegate *appDelegate = [[UIApplication sharedApplication] delegate];

    NSString *errorText = [error localizedDescription];
    NSString *jsCallBack = [[NSString alloc] initWithFormat:@"window.plugins.bonjour.clientSocketDidDisconnect('%@');", errorText];
    [appDelegate.viewController.webView stringByEvaluatingJavaScriptFromString:jsCallBack];

}

@end

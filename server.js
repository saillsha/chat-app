var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};
var chatServer = require('./lib/chat_server');

function send404(response){
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('Error 404: resource not found');
    response.end();
}

function sendFile(response, filePath, fileContents){
    response.writeHead(200, {'Content-Type': mime.lookup(path.basename(filePath))});
    response.end(fileContents);
}

function serveStatic(response, cache, absPath) {
    if(cache[absPath]){ //serve from cache if cache hit
        sendFile(response, absPath, cache[absPath]);
    }
    else{ //read in file and add to cache
        fs.exists(absPath, function(exists){
            if(exists){
                fs.readFile(absPath, function(err, data){
                    if(err){
                        send404(response); //error reading file
                    }
                    else{
                        cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                })
            }
            else{
                send404(response); //file not found
            }
        })
    }
}

var server = http.createServer(function(request, response){
    var filePath = false;
    if(request.url == '/'){
        filePath = 'public/index.html';
    }
    else{
        filePath = 'public' + request.url;
    }
    var absPath = './' + filePath;
    serveStatic(response, cache, absPath);
});

chatServer.listen(server);

server.listen(3000, function(){
    console.log("server firing up on port 3000");
})
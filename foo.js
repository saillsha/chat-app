var flow_token = "093d062d14c0932dc9e5f24e55c7defb";
var user_token = "0f2eefe59753901b3a9b04448c861182";
var organization = "sahil-shah";
var flow = "testing";

var https = require('https');
var EventSource = require("eventsource");
//map user IDs to nicknames
// var userMap = {};
var streamURL = "https://"+user_token+"@stream.flowdock.com/flows/"+organization+"/"+flow;

var jokes = require("./jokes.json");
var eventsource = new EventSource(streamURL);
eventsource.onmessage = function(e){
    var message = JSON.parse(e.data);
    var post_options = {
        hostname: "api.flowdock.com",
        path: "/v1/messages/chat/"+flow_token,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    if(message.event == "message" && message.user in jokes){
        var post_req = https.request(post_options, function(res){
            console.log(res.statusCode);
            console.log(JSON.stringify(res.headers));
        });
        var content = {
            content: jokes[message.user][1],
            external_user_name: jokes[message.user][0]
        }
        post_req.write(JSON.stringify(content));
        post_req.end();
    }
}
eventsource.onerror = function(){
    console.log("ERROR");
}

// console.log("https://"+user_token+"@api.flowdock.com/flows/nomi/main/users");
// https.get("https://"+user_token+"@api.flowdock.com/flows/nomi/main/users", function(response){
//     var output = '';
//     response.on('data', function(data){
//         output += data;
//     })

//     response.on('end', function(data){
//         var data = JSON.parse(output);
//         for(var index in data){
//             var user = data[index];
//             userMap[user.id] = user.nick;
//         }
//         console.dir(userMap);
//     })
// }).on("error", function(e){
//     console.log("ERROR: "+e.message);
// })
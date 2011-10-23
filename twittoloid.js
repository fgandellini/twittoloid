/*
var express = require('express');
var app = express.createServer();
app.get('/', function(req, res){
    res.send('Hello World');
});
app.listen(8080);
console.log('Express running at http://127.0.0.1:8080/');

var io = require('socket.io').listen(8080);
io.sockets.on('connection', function (socket) {
  socket.emit('tweet', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

var socket = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
  socket.emit('twittoloid-client-connected', { hello: 'twittoloid client!' });
});
*/

/*
io.sockets.on('connection', function (socket) {
    socket.emit('twittoloid-client-connected', { hello: 'twittoloid client!' });
    sys.puts('new client connected!');
});
*/

var sys = require('sys');
    
var server = require('http').createServer(function(req, res){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('<h1>Twitter live stream</h1>');
});
server.listen(8080);
console.log('Server running at http://127.0.0.1:8080/');

var TwitterNode = require('./twitter-node').TwitterNode;
var twitterNodeConfig = {
  user: 'twittoloid', 
  password: 'polentone',
  action: 'links',
  track: ['simoncelli', 'mega', 'tette']
};

var twitter = new TwitterNode(twitterNodeConfig);

twitter
.addListener('error', function(error){
    console.log(error.message);
})
.addListener('tweet', function(tweet){
    io.sockets.emit('tweet', JSON.stringify(tweet));

//socket.broadcast(JSON.stringify(tweet));
//socket.emit('tweet', JSON.stringify(tweet));
//sys.puts("@" + tweet.user.screen_name + ": " + tweet.text);
//sys.puts(JSON.stringify(tweet));
})
.addListener('limit', function(limit){ 
    sys.puts('LIMIT: ' + sys.inspect(limit));
})
.addListener('delete', function(del){
    sys.puts('DELETE: ' + sys.inspect(del));
})
.addListener('end', function(resp){
    sys.puts('wave goodbye...' + resp.statusCode);
})
.stream();

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
  socket.on('searchfor', function (keyword) {
    sys.puts('client asked tweets for: ' + keyword);
    twitter.stream();
    twitter.trackKeywords = [];
    twitter.track(keyword);
    //twitter.stream();
    
    //var lookingfor = twitter.trackKeywords.join(', ');
    //sys.puts('twittoloid is currently looking for: ' + lookingfor);
  });
});

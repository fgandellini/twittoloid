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
  action: 'filter',
  track: ['stogiasbavando']
};

var twitter = new TwitterNode(twitterNodeConfig);

var hasLinks = function(tweet) {
    /*
    var url, _i, _len;
    for (_i = 0, _len = urls.length; _i < _len; _i++) {
        url = urls[_i];
        url.expanded(url);
    }
    */
    /*
    var url, _i, _len, _ref;
    datas - JSON.parse(json);
    _ref = data.urls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      url = _ref[_i];
      url.expanded_url;
    }
    */
    /*
    console.log("data:"+JSON.stringify(tweet)+" urls:"+tweet.urls);

    console.dir(tweet);
if ((typeof tweet != "undefined" && tweet !== null ? tweet.urls : void 0) != null) {
  return true;
}
return false;
*/
    if ((typeof tweet != "undefined" && tweet !== null ? tweet.urls : void 0) !== null) {
        return true;
    }
    return false;
/*
    sys.puts(tweet.urls);
    if (tweet.urls !== null && (tweet.urls != 'undefined') && tweet.urls.length > 0)
        return true;
    return false;*/
    
};

twitter
.addListener('error', function(error){
    console.log(error.message);
})
.addListener('tweet', function(tweet){
    
    if (hasLinks(tweet)) {
        io.sockets.emit('tweet-with-links', tweet);
    } else {
        io.sockets.emit('tweet-without-links', tweet);
    }

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
